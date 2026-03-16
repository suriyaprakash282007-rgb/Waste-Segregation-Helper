# ♻️ AI Waste Segregation Helper — v2.0 (React + Next.js)

<div align="center">

**🌍 AI-Powered waste classification · React · Next.js · AWS Rekognition**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Tailwind](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![MUI](https://img.shields.io/badge/Material_UI-5-007FFF?logo=mui)](https://mui.com)
[![AWS](https://img.shields.io/badge/AWS-Rekognition-FF9900?logo=amazonaws)](https://aws.amazon.com/rekognition)

</div>

---

## 📌 Overview

| Category | Bin | Examples |
|---|---|---|
| 🥬 **Wet Waste** | Green Bin | Food scraps, vegetable peels, garden waste |
| 🗑️ **Dry Waste** | Blue Bin | Plastic bags, wrappers, styrofoam |
| ♻️ **Recyclable** | Yellow Bin | Metal cans, glass, cardboard, newspaper |
| 📱 **E-Waste** | Red Bin | Old phones, batteries, chargers, PCBs |

---

## 🗂️ Project Structure

```
Waste segregation helper/
│
├── 🪟 start_nextjs.bat           ← One-click launcher (Windows)
│
├── 📂 nextjs-app/                ← Main Next.js application
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example              ← AWS credentials template
│   │
│   └── src/
│       ├── app/
│       │   ├── layout.jsx         ← Root layout (fonts, MUI theme)
│       │   ├── page.jsx           ← Main page (composes all sections)
│       │   ├── globals.css        ← Tailwind + custom animations
│       │   │
│       │   └── api/
│       │       ├── classify-waste/route.js  ← POST: AWS Rekognition
│       │       ├── categories/route.js      ← GET:  waste categories
│       │       └── stats/route.js           ← GET:  usage statistics
│       │
│       └── components/
│           ├── ThemeRegistry.jsx  ← MUI dark theme for Next.js App Router
│           ├── Navbar.jsx         ← Framer Motion navbar + mobile menu
│           ├── HeroSection.jsx    ← Animated hero with particle effects
│           ├── ClassifierSection.jsx ← React Dropzone + WebRTC + results
│           ├── CategoriesSection.jsx ← MUI Cards with reveal animation
│           ├── HowItWorksSection.jsx ← Tech flow + setup guide
│           ├── StatsSection.jsx   ← Animated counters + impact quote
│           └── Footer.jsx         ← Footer + scroll-to-top
│
├── 📂 backend/                   ← Legacy Python/Flask backend (optional)
│   ├── app.py
│   └── requirements.txt
│
└── 📂 frontend/                  ← Legacy vanilla HTML/CSS/JS (reference)
    ├── index.html
    ├── style.css
    └── app.js
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**: Download from [nodejs.org](https://nodejs.org/) (LTS recommended)

### Option 1 — One-Click Launch (Windows)
```
Double-click: start_nextjs.bat
```

### Option 2 — Manual
```bash
cd "nextjs-app"
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## ⚡ Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI components and state management |
| **Next.js 14** | SSR, routing, API routes, performance |
| **Tailwind CSS 3** | Responsive utility-first styling |
| **Material UI 5** | Cards, Tabs, Chips, LinearProgress, etc. |
| **Framer Motion** | Page animations, hover effects, AnimatePresence |
| **React Dropzone** | Drag-and-drop image upload |
| **React Webcam** | WebRTC camera capture from device |
| **Axios** | HTTP calls to the API layer |

### Backend (Next.js API Routes)
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Next.js Route Handlers** | REST API endpoints (`/api/*`) |
| **aws-sdk** | Connect to AWS services |

### Cloud & AI
| Service | Role |
|---|---|
| **AWS Rekognition** | Computer vision — detect object labels |
| **Amazon S3** | Store uploaded waste images |
| **AWS DynamoDB** | Log classification results |
| **AWS Lambda** | Serverless compute (optional deployment) |
| **AWS API Gateway** | Expose backend APIs |
| **AWS CloudFront** | CDN for fast global delivery |

---

## 🌐 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/classify-waste` | **Main** — classify a waste image |
| `GET`  | `/api/classify-waste` | Health check |
| `GET`  | `/api/categories`     | List all waste categories |
| `GET`  | `/api/stats`          | Usage statistics |

### POST `/api/classify-waste`

**Request (JSON):**
```json
{ "image_base64": "data:image/jpeg;base64,/9j/4AAQ…" }
```

**Response:**
```json
{
  "success": true,
  "category": "recyclable",
  "label": "Recyclable Waste",
  "emoji": "♻️",
  "color": "#f39c12",
  "confidence": 91.7,
  "bin_color": "Yellow Bin",
  "disposal": "Clean and sort before placing in YELLOW recycling bins.",
  "tips": ["Rinse containers", "Flatten cardboard boxes"],
  "impact": "Recycling 1 aluminium can saves enough energy to run a TV for 3 hours!",
  "matched_labels": ["Metal", "Aluminium Can"],
  "demo_mode": false
}
```

---

## ☁️ Connect Real AWS Rekognition

1. Create an [AWS Account](https://aws.amazon.com/free/)
2. Create an IAM user with `AmazonRekognitionReadOnlyAccess` + `AmazonS3FullAccess`
3. Edit `nextjs-app/.env.local`:

```env
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=my-waste-images
AWS_DYNAMODB_TABLE=WasteClassifications
NEXT_PUBLIC_USE_DEMO_MODE=false
```

4. Restart `npm run dev` — real AI classification is now active!

---

## 🏗️ Architecture (AWS)

```
User Browser
    ↓
Next.js App (React + Tailwind + MUI + Framer Motion)
    ↓ axios POST /api/classify-waste
Next.js API Route (Node.js)
    ↓
AWS API Gateway
    ↓
AWS Rekognition  →  Object labels + confidence scores
    ↓
Classification Engine  →  Keyword mapping → waste category
    ↓
Amazon S3      →  Store image
DynamoDB       →  Log result
CloudWatch     →  Monitor
    ↓
Response → User (with disposal tips, confidence, impact info)
```

---

## 🔐 Security

- HTTPS/TLS encryption
- JWT authentication (extensible)
- AWS IAM roles with least-privilege access
- Input validation on all endpoints
- No AWS keys in frontend code (server-side only via Next.js API routes)

---

## 💡 Future Improvements

- [ ] User authentication with AWS Cognito / NextAuth
- [ ] Scan history dashboard per user
- [ ] Mobile app (React Native)
- [ ] Waste disposal location map (Google Maps API)
- [ ] Custom ML model trained on regional waste datasets
- [ ] Multi-language support (i18n)
- [ ] IoT smart garbage bin integration
- [ ] Progressive Web App (PWA) offline support

---

<div align="center">
Built with 💚 for a cleaner planet · Next.js · React · AWS Rekognition
</div>
