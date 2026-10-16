# AegisDesk — Multi-Tenant SaaS Platform for AI Customer Support

A production-quality SaaS frontend built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. Designed specifically to interface with your Python FastAPI, LangGraph, RAG vector search, and PostgreSQL multi-tenant backend.

---

## 🚀 Key Highlights & Architecture

1. **Strict Multi-Tenant Workspace Isolation:**
   - Every company receives a dedicated **Tenant ID** (e.g. `tnt_apex_9921`).
   - Every API request carries both `Authorization: Bearer <jwt_token>` and `X-Tenant-ID: <tenantId>`.
   - Security Notice: *"The Tenant ID identifies your company's workspace. It is not a password, API key, or proof of authorization."*

2. **Customer-Facing vs. Staff Dashboard Separation:**
   - **Company Staff:** Access private dashboard (`/dashboard`) with RBAC (Owner, Admin, Support Agent).
   - **End Customers:** Interact strictly through the standalone/embeddable customer widget (`/widget/[tenantId]`) without exposing internal company PDFs, credentials, or dashboard APIs.

3. **Backend-Verified Entitlements & Checkout:**
   - Supports **Stripe** and **Razorpay** checkout session creation.
   - Redirect to official payment provider checkout.
   - Access to paid features is strictly withheld until the backend confirms verified payment webhook events.

4. **Zero-Configuration Instant Local Dev:**
   - Includes a typed API client with a toggleable mock engine (`NEXT_PUBLIC_USE_MOCK_API="true"`). You can run and demonstrate the entire platform immediately, or point `NEXT_PUBLIC_API_BASE_URL` directly to your active FastAPI backend.

---

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.tsx                     # Public landing page (Hero, Features, How It Works, Pricing preview)
│   │   ├── pricing/page.tsx             # Configurable subscription plans with monthly/annual toggle & FAQs
│   │   ├── security/page.tsx            # Multi-tenant data isolation & compliance documentation
│   │   ├── docs/page.tsx                # FastAPI backend API contract & schema documentation
│   │   ├── auth/
│   │   │   ├── sign-in/page.tsx         # Staff authentication with pre-filled demo credentials
│   │   │   ├── sign-up/page.tsx         # Sign-up redirection to plan selection & registration
│   │   │   ├── forgot-password/page.tsx # Password recovery flow
│   │   │   ├── reset-password/page.tsx  # Secure password update form
│   │   │   ├── email-verification/page.tsx
│   │   │   └── access-denied/page.tsx   # Unauthorized tenant protection page
│   │   ├── checkout/
│   │   │   ├── page.tsx                 # Plan summary, company registration form, gateway selector
│   │   │   ├── success/page.tsx         # Post-checkout verification with backend polling
│   │   │   ├── pending/page.tsx         # Pending webhook settlement state
│   │   │   └── cancelled/page.tsx       # Graceful checkout recovery & retry
│   │   ├── dashboard/
│   │   │   ├── layout.tsx               # Persistent responsive sidebar & top header
│   │   │   ├── page.tsx                 # Overview KPI metrics, usage meters & recent activity
│   │   │   ├── assistant/page.tsx       # AI prompt customization, tone, RAG top-K bounds & test sandbox
│   │   │   ├── knowledge-base/page.tsx  # Drag & drop PDF ingestion, status tracker & chunk modal
│   │   │   ├── conversations/page.tsx   # Searchable chat transcripts with citation inspector
│   │   │   ├── analytics/page.tsx       # Auto-resolution rates, latency charts & knowledge gaps
│   │   │   ├── team/page.tsx            # Member invitations and RBAC (Owner, Admin, Agent)
│   │   │   ├── billing/page.tsx         # Plan management, quota progress bars & invoice receipts
│   │   │   ├── settings/page.tsx        # Company profile, brand color picker & Tenant ID policy
│   │   │   └── security/page.tsx        # API keys, webhook signing secrets & immutable audit logs
│   │   └── widget/
│   │       └── [tenantId]/page.tsx      # Standalone customer-facing chatbot preview
│   ├── components/
│   │   ├── layout/                      # Navbar, Footer, DashboardSidebar, DashboardHeader
│   │   ├── marketing/                   # Hero, Features, HowItWorks, PricingCards
│   │   ├── providers/                   # AuthProvider, ThemeProvider, ToastProvider
│   │   └── ui/                          # Button, Input, Textarea, Card, Badge, Modal, Progress, Skeleton
│   ├── lib/
│   │   ├── api-client.ts                # Typed client for FastAPI with X-Tenant-ID & JWT handling
│   │   ├── auth.tsx                     # Tenant auth context & session hook
│   │   ├── validation.ts                # Zod schemas for all user inputs
│   │   ├── mock-data.ts                 # Realistic demo data for instant turnkey testing
│   │   └── utils.ts                     # Byte, date, and classname formatters
│   └── types/                           # Strongly typed domain models
```

---

## 🛠️ Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Application
NEXT_PUBLIC_APP_NAME="OmniSupport AI"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Backend FastAPI Integration
# Point to your running FastAPI backend or set USE_MOCK_API to true for instant frontend testing
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api/v1"
NEXT_PUBLIC_USE_MOCK_API="true"

# Payment Providers (stripe | razorpay)
NEXT_PUBLIC_PAYMENT_PROVIDER="stripe"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_sample_key"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_sample_key"
```

---

## 🔌 FastAPI Backend Integration Contract

Refer to [`/docs`](http://localhost:3000/docs) in the running application for complete endpoint schemas.

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/v1/auth/register` | Provisions company tenant, initial owner, and RAG vector schema |
| **Auth** | `POST` | `/api/v1/auth/login` | Returns JWT bearer token and verified tenant ID |
| **Tenant** | `GET` | `/api/v1/tenant/current` | Returns authorized tenant record |
| **Tenant** | `PATCH` | `/api/v1/tenant/settings` | Updates branding, support contact, and language |
| **Billing** | `GET` | `/api/v1/billing/plans` | Fetches available subscription tiers & limits |
| **Billing** | `POST` | `/api/v1/billing/checkout-session` | Initiates Stripe/Razorpay session |
| **Billing** | `GET` | `/api/v1/billing/verify-payment` | Validates webhook settlement |
| **Documents**| `GET` | `/api/v1/documents` | Lists tenant PDFs with status (`ready`, `processing`, etc.) |
| **Documents**| `POST` | `/api/v1/documents/upload` | Multipart PDF upload triggering LangGraph ingestion |
| **Documents**| `DELETE`| `/api/v1/documents/{id}` | Purges document and corresponding vector chunks |
| **Assistant**| `GET` | `/api/v1/assistant/config` | Retrieves prompt directives and retrieval thresholds |
| **Assistant**| `PUT` | `/api/v1/assistant/config` | Updates draft assistant configuration |
| **Assistant**| `POST`| `/api/v1/assistant/publish` | Publishes draft to active customer pipeline |
| **Assistant**| `POST`| `/api/v1/assistant/test-chat` | Staff testing endpoint returning response & citations |
| **Widget** | `POST` | `/api/v1/widget/{tenantId}/chat` | Customer-facing isolated chat endpoint |

---

## 🏃 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the landing page.

- **Staff Dashboard:** [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **Customer Chat Widget:** [http://localhost:3000/widget/tnt_apex_9921](http://localhost:3000/widget/tnt_apex_9921)
- **Plans & Pricing:** [http://localhost:3000/pricing](http://localhost:3000/pricing)
- **FastAPI Backend Contract:** [http://localhost:3000/docs](http://localhost:3000/docs)
