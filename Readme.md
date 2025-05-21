#Kuinbee - Data Marketplace Platform

##A full-stack data-as-a-service platform for secure data exchange between providers and consumers.

###This monorepo contains:

Client: React-powered frontend for user interaction
Server: Secured Node.js API with PostgreSQL (Drizzle ORM + Neon)
Shared: Cross-project data schemas, types, and validation utilities

###Project Overview
Kuinbee is a B2B data marketplace where:

Data Providers can upload datasets securely
Enterprise Buyers browse, purchase, and download data
The backend handles authentication, access control, and billing workflows
🔍 Key Features
📈 Dataset catalog with search/filter UI
🛡️ Role-based access control (Admin / User)
💳 Secure payments + purchase history tracking
🔐 JWT + session-based authentication
⚡ Real-time data previews and API access
🌍 Multi-tenant support with dynamic data isolation



###Tech Stack
Layer	Technology
**Frontend**	React + TypeScript + Drizzle-Zod
**Backend**	Node.js (Express) + Drizzle ORM
**Database**	PostgreSQL (Neon Serverless)
**Auth**	JWT + Express Session
**Realtime**	WebSockets for live data updates
**Shared**	TypeScript types + data contracts

###Getting Started
**System Requirements**
Node.js 18+
git installed
Internet connection

Clone the Repo
git clone git@github.com:Tamnud-ghule/KUINBEE.git

### Server
cd server
npm install

###Shared module needed by both
cd ../shared
npm install

### Frontend
cd ../client
npm install

Build Shared Module
The shared/ folder powers schema validation and types across client & server.

cd shared
npm run build

Link it to the server:
cd ../server
npm install ../shared

Use these credentials to test:

Role	Email	Password
Admin	admin@example.com	admin123
Buyer	user@example.com	user123
Test API endpoints with:

datasets - GET datasets
login - POST login
purchases - GET user activity

Kuinbee/
├── client/        # React frontend
├── server/        # Node.js API layer
├── shared/        # Shared types, zod schemas, utils
├── README.md
├── .gitignore
└── package.json   # (Optional root-level package.json for mono-workspace scripts)
