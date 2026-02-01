# TeraVolta System Manual: The Complete Guide
> **Goal**: This document explains every part of the TeraVolta platform in plain language. It details how data flows from a first click to a finished project, and describes the tools (dashboards, wizards, modals) used at each step.

---

## 1. The Ecosystem (Who is who?)

To understand the system, we first identify the four main roles. Each role has a specific "Portal" designed for their needs.

### 1. The Visitor (Public)
*   **Who**: Anyone on the internet visiting `teravolta.com`.
*   **Goal**: To learn about services and ask for help.
*   **Tools**: Public Website (Home, About, Services, Contact Form).
*   **Restrictions**: Cannot see any private data. Can only *send* information.

### 2. The Client (Customer)
*   **Who**: A visitor whose Quote or Inquiry was approved. They have a login email and password.
*   **Goal**: To track their project, pay bills, and see results.
*   **Tools**: **Customer Portal**.
*   **Key Powers**: Can upload real electricity bills, see their specific project status, and rate technicians.

### 3. The Technician (Field Team)
*   **Who**: The staff member who physically goes to the client's location.
*   **Goal**: To complete assigned visits efficiently.
*   **Tools**: **Technician Portal** (Mobile-optimized).
*   **Key Powers**: Seeing their daily schedule, getting Waze directions, and uploading "Evidence" (photos) of their work.

### 4. The Admin (Management)
*   **Who**: Office staff and managers.
*   **Goal**: To coordinate everything. "The Traffic Controller".
*   **Tools**: **Admin Portal**.
*   **Key Powers**: Everything. Creating projects, assigning technicians, reviewing quotes, and managing users.

---

## 2. The Service Flows (How a specific service works)

Different services require different information and steps. Here is the detailed journey for each.

### Flow A: Energy Efficiency (Residential/Business)
*Focus: Saving money on electricity bills.*

1.  **The Quote (Public)**:
    *   Visitor selects "Energy Efficiency".
    *   **Required Info**: Property Type (House/Apt), Avg Monthly Bill ($), Roof Type.
    *   **Files**: Visitor uploads a photo of their roof or bill (optional at this stage).
    *   **Result**: A `Quote` is created in the database with status `Pending Review`.

2.  **The Review (Admin)**:
    *   Admin sees the new Quote.
    *   **Action**: Admin clicks "Approve". This converts the Visitor to a **Client** (sends them an invite email).

3.  **Project Setup (Admin)**:
    *   Admin uses the **Project Wizard** (see Section 4).
    *   Admin selects "Efficiency" service type.
    *   **System Action**: Creates a project with status `Pending Payment` (simulated).

4.  **Activation (Client)**:
    *   Client logs in. They see a big "Initial Payment" block.
    *   Client clicks "Pay Now" (Simulated).
    *   System changes status to `Pending Documents`.
    *   **The Special Step**: Client is asked to "Upload Last 3 Electricity Bills".
    *   Once uploaded, the project allows scheduling.

### Flow B: Solar Consulting (Big Projects)
*Focus: Legal and Technical advice for large installations.*

1.  **The Quote (Public)**:
    *   Visitor selects "Consulting".
    *   **Required Info**: Company Name, Industry, Estimated Consumption (kWh).
    *   **Result**: Logic is similar to Efficiency, but the data tags are different.

2.  **Project Setup (Admin)**:
    *   Admin creates the project via Wizard.
    *   **Difference**: Instead of asking for "Bills", the Admin sets up **Phases** (e.g., "Phase 1: Feasibility Study - $500", "Phase 2: Legal Roadmap - $1000").

3.  **Execution (Client)**:
    *   Client logs in. They don't see "Upload Bills".
    *   Instead, they see a **Phases Table** showing what has been done and what is next.

### Flow C: Energy Advocacy (Legal/ASEP)
*Focus: Fighting unfair claims with the regulator.*

1.  **The Inquiry (Public)**:
    *   Usually starts via the "Contact Us" form or direct "Advocacy" quote.
    *   **Required Info**: Case Description, Claim Number (NIS).

2.  **Execution**:
    *   This flow is manual. The Admin tracks "Inquiries" and communicates via email/phone before creating a formal project.

---

## 3. The Dashboards (A Walkthrough of Every Room)

### The Customer Portal (`/portal/customer`)
*Designed to be simple, reassuring, and clear.*

1.  **Home Dashboard**:
    *   **"My Inbox"**: Shows pending Quotes or Inquiries that haven't become projects yet.
    *   **"My Projects"**: Large cards showing your active services.
    *   **"Action Required"**: A yellow/red banner if you need to do something (e.g., "Schedule your visit!").

2.  **Project Detail View** (The "Hub"):
    *   This is where 90% of client time is spent.
    *   **Progress Bar**: A visual green bar from 0% to 100%.
    *   **Documents Tab**: A list of files (Contracts, Reports) shared by the Admin.
    *   **The "Embedded" Features**:
        *   **Schedule Wizard**: If status is `Pending Scheduling`, a calendar appears right here. The Client picks a date, and the system checks Technician availability instantly.
        *   **Bill Upload**: If Efficiency, a drag-and-drop box appears here.

### The Technician Portal (`/portal/technician`)
*Designed for mobile phones. Big buttons, less text.*

1.  **My Schedule (Home)**:
    *   A simple list of appointments for *today* and *upcoming*.
    *   Cards show: Time, Client Name, Address.

2.  **Job Execution (The Modal Flow)**:
    *   **Step 1: On Route**: Technician clicks "Go with Waze". The app opens Waze with the coordinates. They click "En Camino" to let the system know they are moving.
    *   **Step 2: Start**: Upon arrival, they click "Start Job".
    *   **Step 3: The Dashboard**: The card expands into an **Inspection Dashboard**.
        *   **Evidence**: A button to "Take Photo". Uploads directly to the cloud.
        *   **Checklist**: (Future feature) List of tasks to check off.
    *   **Step 4: Finish**: They click "Complete Job".
    *   **Automated Action**: The moment they click Complete, the Client gets an email asking for a review.

3.  **The "Oh No" Button (Incident Reporting)**:
    *   If a Technician can't make it (fiat tire, sick), they click "Report Incident".
    *   **The Modal**: A popup asks "Reason?" (Traffic, Vehicle, etc.).
    *   **The Result**: The system notifies the Admin immediately to reschedule.

### The Admin Portal (`/portal/admin`)
*The Cockpit. Complex but powerful.*

1.  **The Feed (Dashboard)**:
    *   Live list of everything happening: "New Quote", "New Inquiry", "Tech Juan Checked In".
    *   **Metrics**: Graphs showing how many leads came in this week.

2.  **The Project Wizard (Creating Work)**:
    *   Located in "Active Projects" > "+ New Project".
    *   **Step 1: The Client**: Search for an existing user OR type a new email to auto-invite them.
    *   **Step 2: The Project**: Name it (e.g., "Solar Install - Smith House"). Choose type (Efficiency/Consulting).
    *   **Step 3: The Details**: Property type, device options.
    *   **Step 4: Assign**: Choose a Technician (optional right now).

3.  **The User Directory**:
    *   Lists Clients, Technicians, and Staff.
    *   **Safety Guard**: An ordinary Admin cannot edit a Super Admin. If they try, an **"Inquiry Modal"** appears asking them to request permission.

4.  **Quote Management**:
    *   A table of all requests.
    *   **Filters**: Buttons to see only "Consulting" or only "Efficiency".
    *   **Action**: "View Details" allows editing the quote price before approving it.

---

## 4. Technical Concepts (For the Non-Technical)

### The Database (The Filing Cabinet)
Everything is stored in **Supabase**. Think of it as a smart Excel sheet.
*   **Tables**: Different sheets for `Users`, `Projects`, `Quotes`.
*   **Linking**: A Project row has a column `client_id` that points to a specific row in the `Users` sheet. This is how we know who owns what.

### Magic Links (The Keys)
We don't force people to remember passwords if they don't want to.
*   When an Admin invites a Client, the system sends a **Magic Link**.
*   Clicking it is like using a physical key—it logs you in instantly and securely without typing a password.

### Real-time (The Pulse)
The site is "live". If an Admin changes a project status from "Pending" to "Active", the Client sees it change *instantly* on their screen without refreshing. This is powered by Supabase Realtime usage.

---
**Verified by Audit**: January 20, 2026
**System Version**: 1.2
