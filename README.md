# SupportFlow — Customer Support Ticketing System

> **Submission-Ready Capstone Project**  
> A complete, polished, responsive customer support ticketing web application featuring an executive metrics dashboard, live analytics charts, complete ticket lifecycle management with full editing, real-time SLA deadline tracking, intelligent AI-assisted response drafting, and persistent local storage.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [System Architecture & Storage Limitations](#-system-architecture--storage-limitations)
- [AI Assistant Architecture & Transparency](#-ai-assistant-architecture--transparency)
- [SLA Tracking & Service Level Architecture](#-sla-tracking--service-level-architecture)
- [Notice Regarding Separate Salesforce Work](#-notice-regarding-separate-salesforce-work)
- [Getting Started & Installation](#-getting-started--installation)
- [Running the Application](#-running-the-application)
- [Automated Testing & Verification](#-automated-testing--verification)
- [REST API Reference](#-rest-api-reference)
- [GitHub Publication Checklist](#-github-publication-checklist)

---

## 🌟 Overview

**SupportFlow** is an enterprise-grade customer support desk application designed to streamline customer inquiry intake, issue prioritization, team assignment, SLA compliance, and resolution workflows.

Built with a modern **React 18 + Tailwind CSS** frontend and a robust **Node.js / Express** backend, SupportFlow provides live analytics charts calculated dynamically from real ticket data, instant search and multi-criteria filtering, full ticket editing, a responsive dual-view (Cards Grid & Data Table), and a transparent AI response assistant.

---

## ✨ Key Features

### 1. Executive Dashboard & Live Analytics
- **Live Stat Counters:** Live totals for **Total Tickets**, **Open Tickets**, **In Progress Tickets**, and **Resolved Tickets**, calculated dynamically from records.
- **Tickets by Status Chart:** Color-coded status distribution (Open, In Progress, Resolved, Closed) with count and percentage breakdowns.
- **Tickets by Priority Chart:** Severity distribution tracking Urgent (Red), High (Amber), Medium (Blue), and Low (Slate) queues.
- **High Attention Urgent Banner:** Automatically alerts support leads when critical tickets require immediate action.
- **Graceful Empty State:** Clean, helpful fallback states when no records match filter criteria.

### 2. SLA (Service Level Agreement) Tracking
- **Real-Time Deadlines:** Tracks resolution targets based on ticket priority:
  - **Urgent:** 4 Hours
  - **High:** 24 Hours
  - **Medium:** 48 Hours
  - **Low:** 72 Hours
- **Status Indicators:**
  - `🔥 SLA Overdue`: Highlighted in red with exact elapsed time (e.g., *Overdue by 2h 15m*).
  - `⏱️ Approaching Deadline`: Highlighted in amber when less than 4 hours remain (e.g., *Due in 1h 30m*).
  - `✓ On Track`: Highlighted in emerald for healthy resolution windows.
  - `✅ SLA Met`: Marked when tickets are resolved within their designated SLA window.
- **Custom Deadline Overrides:** Supports custom datetime deadlines per ticket.

### 3. Comprehensive Ticket Management
- **All Required Fields:** Customer Name, Customer Email, Subject, Description, Category, Priority, Status, Assigned Agent, SLA Deadline, and Created/Updated timestamps.
- **Create New Tickets:** Modal with input validation, helpful error messages, and automatic unique ID generation (`SF-1001`, `SF-1002`, ...).
- **Edit Existing Tickets:** Full edit mode allowing modification of customer name, email, subject, description, category, priority, status, assigned agent, and SLA deadline.
- **Dual View Modes:** Instant toggle between **Cards Grid View** and **Compact Data Table View**.

### 4. Search & Multi-Criteria Filtering
- **Keyword Search:** Instant search by Ticket ID, Customer Name, Email, Subject, or Description.
- **Attribute Filters:** One-click filtering by Status (`Open`, `In Progress`, `Resolved`, `Closed`), Priority (`Urgent`, `High`, `Medium`, `Low`), and Category (`Technical`, `Billing`, `Account Access`, `Feature Request`, `General Inquiry`).
- **Sorting:** Sort by Newest First, Priority (High-to-Low), Recently Updated, or Alphabetical Subject.
- **Clear Filters:** 1-click reset for all active filter parameters.

### 5. AI-Assisted Response Generator
- **Context-Aware Drafting:** Analyzes the customer's problem description, category, and severity to generate 3 tailored response options:
  1. *Quick Acknowledgment & Clarification*
  2. *Actionable Resolution & Troubleshooting Guide*
  3. *High Priority Escalation Notice*
- **1-Click Insert:** Copies draft text directly into the agent reply composer for review and customization.
- **Transparent Demo Mode:** Intelligent contextual template engine that requires zero external API keys or subscription fees.
- **Optional Live Gemini AI:** If a `GEMINI_API_KEY` is provided in `.env`, SupportFlow seamlessly connects to Google Gemini 1.5 Flash.

### 6. Realistic Demonstration Dataset
- Pre-populated with 7 realistic enterprise support tickets spanning diverse categories, priorities, and SLA statuses.
- **1-Click Reset Demo:** A &ldquo;Reset Demo&rdquo; button restores the original clean dataset at any time during presentations.

---

## 🛠 Technology Stack

| Layer | Technologies Used | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | React 18, Vite 6, Tailwind CSS 3 | Fast component rendering, live HMR, utility-first styling |
| **Icons** | Lucide React | High-clarity iconography for support statuses, SLA, and priorities |
| **Backend Server** | Node.js (v18+), Express.js 4 | RESTful API endpoints, request routing, static build hosting |
| **Middleware** | CORS, Dotenv | Cross-origin resource sharing and environment management |
| **Data Storage** | Local JSON File Store (`server/data/tickets.json`) | Persistent file storage with atomic writes and memory caching |

---

## 💾 System Architecture & Storage Limitations

SupportFlow employs a robust file-based JSON persistence engine located at `server/data/tickets.json`. Every create, update, reply, and deletion is written to disk via atomic temporary-file swapping to prevent data corruption.

### Demo Storage Limitations (Clearly Documented for Evaluation)
- **Single-Node Architecture:** This storage engine is designed for single-server execution, local demonstrations, and evaluations. It does not implement multi-instance distributed file locking.
- **Memory Caching:** Tickets are held in memory for sub-millisecond query performance and flushed to disk on mutation.
- **Browser Cache Backup:** A local snapshot is maintained in browser `localStorage` as a fallback during network reconnections.
- **Data Scale:** Suited for demonstrative workloads (up to ~10,000 records). 
- **Production Evolution:** In an enterprise multi-tenant cloud environment, this data access layer (`server/services/ticketService.js`) would be substituted with PostgreSQL, MongoDB, or an enterprise CRM API without changing frontend components.

---

## 🤖 AI Assistant Architecture & Transparency

> **Transparency Statement:** If no real external AI API key is configured, SupportFlow operates in **Transparent Demo Mode**.

- **Offline Demo Engine (Default):** The application uses an intelligent rule-based heuristic template engine that inspects ticket category, priority, customer name, and problem keywords. It generates contextually accurate responses without claiming false API connections.
- **Live Gemini Integration (Optional):** To connect live generative AI, set your Google Gemini API key in `.env`:
  ```env
  GEMINI_API_KEY=your_gemini_api_key_here
  ```
- **Visual Disclaimers:** The user interface explicitly displays whether the current suggestion was generated via the **Contextual Demo Engine** or **Live Gemini AI**.

---

## ⚠️ Notice Regarding Separate Salesforce Work

> **Clarification for Evaluation:**
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
*(No configuration is required — SupportFlow runs immediately out-of-the-box in demo mode!)*

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

SupportFlow includes an automated end-to-end test suite that verifies health, stats calculations, SLA tracking, ticket creation, editing, status/priority updates, AI suggestion generation, search, filtering, and demo reset:

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
  ✅ PASS: SLA stats calculated (Overdue: 1, Approaching: 2)
  ✅ PASS: GET /api/tickets returns array of tickets
  ✅ PASS: Sample ticket identified with isSample=true (SF-1002)
  ✅ PASS: Ticket created successfully with ID SF-1008
  ✅ PASS: GET /api/tickets/:id retrieves correct customer info
  ✅ PASS: Custom SLA deadline persisted properly
  ✅ PASS: Status updated to "In Progress"
  ✅ PASS: Priority updated to "Urgent"
  ✅ PASS: Ticket customer name edited successfully
  ✅ PASS: Ticket subject edited successfully
  ✅ PASS: Verified changes persisted to server/data/tickets.json on disk
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
Test Results: 25 Passed, 0 Failed
===============================================
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Returns server health status and system timestamp |
| `GET` | `/api/stats` | Aggregated dashboard metrics (totals, status, priorities, SLA, categories) |
| `GET` | `/api/tickets` | List tickets with optional `?search=`, `?status=`, `?priority=`, `?category=`, `?sortBy=` |
| `GET` | `/api/tickets/:id` | Retrieve full ticket details, conversation history, and SLA status |
| `POST` | `/api/tickets` | Create a new ticket (`customerName`, `customerEmail`, `subject`, `description`, `category`, `priority`, `slaDeadline`) |
| `PATCH` | `/api/tickets/:id` | Update ticket fields (`customerName`, `customerEmail`, `subject`, `description`, `status`, `priority`, `category`, `assignedTo`, `slaDeadline`) |
| `POST` | `/api/tickets/:id/replies` | Add message to ticket conversation (`message`, `sender`, `authorName`, `isAiAssisted`) |
| `DELETE` | `/api/tickets/:id` | Delete a support ticket |
| `POST` | `/api/tickets/reset-demo` | Reset storage back to default demonstration dataset |
| `POST` | `/api/ai/suggest` | Generate contextual AI draft replies based on ticket parameters |

---

## 🔒 GitHub Publication Checklist

- [x] **No hardcoded secrets or API keys:** All credentials utilize environment variables (`.env.example` provided).
- [x] **No real customer PII:** All sample data uses fictional names (e.g., Elena Rostova, David Miller) and example domains (`@acmecorp.io`).
- [x] **Clean `.gitignore`:** Ignores `node_modules/`, `dist/`, `.env`, temporary files, and log files.
- [x] **Reproducible build:** Zero native compilation or system dependencies required; runs immediately on Windows, macOS, or Linux.
- [x] **Tested & verified:** 25/25 automated end-to-end tests passing.

---

## 📄 License
This project is submitted for academic capstone evaluation. Open-source under the MIT License.
