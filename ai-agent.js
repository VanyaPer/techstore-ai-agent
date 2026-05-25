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
    if (!agentPhones || agentPhones.length === 0) return "Sorry, the smartphone catalog is currently offline. 😔";

    let listHtml = "📋 <strong>Our Smartphone Price List:</strong><br><br>";
    agentPhones.forEach(p => {
        listHtml += `• <strong>${p.name}</strong> — <span class="text-blue-600 font-bold">$${p.price.toLocaleString('en-US')}</span><br>`;
    });
    listHtml += "<br>Feel free to use our quick filtering buttons or look up budget alternatives!";
    return listHtml;
}

function parseSinglePhone(text) {
    let q = text.toLowerCase().trim();
    if (q === "+" || q === "-" || q === "") return null;
    q = q.replace(/\+/g, "plus");

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
                        <td class="p-2 font-bold text-green-600">$${p1.price.toLocaleString('en-US')}</td>
                        <td class="p-2 font-bold text-green-600">$${p2.price.toLocaleString('en-US')}</td>
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

function getLastMentionedPhoneFromDOM() {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer || !agentPhones) return null;

    const assistantMessages = Array.from(messagesContainer.querySelectorAll('.chat-message:not(.ml-auto)'));
    if (assistantMessages.length === 0) return null;

    for (let i = assistantMessages.length - 1; i >= 0; i--) {
        const text = assistantMessages[i].innerText;
        const match = agentPhones.find(p => text.includes(p.name));
        if (match) return match;
    }
    return null;
}

function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, true);
    input.value = '';

    setTimeout(() => {
        let lowerText = text.toLowerCase();
        let response = "";

        
        const isShortNegative = ["no", "nope", "nah", "no thanks", "dont want", "-"].includes(lowerText);
        if (isShortNegative) {
            addMessage("Alright! What else can I help you with? 😊");
            return;
        }

        
        const isShortConsent = ["yes", "sure", "ok", "show", "yep", "of course", "+"].includes(lowerText);
        if (isShortConsent) {
            const contextPhone = getLastMentionedPhoneFromDOM();
            if (contextPhone) {
                lowerText = contextPhone.name.toLowerCase();
            }
        }

      
        if (/^[+?!.\-\s]+$/.test(lowerText)) {
            addMessage("I didn't quite catch that. Could you please specify a smartphone name or budget? 📱");
            return;
        }

        const askAll = lowerText.includes("all") || lowerText.includes("list") || lowerText.includes("prices") || lowerText.includes("catalog");
        const explicitCompare = lowerText.includes("compare") || lowerText.includes("vs") || lowerText.includes("against");

        if (askAll && !explicitCompare && !lowerText.includes("battery")) {
            response = getAllPhonesList();
            addMessage(response);
            return;
        }

        if (lowerText.includes("top") || lowerText.includes("seller") || lowerText.includes("hit") || lowerText.includes("popular")) {
            const topPhone = agentPhones.find(p => p.name === "iPhone 16 Pro");
            response = `🔥 <strong>TechStore Top Seller!</strong><br><br>Our current trending flagship is <strong>${topPhone.name}</strong>.<br>💰 Price: <strong>$${topPhone.price.toLocaleString('en-US')}</strong><br>⭐ It balances the advanced A18 Pro chip with the elite 48 MP camera grid featuring a 5x optical zoom.`;
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

            response = `🔋 <strong>Battery King!</strong><br><br>The highest cell runtime belongs to <strong>${batteryKing.name}</strong> (${batteryKing.specs.battery}).<br>💰 Price: <strong>$${batteryKing.price.toLocaleString('en-US')}</strong><br>⚡ The perfect powerhouse if you need extreme uptime without recharging!`;
            addMessage(response);
            return;
        }

        if (lowerText.includes("budget") || lowerText.includes("cheap") || lowerText.includes("low")) {
            let cheapPhone = agentPhones.reduce((min, p) => p.price < min.price ? p : min, agentPhones[0]);

            response = `💰 <strong>Best Value Smartphone Deal!</strong><br><br>Our most affordable option in the lineup is <strong>${cheapPhone.name}</strong>.<br>📉 Price only: <strong>$${cheapPhone.price.toLocaleString('en-US')}</strong><br>✨ A solid opportunity to get pure Android experiences and great screens at minimum costs!`;
            addMessage(response);
            return;
        }

        const foundPhones = findPhonesInQuery(lowerText);

        if (foundPhones.length >= 2 && (explicitCompare || lowerText.includes("and"))) {
            response = generateComparisonTable(foundPhones[0], foundPhones[1]);
        }
        else {
            const singlePhone = parseSinglePhone(lowerText);
            if (singlePhone) {
                response = `
                    ✅ <strong>${singlePhone.name}</strong><br>
                    💰 Price: <strong>$${singlePhone.price.toLocaleString('en-US')}</strong><br><br>
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
                    response = "Sorry, I couldn't identify the device model. Try tapping one of our quick reply buttons above or use the budget finder!";
                }
            }
        }

        addMessage(response);
    }, 400);
}

function checkBudget() {
    const budgetField = document.getElementById('budget-input');
    if (!budgetField) return;

    const amount = parseFloat(budgetField.value.trim());

    if (!amount || isNaN(amount) || amount <= 0) {
        addMessage("Please enter a valid budget amount in USD ($). 💰", true);
        setTimeout(() => {
            addMessage("Oops! Please enter a valid number greater than 0 so I can filter the smartphones for you. 😊");
        }, 400);
        return;
    }

    addMessage(`What phones can I buy with a budget of $${amount.toLocaleString('en-US')}?`, true);
    budgetField.value = '';

    setTimeout(() => {
        if (!agentPhones || agentPhones.length === 0) {
            addMessage("Our catalog data is temporarily offline. Please try again later.");
            return;
        }

        const affordablePhones = agentPhones.filter(p => p.price <= amount);

        if (affordablePhones.length === 0) {
            let cheapestPhone = agentPhones.reduce((min, p) => p.price < min.price ? p : min, agentPhones[0]);
            addMessage(`😔 Sorry, we don't have smartphones under <strong>$${amount.toLocaleString('en-US')}</strong> right now.<br><br>Our most budget-friendly option is <strong>Google Pixel 9</strong> priced at <strong>$${cheapestPhone.price.toLocaleString('en-US')}</strong>. Would you like to check it out?`);
        } else {
            let responseHtml = `🎯 <strong>Found ${affordablePhones.length} models within your budget:</strong><br><br>`;

            affordablePhones.sort((a, b) => b.price - a.price);

            affordablePhones.forEach(p => {
                responseHtml += `• <strong>${p.name}</strong> — <span class="text-green-600 font-bold">$${p.price.toLocaleString('en-US')}</span><br><span class="text-gray-500 text-xs">(${p.specs.screen} • ${p.specs.cpu})</span><br><br>`;
            });

            responseHtml += "✨ All these models are available for instant checkout!";
            addMessage(responseHtml);
        }
    }, 400);
}

window.toggleChat = toggleChat;
window.sendMessage = sendMessage;
window.sendQuickReply = sendQuickReply;
window.checkBudget = checkBudget;

window.initAI = function (mainPhonesData) {
    if (mainPhonesData && Array.isArray(mainPhonesData)) {
        agentPhones = mainPhonesData;
    }

    const input = document.getElementById('user-input');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    const budgetInput = document.getElementById('budget-input');
    if (budgetInput) {
        budgetInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkBudget();
        });
    }

    const messages = document.getElementById('chat-messages');
    if (messages && messages.children.length === 0) {
        setTimeout(() => {
            addMessage("Hello! 👋 I'm your interactive TechStore AI Consultant.<br><br><strong>What are you interested in?</strong>");
        }, 400);
    }
};
