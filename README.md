# SupportFlow — Customer Support Ticketing System

> **Capstone Project Submission**  
> A complete, polished, responsive customer support ticketing web application featuring an executive dashboard, complete ticket lifecycle management, intelligent AI-assisted response drafting, and persistent local storage.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [System Architecture & Storage Limitations](#-system-architecture--storage-limitations)
- [AI Assistant Architecture & Transparency](#-ai-assistant-architecture--transparency)
- [Notice Regarding Separate Salesforce Work](#-notice-regarding-separate-salesforce-work)
- [Getting Started & Installation](#-getting-started--installation)
- [Running the Application](#-running-the-application)
- [Automated Testing & Verification](#-automated-testing--verification)
- [REST API Reference](#-rest-api-reference)
- [GitHub Publication Checklist](#-github-publication-checklist)

---

## 🌟 Overview

**SupportFlow** is an enterprise-grade customer support desk application designed to streamline customer inquiry intake, issue prioritization, team assignment, and resolution workflows.

Built from scratch for a college capstone demonstration, it combines modern web aesthetics with a reliable Node.js backend. It features an interactive dashboard, real-time search and multi-criteria filtering, a ticket details management drawer, and a transparent AI response assistant.

---

## ✨ Key Features

### 1. Executive Dashboard & Metrics
- **Real-Time Stat Counters:** Live totals for **Total Tickets**, **Open Tickets**, **In Progress**, and **Resolved / Closed**.
- **Visual Queue Distribution:** Color-coded progress bar illustrating current resolution velocity and ticket status balance.
- **Urgent Priority Alert Banner:** Dynamically surfaces open high-severity tickets requiring immediate attention.
- **Category Breakdown Chips:** Instant visibility across Billing, Technical, Account Access, Feature Request, and General Inquiry queues.

### 2. Comprehensive Ticket Management
- **Fields Supported:** Customer Name, Customer Email, Subject, Description, Category, Priority, Status, Assigned Agent, Created At, and Updated At timestamps.
- **Search & Multi-Filter Bar:** Real-time search by Ticket ID, Customer Name, Email, Subject, or Description keywords.
- **Filter by Attributes:** One-click filtering by Status (Open, In Progress, Resolved, Closed), Priority (Urgent, High, Medium, Low), and Category.
- **Sorting Options:** Sort tickets by Newest First, Priority (High-to-Low), Recently Updated, or Alphabetical Subject.

### 3. Ticket Detail & Status Lifecycle Management
- **Status & Priority Switching:** Instantly transition tickets through their lifecycle (`Open` ➔ `In Progress` ➔ `Resolved` ➔ `Closed`) or escalate priority.
- **Audit Logging:** System automatically logs timestamped audit records whenever status or priority levels change.
- **Conversation Thread:** Full message history capturing customer complaints, agent responses, and system events.
- **One-Click Resolve:** Option to automatically mark ticket as "Resolved" when posting an agent reply.

### 4. AI-Assisted Response Generator
- **Context-Aware Drafting:** Analyzes the customer's problem description, category, and severity to generate 3 tailored response options:
  1. *Quick Acknowledgment & Clarification*
  2. *Actionable Resolution & Troubleshooting Guide*
  3. *High Priority Escalation Notice*
- **1-Click Insert:** Draft text can be inserted directly into the agent reply composer for review and customization.
- **Transparent Demo Mode:** Built with a contextual heuristic engine requiring zero external API keys or charges.
- **Optional Live Gemini AI:** If a `GEMINI_API_KEY` is provided in `.env`, SupportFlow seamlessly connects to Google Gemini 1.5 Flash.

### 5. Sample Demonstration Data
- Pre-populated with 7 realistic enterprise support tickets spanning various categories and priorities.
- Each demonstration ticket is clearly labeled with a `[Sample Data]` badge.
- **1-Click Reset:** Includes a &ldquo;Reset Demo&rdquo; button to restore original sample data at any time during presentations.

### 6. Responsive UI
- Fully responsive across mobile smartphones, tablets, laptops, and ultra-wide desktop monitors using Tailwind CSS.

---

## 🛠 Technology Stack

| Layer | Technologies Used | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | React 18, Vite 6, Tailwind CSS 3 | Modern component architecture, rapid HMR, utility-first responsive styling |
| **Icons** | Lucide React | High-clarity iconography for support statuses and priorities |
| **Backend Server** | Node.js (v18+), Express.js 4 | RESTful API endpoints, request routing, static build serving |
| **Middleware** | CORS, Dotenv | Cross-origin resource sharing and environment management |
| **Data Storage** | Local JSON File Store (`server/data/tickets.json`) | Persistent file storage with atomic writes and memory caching |

---

## 💾 System Architecture & Storage Limitations

SupportFlow employs a robust, file-based JSON persistence engine located at `server/data/tickets.json`. Every create, update, reply, and deletion is written to disk via atomic temporary-file swapping to prevent data corruption.

### Demo Storage Limitations (Clearly Explained for Capstone Evaluation)
- **Single-Node Architecture:** This database engine is designed for single-server execution, local demonstrations, and classroom evaluations. It does not implement multi-instance distributed file locking.
- **Memory Caching:** Tickets are held in memory for sub-millisecond query performance and flushed to disk on mutation.
- **Data Scale:** Suited for demonstrative workloads (up to ~10,000 records). 
- **Production Evolution:** In an enterprise multi-tenant cloud environment, this data access layer (`server/services/ticketService.js`) would be substituted with PostgreSQL, MongoDB, or an enterprise CRM API without changing frontend components.

---

## 🤖 AI Assistant Architecture & Transparency

> **Transparency Statement:** If no real external AI API key is configured, SupportFlow operates in **Transparent Demo Mode**.

- **Offline Demo Engine (Default):** The application uses an intelligent rule-based heuristic template engine that inspects ticket category, priority, customer name, and problem keywords. It generates contextually accurate responses without claiming false API connections.
- **Live Gemini Integration (Optional):** If you wish to demonstrate live generative AI, add your Google Gemini API key to `.env`:
  ```env
  GEMINI_API_KEY=your_gemini_api_key_here
  ```
- **Visual Disclaimers:** The user interface explicitly displays whether the current suggestion was generated via the **Contextual Demo Engine** or **Live Gemini AI**.

---

## ⚠️ Notice Regarding Separate Salesforce Work

> **Important Clarification for Capstone Evaluation:**
>
> This web application (**SupportFlow**) is a standalone full-stack project with its own custom REST API and local data store.
>
> The author&apos;s separate coursework in **Salesforce** (which includes custom Case fields, an activated priority-assignment Flow, Case reports, and a Service Cloud dashboard) represents an independent CRM implementation. 
>
> **SupportFlow is NOT connected to Salesforce.** No claims of live Salesforce integration are made. Both projects serve complementary, independent roles in demonstrating support operations architecture.

---

## 🚀 Getting Started & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) version 18 or higher
- npm (bundled with Node.js)

### Step 1: Clone or Open the Repository
```bash
git clone https://github.com/your-username/SupportFlow.git
cd SupportFlow
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: (Optional) Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env
```
*(No configuration is required — SupportFlow works immediately out-of-the-box in demo mode!)*

---

## 💻 Running the Application

### Option A: Standard Production Mode (Recommended for Grading & Demo)
Build the frontend and run the unified server on port 5000:
```bash
npm run build
npm start
```
Then open your browser to:  
👉 **[http://localhost:5000](http://localhost:5000)**

---

### Option B: Development Mode (Live Hot Reloading)
To run both backend API (port 5000) and Vite frontend dev server (port 5173) concurrently:
```bash
npm run dev
```
Then open your browser to:  
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🧪 Automated Testing & Verification

SupportFlow includes an automated end-to-end test suite that verifies all core API routes, ticket creation, status updates, priority escalations, AI suggestion generation, search, filtering, and demo reset:

```bash
npm test
```

Expected output:
```text
🚀 Starting SupportFlow API & Workflow Verification Tests...

  ✅ PASS: Server health check returns 200 online
  ✅ PASS: Dashboard stats returns 7 total tickets
  ✅ PASS: Status summaries include Open: 3
  ✅ PASS: Status summaries include In Progress: 2
  ✅ PASS: Status summaries include Resolved: 1
  ✅ PASS: GET /api/tickets returns array of tickets
  ✅ PASS: Sample ticket identified with isSample=true
  ✅ PASS: Ticket created successfully with ID SF-1008
  ✅ PASS: GET /api/tickets/:id retrieves correct customer info
  ✅ PASS: Status updated to "In Progress"
  ✅ PASS: Priority updated to "Urgent"
  ✅ PASS: AI response generator returns array of suggestions
  ✅ PASS: AI generator returned 3 distinct contextual response options
  ✅ PASS: AI Engine transparently reports demo mode: "Contextual AI Demo Engine"
  ✅ PASS: Agent reply added to conversation history
  ✅ PASS: Reply successfully tagged as isAiAssisted=true
  ✅ PASS: Search by customer name found 1 match
  ✅ PASS: Filter by status "In Progress" verified
  ✅ PASS: Test ticket SF-1008 deleted successfully
  ✅ PASS: Demo reset endpoint restored default sample tickets

===============================================
Test Results: 20 Passed, 0 Failed
===============================================
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Returns server health status and system timestamp |
| `GET` | `/api/stats` | Aggregated dashboard metrics (totals, status, priorities, categories) |
| `GET` | `/api/tickets` | List tickets with optional `?search=`, `?status=`, `?priority=`, `?category=`, `?sortBy=` |
| `GET` | `/api/tickets/:id` | Retrieve full ticket details and reply history |
| `POST` | `/api/tickets` | Create a new ticket (`customerName`, `customerEmail`, `subject`, `description`, `category`, `priority`) |
| `PATCH` | `/api/tickets/:id` | Update ticket fields (`status`, `priority`, `category`, `assignedTo`) |
| `POST` | `/api/tickets/:id/replies` | Add message to ticket conversation (`message`, `sender`, `authorName`, `isAiAssisted`) |
| `DELETE` | `/api/tickets/:id` | Delete a support ticket |
| `POST` | `/api/tickets/reset-demo` | Reset storage back to default capstone demonstration dataset |
| `POST` | `/api/ai/suggest` | Generate contextual AI draft replies based on ticket parameters |

---

## 🔒 GitHub Publication Checklist

- [x] **No hardcoded secrets or API keys:** All credentials utilize environment variables (`.env.example` provided).
- [x] **No real customer PII:** All sample data uses fictional names (e.g., Elena Rostova, David Miller) and example domains (`@acmecorp.io`).
- [x] **Clean `.gitignore`:** Ignores `node_modules/`, `dist/`, `.env`, temporary files, and log files.
- [x] **Reproducible build:** Zero native compilation or system dependencies required; runs immediately on Windows, macOS, or Linux.
- [x] **Tested & verified:** 20/20 automated end-to-end tests passing.

---

## 📄 License
This project is submitted for academic capstone evaluation. Open-source under the MIT License.
