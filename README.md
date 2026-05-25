# techstore-ai-agent
https://vanyaper.github.io/techstore-ai-agent/

<img width="1896" height="867" alt="image" src="https://github.com/user-attachments/assets/b48f1e47-9046-42ac-abcf-9899e2472df5" />


<img width="1896" height="859" alt="image" src="https://github.com/user-attachments/assets/634c7ecd-f0f2-4149-8489-50ac2374a72a" />


<img width="1894" height="860" alt="image" src="https://github.com/user-attachments/assets/4107aff1-b8ad-4b6d-9ec4-28fe8a4f8523" />


<img width="1895" height="864" alt="image" src="https://github.com/user-attachments/assets/2aaf1a1d-8e32-4109-8815-afdcdf342f7b" />


<img width="1897" height="860" alt="image" src="https://github.com/user-attachments/assets/3d484b25-d4e8-429b-ad96-40305546b091" />


<img width="1896" height="861" alt="image" src="https://github.com/user-attachments/assets/330d43e4-7825-4457-b68f-df75919f4a4f" />


<img width="1896" height="862" alt="image" src="https://github.com/user-attachments/assets/a092429c-1e06-474f-b289-74c7a63c8c8d" />


<img width="1896" height="863" alt="image" src="https://github.com/user-attachments/assets/2ee4b1c9-d3d3-44f5-ab07-bf4ab5855bb8" />


<img width="1894" height="859" alt="image" src="https://github.com/user-attachments/assets/5f8982c4-44c0-4bc2-8132-a96d89e83c53" />


<img width="1900" height="865" alt="image" src="https://github.com/user-attachments/assets/6342dd3a-ec47-4b74-a29c-011415313d64" />


<img width="1898" height="860" alt="image" src="https://github.com/user-attachments/assets/ea1e8ab8-896c-4678-ae2d-d849134a2e5f" />


## ⚙️ How It Works

The AI assistant runs **100% on the client side** inside `ai-agent.js` with zero backend overhead. Here is the underlying logic:

1. **Data Binding:** Upon page load, the main phone database array from `index.html` is securely passed directly into the AI module via `window.initAI(phones)`.
2. **Score-Based Token Matching:** When you send a message, the system evaluates the text using a custom scoring system. It scans for specific brand, model, and modifier keywords (like *Pro, Plus, Ultra*).
3. **Strict Filtering & Penalties:** To prevent mismatches, strict penalty rules are applied. For example, if you look up a base model but write "Plus", the base model's score drops, ensuring the `iPhone 16 Plus` card wins instead of a generic `iPhone 16`.
4. **Dynamic Comparison Grids:** If the query contains two valid device matches and an explicit comparison intent (e.g., *vs, compare*), the script extracts both objects and injects an adaptive HTML comparison `<table>` directly into the chat flow using Tailwind CSS layouts.


--------
 UPDATE
--------

<img width="1916" height="905" alt="image" src="https://github.com/user-attachments/assets/d8414728-8906-4b4f-be36-66d17ca95300" />


<img width="1900" height="903" alt="image" src="https://github.com/user-attachments/assets/8aa5a4da-a31c-42d7-969f-224b8cbd1118" />


<img width="1898" height="905" alt="image" src="https://github.com/user-attachments/assets/f4339383-3f3c-4129-95df-1b726d267b73" />


<img width="1902" height="903" alt="image" src="https://github.com/user-attachments/assets/10346132-b100-4ded-a6f4-1efe5b2da942" />


<img width="1901" height="906" alt="image" src="https://github.com/user-attachments/assets/52d60c1b-44c2-4e03-8661-4ab2c8f67ef5" />


<img width="1902" height="904" alt="image" src="https://github.com/user-attachments/assets/5e8ee9db-2dc6-4762-a2c1-3f5fe74faca0" />


<img width="1901" height="904" alt="image" src="https://github.com/user-attachments/assets/36fd55d3-b0fe-4084-9dd7-add6b5b264fd" />



🚀 Project Updates & AI Features

🌟 Core Changes:
* **Smartphone Focus:** Shifted the store layout to focus exclusively on smartphones.
* **USD Pricing ($):** Converted the entire database and layout to US Dollars.
* **UI Step Modification:** Set the budget input arrows to change by $100 increments.
* **Production Fix:** Moved event listeners inside `initAI` to fix the GitHub Pages hosting bug.

🤖 New AI Agent Features:
1. **Budget Search (`checkBudget`):** Users enter a max price, and the AI filters (`.filter()`) and sorts (`.sort()`) affordable models from highest to lowest price.
2. **Contextual Triggers ("+" / "-"):** * Entering **`+`** (or *yes*) makes the AI scan the chat history, identify the last mentioned phone, and print its specs.
   * Entering **`-`** (or *no*) triggers a polite: *"Alright! What else can I help you with? 😊"*.
3. **Symbol Protection:** Isolated random symbol inputs (`?`, `!`, `+`) from crashing the state when no active context is present.
