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



## ⚙️ How It Works

The AI assistant runs **100% on the client side** inside `ai-agent.js` with zero backend overhead. Here is the underlying logic:

1. **Data Binding:** Upon page load, the main phone database array from `index.html` is securely passed directly into the AI module via `window.initAI(phones)`.
2. **Score-Based Token Matching:** When you send a message, the system evaluates the text using a custom scoring system. It scans for specific brand, model, and modifier keywords (like *Pro, Plus, Ultra*).
3. **Strict Filtering & Penalties:** To prevent mismatches, strict penalty rules are applied. For example, if you look up a base model but write "Plus", the base model's score drops, ensuring the `iPhone 16 Plus` card wins instead of a generic `iPhone 16`.
4. **Dynamic Comparison Grids:** If the query contains two valid device matches and an explicit comparison intent (e.g., *vs, compare*), the script extracts both objects and injects an adaptive HTML comparison `<table>` directly into the chat flow using Tailwind CSS layouts.

<img width="1898" height="860" alt="image" src="https://github.com/user-attachments/assets/ea1e8ab8-896c-4678-ae2d-d849134a2e5f" />




