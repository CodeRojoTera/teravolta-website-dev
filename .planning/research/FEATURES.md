# Feature Landscape: Service Management Platform

**Domain:** Field Service Management + CRM/ERP (Energy Services)
**Researched:** 2026-01-28
**Confidence:** MEDIUM (WebSearch verified with industry patterns)

## Executive Summary

Service management platforms in 2026 require comprehensive capabilities spanning three portals (Admin, Customer, Technician) with strong mobile-first design, real-time communication, and automated workflows. Based on industry analysis and comparison with Teravolta's current implementation, this document categorizes features into Table Stakes, Standard, and Advanced tiers to inform stabilization priorities.

**Key Finding:** Teravolta has strong Table Stakes coverage but needs stabilization in scheduling reliability, notification consistency, and document management workflows before pursuing advanced features.

---

## Table Stakes Features

Features that users absolutely expect. Missing or broken = platform is unusable or feels incomplete.

### Admin Portal (Back-Office)

| Feature | Why Expected | Teravolta Status | Complexity | Stabilization Priority |
|---------|--------------|------------------|------------|----------------------|
| **Work Order/Project Management** | Core business function - creating, viewing, updating service projects | PRESENT (active_projects table, Project Wizard) | Medium | HIGH - Wizard stability |
| **Customer Database** | Central record of all clients with contact info and history | PRESENT (users table with role filtering) | Low | MEDIUM - Data integrity |
| **Lead/Quote Management** | Converting inquiries to paying customers | PRESENT (quotes, inquiries tables) | Medium | HIGH - Approval workflow |
| **Technician Assignment** | Matching jobs to available field workers | PRESENT (assigned_technicians in projects) | Medium | HIGH - Assignment logic |
| **Real-Time Dashboard** | Live feed of system events (new quotes, tech check-ins) | PRESENT (Admin Feed with notifications) | Medium | MEDIUM - Event reliability |
| **User Role Management** | Different permission levels (Super Admin, Admin, Staff) | PRESENT (RLS policies per role) | Low | LOW - Working correctly |
| **Document/File Management** | Uploading contracts, reports, bills | PRESENT (documents table, Storage) | Medium | HIGH - Upload reliability |
| **Basic Reporting** | See project count, revenue, tech utilization | PARTIAL (metrics shown but limited) | Medium | MEDIUM - Expand metrics |

### Customer Portal (Self-Service)

| Feature | Why Expected | Teravolta Status | Complexity | Stabilization Priority |
|---------|--------------|------------------|------------|----------------------|
| **Project Status Visibility** | Customers need to know "what's happening with my service" | PRESENT (Project Detail Hub with progress bar) | Low | MEDIUM - Status accuracy |
| **Appointment Scheduling** | Self-service booking reduces admin overhead | PRESENT (Schedule Wizard in project hub) | High | HIGH - Calendar accuracy |
| **Document Access** | View contracts, invoices, reports | PRESENT (Documents tab in project detail) | Low | HIGH - Download reliability |
| **Service History** | See past and current projects | PRESENT (My Projects dashboard) | Low | LOW - Works correctly |
| **Payment Processing** | Pay invoices online | PRESENT (simulated, pending real integration) | High | MEDIUM - Real payment needed |
| **Secure Login** | Password or magic link authentication | PRESENT (Magic Links implemented) | Low | LOW - Working correctly |
| **File Upload** | Submit required documents (bills, photos) | PRESENT (Bill upload for efficiency projects) | Medium | HIGH - Upload stability |
| **Communication Channel** | Contact admin or ask questions | PARTIAL (via inquiries, no in-app messaging) | Medium | MEDIUM - Add inquiry form |

### Technician Portal (Mobile-First)

| Feature | Why Expected | Teravolta Status | Complexity | Stabilization Priority |
|---------|--------------|------------------|------------|----------------------|
| **Daily Schedule View** | See today's appointments at a glance | PRESENT (My Schedule home screen) | Low | HIGH - Sync reliability |
| **Job Details Access** | Client name, address, service type, notes | PRESENT (Appointment cards) | Low | MEDIUM - Complete info |
| **Navigation Integration** | One-click directions to job site | PRESENT (Waze integration) | Low | LOW - Works correctly |
| **Status Updates** | Mark job as On Route, Started, Completed | PRESENT (Job Modal with status buttons) | Medium | HIGH - State transitions |
| **Photo Upload (Evidence)** | Capture work completed | PRESENT (Evidence upload in job dashboard) | Medium | HIGH - Upload reliability |
| **Offline Functionality** | Work in areas without signal | MISSING | High | LOW - Future scope |
| **Time Tracking** | Log arrival, departure, work hours | PRESENT (check_in_time, check_out_time) | Low | MEDIUM - Automated tracking |
| **Incident Reporting** | Report problems (vehicle issues, delays) | PRESENT ("Oh No" button with modal) | Medium | MEDIUM - Notification flow |

**Sources:**
- [Field Service Management Trends in 2026](https://fieldworkhq.com/2025/12/26/field-service-management-trends-in-2026/)
- [Tips For Field Service Software In 2026](https://ezmanagement.com/tips-for-field-service-software-in-2026/)
- [Best Field Service Management Software for 2026](https://tofu.com/blog/best-field-service-management-software)
- [Top Customer Self-Service Portals For 2026](https://www.clinked.com/blog/customer-self-service-portals)

---

## Standard Features

Expected in modern platforms, but basic implementation is acceptable for MVP/stabilization phase.

### Admin Portal

| Feature | Why Standard | Teravolta Status | Complexity | Notes |
|---------|--------------|------------------|------------|-------|
| **Advanced Scheduling** | Auto-assign techs based on location, skills, availability | MISSING (Manual assignment only) | High | Defer to post-stabilization |
| **Invoice Generation** | Create bills from project data | PRESENT (invoices table) | Medium | Basic - needs workflow |
| **Inventory Tracking** | Track parts and materials | MISSING | High | Not critical for energy services |
| **Custom Workflows** | Configure approval chains, automation rules | MISSING | Very High | Enterprise feature |
| **Email/SMS Notifications** | Automated client and tech reminders | PARTIAL (Email only, via Supabase functions) | Medium | Add SMS for completeness |
| **Performance Analytics** | Tech productivity, first-time fix rate, customer satisfaction | MISSING | High | Future scope |
| **Calendar View** | See all appointments in calendar grid | MISSING (List view only) | Medium | Nice to have |
| **Bulk Actions** | Update multiple projects at once | MISSING | Medium | Low priority |

### Customer Portal

| Feature | Why Standard | Teravolta Status | Complexity | Notes |
|---------|--------------|------------------|------------|-------|
| **In-App Notifications** | Alert customer of status changes without email | PRESENT (notifications table) | Medium | Verify delivery reliability |
| **Technician Tracking** | See tech location en route (ETA) | MISSING | High | Privacy concerns, defer |
| **Review/Rating System** | Rate technician after service | PRESENT (technician_reviews table) | Medium | Verify email trigger works |
| **Multi-Project View** | Households with multiple services | PRESENT (My Projects list) | Low | Works correctly |
| **Service Request Form** | Request new service from portal | MISSING | Medium | Use inquiry form for now |
| **Payment History** | See all past invoices and receipts | PARTIAL (invoices table exists) | Medium | Link to project view |

### Technician Portal

| Feature | Why Standard | Teravolta Status | Complexity | Notes |
|---------|--------------|------------------|------------|-------|
| **Job History** | View past completed jobs | MISSING | Medium | Future scope |
| **Customer Contact Info** | Phone number for arrival calls | PRESENT (Client info in appointment) | Low | Verify visibility |
| **Digital Checklists** | Step-by-step task lists | MISSING | Medium | Mentioned as "Future" |
| **Parts/Inventory Lookup** | See what's needed for job | MISSING | High | Not applicable yet |
| **Signature Capture** | Customer sign-off on work | MISSING | Medium | Future scope |
| **Multi-Day Schedule** | See week ahead, not just today | PARTIAL (Shows "upcoming") | Low | Enhance date filtering |

**Sources:**
- [Global Field Service Management Trends 2026](https://brocoders.com/blog/global-field-service-management-trends-2026/)
- [Technician Management Software for 2026](https://www.fieldservicely.com/technician-management-software)
- [Field Service CRM Software Features](https://buildops.com/resources/field-service-crm-software/)

---

## Advanced Features (Differentiators)

Features that set premium platforms apart. Not expected but highly valued. Defer to post-stabilization.

### AI and Automation

| Feature | Value Proposition | Complexity | Teravolta Priority |
|---------|-------------------|------------|-------------------|
| **AI-Powered Scheduling** | Auto-optimize routes and assignments based on skills, location, priority | Very High | Low (Manual works for current scale) |
| **Predictive Maintenance** | Alert customers before equipment fails using IoT sensors | Very High | Not Applicable (Service type) |
| **AI Chat Support** | Answer common customer questions via chatbot | High | Low (Small customer base) |
| **Automated Quote Generation** | AI calculates pricing from consumption data | High | Medium (Could accelerate sales) |
| **Smart Recommendations** | Suggest upsells or service packages based on customer profile | High | Low |

### Advanced Customer Experience

| Feature | Value Proposition | Complexity | Teravolta Priority |
|---------|-------------------|------------|-------------------|
| **Live Technician Tracking** | Real-time GPS map showing tech location | High | Low (Privacy + complexity) |
| **Video Consultation** | Virtual assessments before site visit | Medium | Medium (Could reduce unnecessary visits) |
| **Customer Community Forum** | Peer support and knowledge sharing | Medium | Low (Not enough users yet) |
| **Subscription Management** | Recurring services with auto-billing | High | Low (Not subscription model) |
| **Mobile App (Native)** | iOS/Android apps instead of web | Very High | Low (PWA sufficient) |

### Advanced Operations

| Feature | Value Proposition | Complexity | Teravolta Priority |
|---------|-------------------|------------|-------------------|
| **IoT Integration** | Sensors reporting equipment status | Very High | Low (Not applicable) |
| **Augmented Reality (AR)** | Tech uses AR glasses for remote guidance | Very High | Low (Bleeding edge) |
| **Advanced Analytics** | Predictive insights, revenue forecasting, churn prediction | High | Medium (Useful as business grows) |
| **Third-Party Integrations** | Connect to QuickBooks, Stripe, CRMs | Medium | Medium (Payment gateway needed) |
| **API for Partners** | Allow third-party developers to build on platform | High | Low |

**Sources:**
- [How AI Is Transforming Field Service Management in 2026](https://brocoders.com/blog/ai-in-field-service-management/)
- [Field Service Management Software Vendors to Know](https://www.techtarget.com/searchcustomerexperience/tip/Field-service-management-software-vendors-to-know)

---

## Anti-Features

Features to explicitly NOT build. Common mistakes in this domain based on industry pitfalls.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Over-Complicated Onboarding** | Adding too many mandatory setup steps frustrates new customers | Keep initial customer setup to name, email, and one critical action (schedule or upload bill) |
| **Forced Mobile App Download** | Web apps can do 90% of what native apps do | Optimize web portal for mobile browsers (PWA approach) |
| **Complex Time Tracking** | Technicians hate bureaucracy - making them log every 15 minutes kills morale | Auto-capture check-in and check-out only; trust techs to work efficiently |
| **Excessive In-App Gamification** | Badges and leaderboards feel gimmicky for professional services | Show meaningful metrics (jobs completed, customer ratings) without "points" |
| **Custom Reporting Builder** | Admins rarely use drag-and-drop report builders - too complex | Provide pre-built reports for common questions (revenue, tech utilization) |
| **Social Media Integration** | Sharing service requests to Facebook adds no value | Keep communication professional (email, SMS, in-app) |
| **Feature Parity Across Roles** | Making every portal do everything creates cognitive overload | Keep portals focused: Customer sees progress, Tech sees schedule, Admin sees everything |
| **Real-Time Location Broadcasting** | Constant GPS tracking feels invasive to technicians | Only track during active job (On Route → Complete), not 24/7 |

**Sources:**
- [6 Common Mistakes with Field Service Management](https://www.bigchange.com/us/blog/6-common-mistakes-with-field-service-management)
- [How to Avoid 6 Costly Field Service Management Mistakes](https://improvebusinessprocesses.com/how-to-avoid-6-costly-field-service-management-mistakes-today/)
- [14 Field Service Management Challenges and Solutions](https://www.netsuite.com/portal/resource/articles/erp/field-services-management-challenges.shtml)

---

## Feature Dependencies

Understanding what must work before other features can be added.

```
Core Foundation (Must be stable first):
├── User Authentication (Magic Links)
│   └── Role-Based Access Control (RLS)
│       ├── Admin Portal Access
│       ├── Customer Portal Access
│       └── Technician Portal Access
│
├── Quote-to-Project Workflow
│   ├── Quote Submission (Public)
│   ├── Admin Review & Approval
│   ├── Project Creation (Wizard)
│   └── Customer Onboarding (Magic Link)
│
└── Appointment Scheduling
    ├── Technician Availability Check
    ├── Customer Date Selection
    ├── Appointment Creation
    └── Notification Dispatch

Dependent on Foundation:
├── Document Management
│   ├── File Upload (Bills, Photos, Contracts)
│   ├── Storage Integration (Supabase Storage)
│   └── Download/View Functionality
│
├── Status Tracking
│   ├── Project Status Updates
│   ├── Real-Time Sync (Supabase Realtime)
│   └── Customer Visibility
│
└── Technician Workflow
    ├── Job Assignment (Admin)
    ├── Schedule Sync (Technician)
    ├── Status Updates (On Route, Started, Completed)
    └── Evidence Upload

Advanced (Requires stable base):
├── Payment Processing
│   ├── Payment Gateway Integration (Stripe, PayPal)
│   ├── Invoice Generation
│   └── Payment History
│
├── Advanced Scheduling
│   ├── Auto-Assignment Logic
│   ├── Route Optimization
│   └── Conflict Detection
│
└── Analytics & Reporting
    ├── Data Aggregation Queries
    ├── Visualization Components
    └── Export Functionality
```

---

## Quote-to-Project Workflow (Detailed)

Service management platforms distinguish themselves by how smoothly they handle the sales-to-delivery pipeline. This is Teravolta's core competitive feature.

### Industry Standard Flow

1. **Lead Capture**: Public form collects basic info
2. **Qualification**: Admin reviews and determines if viable
3. **Quote Generation**: System or admin creates pricing
4. **Approval/Contract**: Customer signs or approves
5. **Payment**: Initial deposit or full payment
6. **Work Order Creation**: Quote becomes a scheduled job
7. **Execution**: Technician completes work
8. **Completion**: Final invoice and close-out

### Teravolta Implementation Status

| Stage | Status | Notes |
|-------|--------|-------|
| Lead Capture | COMPLETE | Quote and Inquiry forms work well |
| Qualification | COMPLETE | Admin can approve/reject quotes |
| Quote Generation | PARTIAL | Admin manually enters price, no auto-calculation |
| Approval/Contract | SIMULATED | No digital signature, just status change |
| Payment | SIMULATED | Shows payment UI but no real gateway |
| Work Order Creation | COMPLETE | Project Wizard converts quote to active_projects |
| Execution | COMPLETE | Technician portal handles job flow |
| Completion | PARTIAL | Can mark complete, but no auto-invoice |

**Stabilization Focus for Quote-to-Project:**
1. Fix any bugs in Project Wizard (Service Type selection, Technician Assignment)
2. Verify Quote → Project linking (quote_id reference)
3. Ensure customer receives onboarding email after project creation
4. Test document upload flow (bills for efficiency projects)
5. Add payment gateway integration (move from simulated to real)

**Sources:**
- [Quote-to-Cash Process Explained](https://www.paddle.com/resources/quote-to-cash)
- [Quote to Cash Software for 2026](https://oneflow.com/blog/quote-to-cash-software/)

---

## Service-Type Specific Features

Teravolta supports three service types with different workflows. Feature requirements vary.

### Energy Efficiency (Residential/Commercial)

**Table Stakes:**
- Bill upload (customer provides consumption data)
- Site assessment scheduling
- Equipment recommendations
- Installation appointment
- Post-install verification

**Teravolta Coverage:** ✅ Strong (Bill upload works, scheduling works, project tracking works)

### Solar Consulting (Business/Legal)

**Table Stakes:**
- Multi-phase project structure (Feasibility → Design → Legal → Execution)
- Document-heavy (reports, permits, contracts)
- Milestone-based billing
- Longer project timelines (months vs. days)

**Teravolta Coverage:** ⚠️ Partial (Can create consulting projects, but phases are admin-managed manually, no automated milestone tracking)

### Energy Advocacy (ASEP/Regulatory)

**Table Stakes:**
- Case management (claim number tracking)
- Deadline tracking (regulatory filings)
- Document repository (evidence, correspondence)
- Status updates (submitted, under review, resolved)

**Teravolta Coverage:** ⚠️ Weak (Currently handled via inquiries, no structured case workflow)

**Recommendation:** Focus stabilization on **Energy Efficiency** (strongest implementation) and **Consulting** (second priority). Advocacy can remain inquiry-based until demand justifies dedicated features.

---

## MVP Recommendation for Stabilization Phase

Based on industry standards and Teravolta's current state, prioritize these features for stabilization:

### P0 (Must Work Reliably)
1. **Quote Submission → Admin Review → Project Creation** (Core business flow)
2. **Appointment Scheduling** (Customer schedules, tech sees in portal)
3. **Technician Status Updates** (On Route → Started → Completed)
4. **Document Upload/Download** (Bills, evidence photos, contracts)
5. **Magic Link Authentication** (Customer and tech onboarding)

### P1 (Should Work Consistently)
1. **Email Notifications** (Quote received, project created, appointment scheduled, job completed)
2. **Real-Time Dashboard Updates** (Admin sees events as they happen)
3. **Project Status Visibility** (Customer sees accurate progress)
4. **Technician Assignment** (Admin assigns techs to projects without bugs)

### P2 (Can Be Basic, But Should Exist)
1. **Payment Processing** (Replace simulation with real gateway)
2. **Invoice Generation** (Auto-create from project completion)
3. **Customer Review Collection** (Email trigger after job complete)
4. **Basic Reporting** (Admin sees project count, revenue, tech utilization)

### Defer to Post-Stabilization
- Advanced scheduling (auto-assignment, route optimization)
- Offline functionality for technicians
- Native mobile apps
- AI features (chatbots, predictive analytics)
- Third-party integrations (QuickBooks, advanced payment processors)
- Multi-phase project automation for consulting

---

## Competitive Analysis Context

Based on industry research, Teravolta compares to established platforms:

| Capability | Industry Leaders | Teravolta |
|------------|-----------------|-----------|
| **Core FSM** | ✅ Scheduling, dispatch, mobile, invoicing | ✅ Has all core components |
| **Customer Portal** | ✅ Self-service scheduling, document access, payment | ✅ Strong self-service capabilities |
| **Mobile Technician App** | ✅ Native apps with offline mode | ⚠️ Web-based, no offline |
| **Integrations** | ✅ QuickBooks, Stripe, Zapier, APIs | ⚠️ Limited (Supabase Storage only) |
| **AI/Automation** | ✅ Auto-scheduling, predictive maintenance, chatbots | ❌ None (appropriate for stage) |
| **Quote-to-Cash** | ⚠️ Many FSM platforms lack strong sales pipeline | ✅ **Differentiator** - Strong quote flow |
| **Role-Based Portals** | ✅ Admin, customer, tech portals | ✅ All three implemented well |

**Competitive Position:** Teravolta has **table stakes parity** with industry leaders in core FSM functionality. The **Quote-to-Project Wizard** is a differentiator that many competitors lack. Focus stabilization on reliability, not feature additions.

---

## Feature Validation Against Current Implementation

Cross-referencing with `SYSTEM_NARRATIVE.md` and `ATOMIC_DATABASE.md`:

### ✅ Features Present and Documented
- Customer Portal with project dashboard
- Admin Portal with live feed
- Technician Portal with job execution flow
- Quote and Inquiry management
- Project Wizard for creating work
- Magic Link authentication
- Document upload/download
- Appointment scheduling with tech assignment
- Evidence photo upload
- Review system (technician_reviews table)
- Real-time updates (Supabase Realtime)

### ⚠️ Features Present but Need Validation
- Payment processing (marked as "simulated")
- Invoice generation (table exists, workflow unclear)
- Email notifications (mentioned but reliability unknown)
- Technician availability checking (logic unclear)
- Document categorization (column exists, unsure if used)

### ❌ Features Missing (Expected by Industry)
- Offline mode for technicians
- Calendar view for appointments
- Customer service request form (from portal)
- Advanced analytics/reporting
- Third-party payment gateway integration
- SMS notifications
- Digital signature capture

**Stabilization Recommendation:** Focus on validating and hardening the "Present but Need Validation" features before adding new capabilities.

---

## Summary: Feature Prioritization for Stabilization

Based on this research, the stabilization milestone should focus on:

1. **Reliability over Features**: Don't add new capabilities until existing ones work flawlessly
2. **Quote-to-Project Flow**: This is the business-critical path - must be bulletproof
3. **Notification Consistency**: Customers and techs rely on timely alerts
4. **Document Management**: File uploads/downloads must work every time
5. **Payment Gateway**: Move from simulation to real integration
6. **Mobile Optimization**: Technician portal must work flawlessly on phones

**Not Recommended for Stabilization:**
- AI features
- Advanced scheduling algorithms
- Offline functionality
- Native mobile apps
- Advanced analytics
- Third-party CRM integrations

**Confidence Level:** MEDIUM - Based on multiple current industry sources (2026), but no authoritative FSM standards body. Findings represent common patterns across 10+ platforms (ServiceNow, Salesforce FSM, Jobber, Workiz, FieldPoint, ServiceTrade, etc.).

---

## Sources Summary

All sources accessed January 28, 2026:

**Field Service Management Overview:**
- [Field Service Management Trends in 2026](https://fieldworkhq.com/2025/12/26/field-service-management-trends-in-2026/)
- [Global Field Service Management Trends 2026](https://brocoders.com/blog/global-field-service-management-trends-2026/)
- [Tips For Field Service Software In 2026](https://ezmanagement.com/tips-for-field-service-software-in-2026/)
- [Best Field Service Management Software for 2026](https://tofu.com/blog/best-field-service-management-software)
- [Field Service CRM Software Features](https://buildops.com/resources/field-service-crm-software/)

**Customer Portal Features:**
- [Top Customer Self-Service Portals For 2026](https://www.clinked.com/blog/customer-self-service-portals)
- [Best Customer Self-Service Portals](https://www.zendesk.com/service/help-center/customer-self-service/)
- [Customer Portal 101: Features, Benefits & Top Tools](https://www.clinked.com/blog/customer-portals)

**Technician Features:**
- [Technician Management Software for 2026](https://www.fieldservicely.com/technician-management-software)
- [Field Service Mobile App Features](https://orcatec.com/features/field-service-mobile-app)

**Quote-to-Cash Workflow:**
- [Quote-to-Cash Software: 10 Best Solutions for 2026](https://oneflow.com/blog/quote-to-cash-software/)
- [Quote-to-Cash Process Explained](https://www.paddle.com/resources/quote-to-cash)

**Pitfalls and Mistakes:**
- [6 Common Mistakes with Field Service Management](https://www.bigchange.com/us/blog/6-common-mistakes-with-field-service-management)
- [14 Field Service Management Challenges and Solutions](https://www.netsuite.com/portal/resource/articles/erp/field-services-management-challenges.shtml)
- [How to Avoid 6 Costly Field Service Management Mistakes](https://improvebusinessprocesses.com/how-to-avoid-6-costly-field-service-management-mistakes-today/)

**Admin/Back-Office:**
- [Best IT Service Management Platforms Reviews 2026](https://www.gartner.com/reviews/market/it-service-management-platforms)
- [Enterprise Service Management: A Modern Guide for 2026](https://monday.com/blog/service/enterprise-service-management/)
