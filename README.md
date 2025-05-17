# 🎓 Cohort Craft – Decentralized Education Platform

**Cohort Craft** is a decentralized education platform built on the **Base** blockchain. It allows users to log in using digital wallets, receive on-chain attestations for completed courses, and submit academic work evaluated by AI. The project supports the Decentralized Science (**DeSci**) movement.

![Cohort Craft](/path-to-screenshot.png)

---

## 🚀 Key Features

- 🔐 **Login with Base Smart Wallet**  
  Users authenticate using Base-compatible wallets.

- 🧾 **On-Chain Attestations**  
  Upon course completion, a unique, verifiable blockchain certification is issued.

- 🤖 **AI-Powered Evaluation**  
  Academic documents are processed and receive detailed feedback from AI.

- 🌍 **Multilingual Interface**  
  Interface available in English and Spanish.

- 📱 **Responsive Design**  
  Works seamlessly across mobile, tablet, and desktop.

- 🗂️ **Secure Database**  
  All data stored safely using PostgreSQL.

---

## 💻 Tech Stack

### Frontend
- `React` + `TypeScript`: User interface
- `Tailwind CSS`: Styling
- `Shadcn/UI`: Reusable components
- `React Query`, `Wouter`, `Recharts`, `React Hook Form`: Data handling, routing, charts, and forms

### Backend
- `Node.js` + `Express`: Backend API
- `PostgreSQL` + `Drizzle ORM`: Database layer
- `Zod`: Data validation
- `ethers.js`: Blockchain interaction
- `OpenAI`: AI text evaluation

### Blockchain
- `Base Network`: Fast and low-cost blockchain
- `Smart Contracts`: Immutable credential records

---

## 📁 Project Structure

```
.
├── client/             # React frontend
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── pages/          # Page components
│   └── types/          # TypeScript types
├── server/             # Node.js backend
│   ├── services/       # AI and Blockchain services
│   ├── routes.ts       # API routes
│   ├── storage.ts      # DB access
│   └── db.ts           # DB config
└── shared/             # Shared code
    └── schema.ts       # DB schema
```

---

## ⚙️ Installation & Setup

### Requirements
- Node.js v18+
- PostgreSQL 14+
- Base wallet account (optional for testing)
- OpenAI API Key

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/cohort-craft.git
   cd cohort-craft
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure `.env` file**
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/cohortcraft"
   OPENAI_API_KEY="your-openai-key"
   BASE_RPC_URL="https://mainnet.base.org"
   BASE_PRIVATE_KEY="your-private-key"
   ```

4. **Initialize database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Visit the app**
   Open `http://localhost:5000` in your browser.

---

## 🔐 Wallet Authentication

Supported:
- Base Smart Wallet
- MetaMask
- WalletConnect

### Process:
1. Click “Connect Wallet”
2. Choose provider
3. Approve login from wallet
4. Backend verifies and creates session

---

## 📜 On-Chain Credentials

1. Course completion triggers attestation generation
2. It’s signed and stored on Base Network
3. Transaction hash saved in DB
4. Publicly verifiable credential

---

## 🤖 AI Evaluation

1. User uploads a document (PDF/DOCX)
2. Backend extracts text
3. OpenAI processes and evaluates
4. Feedback generated
5. If minimum criteria are met, credential is issued

---

## 📱 User Interface

- Pastel pink, yellow, and Base blue theme
- Responsive layout
- Science-themed background
- Language switcher
- Sidebar navigation
- Dashboard with progress and stats

---

## 🧩 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/wallet` | POST | Login with wallet |
| `/api/dashboard` | GET | User dashboard info |
| `/api/courses` | GET | List available courses |
| `/api/courses/:id` | GET | Course details |
| `/api/students` | GET | List enrolled students |
| `/api/attestations` | GET | List credentials |
| `/api/attestations/:id` | GET | Single credential |
| `/api/evaluation/submit` | POST | Upload document |
| `/api/evaluation/:id/feedback` | GET | Get evaluation |

---

## 🧠 Data Models

- `Users`: Wallet and profile info  
- `Courses`: Learning content  
- `Enrollments`: User-course links  
- `Attestations`: On-chain certifications  
- `Evaluations`: AI feedback data  

---

## 🔗 Blockchain Integration

Using `ethers.js` for:
- Wallet login
- Credential issuance
- Transaction logging
- Smart contract interaction

---

## 🤖 AI Integration

OpenAI used for:
- Academic evaluation
- Feedback generation
- Originality checks
- Certification decisions

---

## 🌐 Production Tips

1. Setup secure web server (Nginx recommended)
2. Protect Base private key
3. Enable PostgreSQL backups
4. Configure HTTPS with SSL
5. Secure `.env` variables

---

## 📄 License – MIT

MIT License

Copyright (c) 2025 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
