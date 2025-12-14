# 🏦 ByteCoders Finance

> **The Agentic AI Loan Officer: From Application to Sanction in Minutes.**
> *Theme: Dark Mode & Neon Gold (#FFD700)*

![Banner Placeholder](https://www.usnews.com/object/image/00000198-42a2-d377-ad9c-5ea6782f0000/https-media-gettyimages-com-id-1255723559-photo-robotic-hand-holding-bitcoin.jpg?update-time=1753464621845&size=responsive640)

## 📋 Executive Summary
**ByteCoders Finance** is a "Full Lifecycle Financial Companion." Unlike traditional bots that stop interacting once a product is sold, our Agentic AI guides the user through the entire journey—from **Instant Loan Approval** to **Post-Disbursement Advisory**. We utilize a Split-Screen Interface combining a conversational agent with a live status dashboard to ensure transparency and speed.

---

## 🧐 The Business Problem
The traditional banking loan process is a **"Black Hole"**:
1.  **High Turnaround Time (TAT):** It often takes 4+ days just to get an eligibility check.
2.  **Zero Transparency:** Customers rarely know *why* they were rejected or where their file is stuck.
3.  **No Post-Loan Guidance:** Once the money is disbursed, the customer is left alone without advice on repayment strategies or foreclosure benefits.

## 💡 Our Solution
We replaced the manual process with a **Master-Worker Agent Architecture** that handles Intent, KYC, and Risk Assessment instantly.

### 🔄 The Two-Mode Workflow:
1.  **Sales Mode (The Acquirer):**
    * Instantly recognizes intent (e.g., "I need ₹5 Lakhs").
    * Performs **Smart Verification** via PAN validation.
    * Executes an **Instant Risk Check** against our internal database (simulating CIBIL scores).
    * **Result:** Loans are sanctioned in under 2 minutes.

2.  **Support Mode (The Advisor):**
    * Active *after* the loan is approved.
    * Handles "What If" scenarios (e.g., *"If I foreclose in 6 months, how much interest do I save?"*).
    * Promotes financial literacy and customer retention.

---

## ✨ Key Features
* **🖥️ Split-Screen Interface:** Left side handles the chat; Right side shows a **Live Tracker** moving from 'Verification' → 'Risk Check' → 'Sanctioned' in real-time.
* **⚡ Instant Risk Engine:** Checks user credit scores (e.g., >750) and approves/rejects deterministically to prevent bad loans.
* **📊 Dynamic Dashboard:** Visualizes the loan offer, interest rates, and EMI breakdown immediately.
* **🤖 Hybrid Intelligence:** Combines the natural language capabilities of GenAI with the reliability of deterministic banking rules (Firebase).

---

## 🛠️ System Architecture

### The "Hybrid" Approach
We use a robust architecture to ensure the bank never makes a hallucinated decision:
* **Frontend:** React.js + Tailwind CSS (Black & Neon Gold Theme).
* **Backend:** Firebase (Auth for security & Firestore for User Profiles/Chat History).
* **Logic Layer:** Custom Agentic Workflow.
    * *Sales Agent:* Handles conversation flow.
    * *Risk Agent:* Validates credit history against rules.
    * *Support Agent:* Calculates financial projections.

**Tech Stack:**
* **Framework:** React (Vite)
* **Styling:** Tailwind CSS, Lucide React (Icons)
* **Database:** Firebase Firestore
* **Authentication:** Firebase Auth

---

## 📸 Usage Flow (Demo Story)
1.  **User Login:** User (e.g., Aditya) logs into the portal.
2.  **Request:** User asks for a loan. Bot requests PAN details.
3.  **Risk Check:** System verifies Aditya's score (e.g., 780) in the background.
4.  **Approval:** The "Live Tracker" turns Green (Neon Gold).
5.  **Advisory:** User asks about foreclosure; Bot calculates specific savings (e.g., "You save ₹45,000").

---

## 🚀 Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/GT0SRT/byte-finance.git](https://github.com/GT0SRT/byte-finance.git)
    cd byte-finance
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Firebase**
    * Create a `.env` file with your Firebase config keys.
    * Ensure Firestore is enabled.

4.  **Run the Application**
    ```bash
    npm run dev
    ```

---

## 🔮 Future Scope
* **🎙️ Voice Interaction:** Enabling Hindi/Regional language support for rural banking access.
* **🔗 Real CIBIL Integration:** Moving from our internal mock database to live API calls.
* **📱 WhatsApp Integration:** Porting the "Support Agent" to WhatsApp for easier customer access.

---

## 👥 The Team
* **Gourav** - AI Architect & Backend Lead
* **Deepanshika** - Frontend Developer & UI/UX Lead

---
*Built for EY Techathon Round 2*