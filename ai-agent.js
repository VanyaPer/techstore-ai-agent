// ai-agent.js - English version of the AI Assistant (Updated welcome message)

let agentPhones = []; 

function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    if (chatWindow) {
        chatWindow.classList.toggle('hidden');
    }
}

function addMessage(text, isUser = false) {
    const messages = document.getElementById('chat-messages');
    if (!messages) return;

    const div = document.createElement('div');
    div.className = `chat-message p-4 rounded-2xl ${isUser ? 'ml-auto bg-blue-600 text-white' : 'mr-auto bg-white border shadow-sm'}`;
    div.innerHTML = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function sendQuickReply(text) {
    const input = document.getElementById('user-input');
    if (input) {
        input.value = text;
        sendMessage();
    }
}

function getAllPhonesList() {
    if (!agentPhones || agentPhones.length === 0) return "Sorry, the product list is currently unavailable. 😔";
    
    let listHtml = "📋 <strong>Our Price List:</strong><br><br>";
    agentPhones.forEach(p => {
        listHtml += `• <strong>${p.name}</strong> — ${p.price.toLocaleString('uk-UA')} UAH<br>`;
    });
    listHtml += "<br>Use quick buttons for faster choices!";
    return listHtml;
}

function parseSinglePhone(text) {
    let q = text.toLowerCase().trim().replace(/\+/g, "plus");
    if (!agentPhones || agentPhones.length === 0) return null;

    let bestMatch = null;
    let maxScore = 0;

    const modelMarkers = {
        "iPhone 16 Pro": ["iphone", "16", "pro"],
        "iPhone 16 Plus": ["iphone", "16", "plus"],
        "iPhone 16": ["iphone", "16"],
        "Samsung Galaxy S25 Ultra": ["samsung", "s25", "ultra"],
        "Samsung Galaxy S25+": ["samsung", "s25", "plus"],
        "Samsung Galaxy S25": ["samsung", "s25"],
        "Google Pixel 9 Pro": ["google", "pixel", "9", "pro"],
        "Google Pixel 9": ["google", "pixel", "9"]
    };

    for (let modelName in modelMarkers) {
        let score = 0;
        const markers = modelMarkers[modelName];

        markers.forEach(marker => {
            if (q.includes(marker)) score += 1;
        });

        if (modelName.includes("Pro") && !q.includes("pro")) score = 0;
        if (modelName.includes("Ultra") && !q.includes("ultra")) score = 0;
        if ((modelName.includes("Plus") || modelName.includes("+")) && !q.includes("plus")) score = 0;

        if (!modelName.includes("Pro") && !modelName.includes("Plus") && !modelName.includes("Ultra") && !modelName.includes("+")) {
            if (q.includes("pro") || q.includes("plus") || q.includes("ultra")) {
                score = 0;
            }
        }

        if (score > maxScore) {
            maxScore = score;
            bestMatch = agentPhones.find(p => p.name === modelName);
        }
    }

    return maxScore >= 1 ? bestMatch : null;
}

function findPhonesInQuery(query) {
    if (!agentPhones || agentPhones.length === 0) return [];
    let q = query.toLowerCase().replace(/\+/g, "plus");

    if (q.includes("iphone 16") && q.includes("pro")) {
        return [agentPhones.find(p => p.name === "iPhone 16"), agentPhones.find(p => p.name === "iPhone 16 Pro")];
    }
    if (q.includes("iphone 16") && q.includes("plus")) {
        return [agentPhones.find(p => p.name === "iPhone 16"), agentPhones.find(p => p.name === "iPhone 16 Plus")];
    }

    const separators = [" and ", " vs ", " compare ", " against ", ","];
    let parts = [q];

    for (let sep of separators) {
        if (q.includes(sep)) {
            parts = q.split(sep);
            break;
        }
    }

    if (parts.length >= 2) {
        const p1 = parseSinglePhone(parts[0]);
        const p2 = parseSinglePhone(parts[1]);
        if (p1 && p2 && p1.id !== p2.id) return [p1, p2];
    }

    let found = [];
    const sortedNames = ["iphone 16 pro", "iphone 16 plus", "iphone 16", "samsung galaxy s25 ultra", "samsung galaxy s25+", "samsung galaxy s25", "google pixel 9 pro", "google pixel 9"];
    
    sortedNames.forEach(name => {
        let cleanCompareName = name.replace("+", "plus");
        if (q.includes(cleanCompareName) || q.includes(name.replace("+", ""))) {
            const phone = agentPhones.find(p => p.name.toLowerCase() === name);
            if (phone && !found.some(f => f.id === phone.id)) found.push(phone);
        }
    });

    return found.slice(0, 2);
}

function generateComparisonTable(p1, p2) {
    return `
        ⚖️ <strong>Model Comparison:</strong>
        <div class="overflow-x-auto mt-3 border rounded-xl bg-white text-xs">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-gray-100 border-b">
                        <th class="p-2 font-semibold text-gray-600">Spec</th>
                        <th class="p-2 font-semibold text-blue-600">${p1.name}</th>
                        <th class="p-2 font-semibold text-indigo-600">${p2.name}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-b">
                        <td class="p-2 font-medium text-gray-500">Price</td>
                        <td class="p-2 font-bold">${p1.price.toLocaleString('uk-UA')} UAH</td>
                        <td class="p-2 font-bold">${p2.price.toLocaleString('uk-UA')} UAH</td>
                    </tr>
                    <tr class="border-b">
                        <td class="p-2 font-medium text-gray-500">Screen</td>
                        <td class="p-2">${p1.specs.screen}</td>
                        <td class="p-2">${p2.specs.screen}</td>
                    </tr>
                    <tr class="border-b">
                        <td class="p-2 font-medium text-gray-500">Processor</td>
                        <td class="p-2">${p1.specs.cpu}</td>
                        <td class="p-2">${p2.specs.cpu}</td>
                    </tr>
                    <tr class="border-b">
                        <td class="p-2 font-medium text-gray-500">Camera</td>
                        <td class="p-2">${p1.specs.camera}</td>
                        <td class="p-2">${p2.specs.camera}</td>
                    </tr>
                    <tr>
                        <td class="p-2 font-medium text-gray-500">Battery</td>
                        <td class="p-2">${p1.specs.battery}</td>
                        <td class="p-2">${p2.specs.battery}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, true);
    input.value = '';

    setTimeout(() => {
        const lowerText = text.toLowerCase();
        let response = "";

        const askAll = lowerText.includes("all") || lowerText.includes("list") || lowerText.includes("prices") || lowerText.includes("catalog");
        const explicitCompare = lowerText.includes("compare") || lowerText.includes("vs") || lowerText.includes("against");

        if (askAll && !explicitCompare && !lowerText.includes("battery")) {
            response = getAllPhonesList();
            addMessage(response);
            return;
        }

        if (lowerText.includes("top") || lowerText.includes("seller") || lowerText.includes("hit") || lowerText.includes("popular")) {
            const topPhone = agentPhones.find(p => p.name === "iPhone 16 Pro");
            response = `🔥 <strong>TechStore Top Seller!</strong><br><br>The most popular choice right now is <strong>${topPhone.name}</strong>.<br>💰 Price: <strong>${topPhone.price.toLocaleString('uk-UA')} UAH</strong><br>⭐ It balances the advanced A18 Pro chip with the elite 48 MP camera grid featuring a 5x optical zoom.`;
            addMessage(response);
            return;
        }

        if (lowerText.includes("battery") || lowerText.includes("power") || lowerText.includes("capacity")) {
            let maxBattery = 0;
            let batteryKing = null;
            
            agentPhones.forEach(p => {
                let capacity = parseInt(p.specs.battery.match(/\d+/)[0]);
                if (capacity > maxBattery) {
                    maxBattery = capacity;
                    batteryKing = p;
                }
            });

            response = `🔋 <strong>Battery King!</strong><br><br>The highest cell capacity belongs to <strong>${batteryKing.name}</strong> (${batteryKing.specs.battery}).<br>💰 Price: <strong>${batteryKing.price.toLocaleString('uk-UA')} UAH</strong><br>⚡ The perfect powerhouse if you need extreme uptime without recharging!`;
            addMessage(response);
            return;
        }

        if (lowerText.includes("budget") || lowerText.includes("cheap") || lowerText.includes("low")) {
            let cheapPhone = agentPhones.reduce((min, p) => p.price < min.price ? p : min, agentPhones[0]);

            response = `💰 <strong>Best Value Deal!</strong><br><br>The most affordable device in our inventory is <strong>${cheapPhone.name}</strong>.<br>📉 Price only: <strong>${cheapPhone.price.toLocaleString('uk-UA')} UAH</strong><br>✨ A solid opportunity to get pure Android experiences and great screens at minimum costs!`;
            addMessage(response);
            return;
        }

        const foundPhones = findPhonesInQuery(text);

        if (foundPhones.length >= 2 && (explicitCompare || lowerText.includes("and"))) {
            response = generateComparisonTable(foundPhones[0], foundPhones[1]);
        } 
        else {
            const singlePhone = parseSinglePhone(text);
            if (singlePhone) {
                response = `
                    ✅ <strong>${singlePhone.name}</strong><br>
                    💰 Price: <strong>${singlePhone.price.toLocaleString('uk-UA')} UAH</strong><br><br>
                    ⚙️ <strong>Key Specs:</strong><br>
                    • Display: ${singlePhone.specs.screen}<br>
                    • Chipset: ${singlePhone.specs.cpu}<br>
                    • Cameras: ${singlePhone.specs.camera}<br>
                    • Battery: ${singlePhone.specs.battery}
                `;
            } else {
                if (lowerText.includes("iphone") || lowerText.includes("apple")) {
                    response = "We stock <strong>iPhone 16, 16 Plus, and 16 Pro</strong>. Try writing: <em>\"Price of iPhone 16 Plus\"</em>.";
                } else if (lowerText.includes("samsung")) {
                    response = "Our stock features: <strong>S25, S25+, and S25 Ultra</strong>. Ask: <em>\"Compare Samsung S25+ and Ultra\"</em>.";
                } else if (lowerText.includes("pixel")) {
                    response = "We hold the base <strong>Pixel 9</strong> and elite <strong>Pixel 9 Pro</strong>.";
                } else {
                    response = "Sorry, I couldn't identify the device model. Try tapping one of our quick reply buttons above!";
                }
            }
        }

        addMessage(response);
    }, 400);
}

window.toggleChat = toggleChat;
window.sendMessage = sendMessage;
window.sendQuickReply = sendQuickReply;

window.initAI = function(mainPhonesData) {
    if (mainPhonesData && Array.isArray(mainPhonesData)) {
        agentPhones = mainPhonesData;
    }

    const input = document.getElementById('user-input');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
    
    const messages = document.getElementById('chat-messages');
    if (messages && messages.children.length === 0) {
        setTimeout(() => {
            // ТЕКСТ ПРИВІТАННЯ ЗМІНЕНО СЮДI
            addMessage("Hello! 👋 I'm your interactive TechStore AI Consultant.<br><br><strong>What are you interested in?</strong>");
        }, 400);
    }
};