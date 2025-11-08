# RuralRise OS - Architecture & Implementation Guide

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Tech Stack Decisions](#tech-stack-decisions)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Authentication Flow](#authentication-flow)
8. [Offline-First Strategy](#offline-first-strategy)
9. [AI Integration Points](#ai-integration-points)
10. [Deployment Architecture](#deployment-architecture)
11. [Next Steps](#next-steps)

---

## 🏗️ System Overview

RuralRise OS is a full-stack AI-powered rural workforce training platform with three distinct user roles:

- **Learners**: Access personalized learning paths, complete lessons, track progress
- **Trainers**: Manage cohorts, grade assessments, provide interventions
- **Operations**: Monitor KPIs, manage clients/trainers, optimize resources

### Current Status

✅ **Complete:**
- Frontend UI/UX (95% done)
- Component library (shadcn/ui)
- Type definitions
- API service layer
- Auth context
- Custom hooks (TanStack Query)

❌ **Missing:**
- Backend API server
- Database
- Authentication system
- Real AI integration
- Offline storage
- Testing infrastructure

---

## 🛠️ Tech Stack Decisions

### Frontend (Implemented)

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3 | UI framework |
| TypeScript | 5.5 | Type safety |
| Vite | 5.4 | Build tool |
| TanStack Query | 5.56 | Server state management |
| React Router | 6.26 | Client-side routing |
| Tailwind CSS | 3.4 | Styling |
| shadcn/ui | Latest | Component library |
| Recharts | 2.12 | Data visualization |

### Backend (Recommended Options)

#### Option A: Node.js Stack (Recommended)

```
✅ Best for TypeScript consistency
✅ Large ecosystem
✅ Great performance
✅ Easy deployment
```

**Stack:**
- **Runtime**: Node.js 20+ LTS
- **Framework**: Express.js or Fastify
- **ORM**: Prisma
- **Database**: PostgreSQL 15+
- **Auth**: JWT + bcrypt
- **Real-time**: Socket.IO
- **Caching**: Redis
- **File Storage**: AWS S3 or MinIO

#### Option B: Python Stack (Alternative)

```
✅ Better for AI/ML integration
✅ Rich data science libraries
⚠️ Slower than Node.js
⚠️ Different language from frontend
```

**Stack:**
- **Framework**: FastAPI
- **ORM**: SQLAlchemy
- **Database**: PostgreSQL 15+
- **Auth**: JWT + passlib
- **Real-time**: FastAPI WebSockets
- **Caching**: Redis
- **AI/ML**: scikit-learn, TensorFlow

#### Option C: Next.js Full-Stack (Fastest)

```
✅ Fastest to market
✅ Single codebase
✅ Built-in API routes
⚠️ Less flexible scaling
⚠️ Vendor lock-in to Vercel
```

**Stack:**
- **Framework**: Next.js 14+ (App Router)
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **ORM**: Prisma
- **Auth**: NextAuth.js or Supabase Auth
- **Real-time**: Supabase Realtime

### Recommendation: **Option A (Node.js + Express + Prisma + PostgreSQL)**

**Rationale:**
1. TypeScript consistency across stack
2. Best balance of performance, flexibility, and ecosystem
3. Easy to scale and deploy
4. Team familiarity (most common stack)
5. Can integrate Python AI services later via microservices

---

## 🎨 Frontend Architecture

### Directory Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components (47 files)
│   ├── LearnerDashboard.tsx
│   ├── TrainerConsole.tsx
│   └── OperationsAnalytics.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── hooks/              # Custom hooks
│   ├── use-toast.ts   # Toast notifications
│   ├── use-mobile.tsx # Mobile detection
│   ├── useLearner.ts  # Learner data hooks
│   ├── useTrainer.ts  # Trainer data hooks
│   └── useOperations.ts # Operations data hooks
├── pages/              # Page components
│   ├── Index.tsx      # Landing page
│   └── NotFound.tsx   # 404 page
├── services/           # API services
│   ├── apiClient.ts   # Axios instance
│   ├── authService.ts # Auth API calls
│   ├── learnerService.ts
│   ├── trainerService.ts
│   └── operationsService.ts
├── types/              # TypeScript definitions
│   └── index.ts       # All type definitions
├── lib/                # Utility functions
│   └── utils.ts       # Helper functions
├── App.tsx             # Root component
└── main.tsx            # Entry point
```

### Data Flow

```
Component
    ↓
Custom Hook (useLearner, useTrainer, etc.)
    ↓
TanStack Query (useQuery, useMutation)
    ↓
Service Layer (learnerService, etc.)
    ↓
API Client (axios with interceptors)
    ↓
Backend API
    ↓
Database
```

### State Management Strategy

1. **Server State**: TanStack Query (API data)
2. **Auth State**: React Context (user, isAuthenticated)
3. **UI State**: Local component state (useState)
4. **Form State**: React Hook Form (not yet implemented)
5. **Persistent State**: localStorage (tokens, preferences)

---

## 🖥️ Backend Architecture

### Recommended Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts      # Prisma client
│   │   ├── redis.ts         # Redis client
│   │   └── env.ts           # Environment validation
│   ├── middleware/
│   │   ├── auth.ts          # JWT verification
│   │   ├── validation.ts    # Request validation (Zod)
│   │   ├── errorHandler.ts  # Global error handling
│   │   └── rateLimiter.ts   # Rate limiting
│   ├── routes/
│   │   ├── auth.routes.ts   # /api/auth/*
│   │   ├── learner.routes.ts # /api/learner/*
│   │   ├── trainer.routes.ts # /api/trainer/*
│   │   └── operations.routes.ts # /api/operations/*
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── learner.controller.ts
│   │   ├── trainer.controller.ts
│   │   └── operations.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── learner.service.ts
│   │   ├── trainer.service.ts
│   │   ├── operations.service.ts
│   │   ├── ai.service.ts     # AI integration
│   │   └── email.service.ts  # Email notifications
│   ├── models/              # Prisma schema
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   └── validators.ts
│   └── server.ts            # Express app
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed data
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── package.json
└── tsconfig.json
```

### Key Principles

1. **Layered Architecture**: Routes → Controllers → Services → Database
2. **Dependency Injection**: Services injected into controllers
3. **Error Handling**: Centralized error middleware
4. **Validation**: Zod schemas for all inputs
5. **Security**: Helmet, CORS, rate limiting, sanitization

---

## 🗄️ Database Schema

### Core Tables (Prisma Schema)

```prisma
// User & Authentication
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String
  role          Role
  emailVerified Boolean   @default(false)
  profile       Profile?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  enrollments   Enrollment[]
  assessments   Assessment[]
  achievements  UserAchievement[]
}

enum Role {
  LEARNER
  TRAINER
  OPERATIONS
}

// Profile
model Profile {
  id              String   @id @default(uuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name            String
  avatarUrl       String?
  currentLevel    String?
  overallProgress Int      @default(0)
  weeklyGoal      Int      @default(10)
  weeklyProgress  Int      @default(0)
  streak          Int      @default(0)
  totalPoints     Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// Learning Content
model Lesson {
  id            String   @id @default(uuid())
  title         String
  description   String
  duration      Int      # minutes
  type          String   # video, interactive, quiz
  difficulty    String   # Beginner, Intermediate, Advanced
  content       Json     # Lesson content data
  thumbnailUrl  String?
  offline       Boolean  @default(false)
  moduleId      String
  module        Module   @relation(fields: [moduleId], references: [id])
  order         Int
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  enrollments   Enrollment[]
  assessments   Assessment[]
}

model Module {
  id          String   @id @default(uuid())
  title       String
  description String
  order       Int
  lessons     Lesson[]
  pathId      String
  path        LearningPath @relation(fields: [pathId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model LearningPath {
  id          String   @id @default(uuid())
  title       String
  description String
  modules     Module[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Enrollment & Progress
model Enrollment {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  lessonId    String
  lesson      Lesson   @relation(fields: [lessonId], references: [id])
  progress    Int      @default(0)
  status      String   # not_started, in_progress, completed
  startedAt   DateTime?
  completedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([userId, lessonId])
}

// Assessments
model Assessment {
  id             String   @id @default(uuid())
  userId         String
  user           User     @relation(fields: [userId], references: [id])
  lessonId       String?
  lesson         Lesson?  @relation(fields: [lessonId], references: [id])
  cohortId       String?
  cohort         Cohort?  @relation(fields: [cohortId], references: [id])
  type           String
  content        Json
  submission     Json?
  aiScore        Int?
  trainerScore   Int?
  feedback       String?
  flagged        Boolean  @default(false)
  status         String   # pending, reviewed, completed
  submittedAt    DateTime?
  gradedAt       DateTime?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

// Cohorts
model Cohort {
  id          String   @id @default(uuid())
  name        String
  trainerId   String
  startDate   DateTime
  endDate     DateTime?
  status      String   # active, completed, archived
  assessments Assessment[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Achievements
model Achievement {
  id          String   @id @default(uuid())
  title       String
  description String
  icon        String
  points      Int
  criteria    Json     # Criteria to earn
  createdAt   DateTime @default(now())

  // Relations
  userAchievements UserAchievement[]
}

model UserAchievement {
  id            String   @id @default(uuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  achievementId String
  achievement   Achievement @relation(fields: [achievementId], references: [id])
  earnedAt      DateTime @default(now())

  @@unique([userId, achievementId])
}

// AI Insights
model AIInsight {
  id        String   @id @default(uuid())
  userId    String
  type      String   # improvement, strength, recommendation
  message   String
  priority  String   # high, medium, low
  resolved  Boolean  @default(false)
  createdAt DateTime @default(now())
}

// Risk Alerts
model RiskAlert {
  id                 String   @id @default(uuid())
  type               String
  description        String
  severity           String   # high, medium, low
  affectedLearners   Int
  recommendedAction  String
  timeframe          String
  status             String   # open, in_progress, resolved
  createdAt          DateTime @default(now())
  resolvedAt         DateTime?
}
```

### Indexes for Performance

```prisma
@@index([userId])
@@index([email])
@@index([createdAt])
@@index([status])
```

---

## 🔌 API Endpoints

### Authentication Endpoints

```
POST   /api/auth/signup             # Register new user
POST   /api/auth/login              # Login user
POST   /api/auth/logout             # Logout user
POST   /api/auth/refresh            # Refresh access token
GET    /api/auth/me                 # Get current user
POST   /api/auth/password-reset/request
POST   /api/auth/password-reset/confirm
POST   /api/auth/verify-email
POST   /api/auth/verify-email/resend
```

### Learner Endpoints

```
GET    /api/learner/:userId/profile
PATCH  /api/learner/:userId/profile
GET    /api/learner/:userId/lessons
GET    /api/learner/lessons/:lessonId
POST   /api/learner/learning-path   # Start lesson (webhook)
PATCH  /api/learner/:userId/lessons/:lessonId/progress
POST   /api/learner/:userId/lessons/:lessonId/complete
GET    /api/learner/:userId/learning-path
GET    /api/learner/:userId/progress
GET    /api/learner/:userId/achievements
GET    /api/learner/:userId/ai-insights
GET    /api/learner/:userId/recommendations
POST   /api/learner/assessments/submit
GET    /api/learner/:userId/stats/weekly
```

### Trainer Endpoints

```
GET    /api/trainer/:trainerId/cohorts
GET    /api/trainer/cohorts/:cohortId
POST   /api/trainer/cohorts
PATCH  /api/trainer/cohorts/:cohortId
GET    /api/trainer/:trainerId/assessments/pending
POST   /api/trainer/assessment      # Get assessment for review (webhook)
POST   /api/trainer/assessments/:assessmentId/grade
POST   /api/trainer/assessments/:assessmentId/flag
GET    /api/trainer/:trainerId/ai-flags
POST   /api/trainer/ai-flags/:flagId/resolve
POST   /api/trainer/intervention    # Create intervention (webhook)
POST   /api/trainer/messages/send
GET    /api/trainer/:trainerId/performance
```

### Operations Endpoints

```
GET    /api/operations/dashboard
GET    /api/operations/clients
GET    /api/operations/clients/:clientId
PATCH  /api/operations/clients/:clientId
GET    /api/operations/trainers/performance
GET    /api/operations/trainers/:trainerId
POST   /api/operations/trainers/redistribute
GET    /api/operations/quality/metrics
GET    /api/operations/quality/compliance
GET    /api/operations/risks
POST   /api/operations/risks
PATCH  /api/operations/risks/:riskId
POST   /api/operations/risks/:riskId/resolve
POST   /api/operations/analytics    # Generate report (webhook)
POST   /api/operations/optimization # Request optimization (webhook)
GET    /api/operations/system/health
```

---

## 🔐 Authentication Flow

### JWT Strategy

1. User logs in with email/password
2. Server validates credentials
3. Server generates:
   - **Access Token**: Short-lived (15-30 min), contains user ID + role
   - **Refresh Token**: Long-lived (7 days), stored in httpOnly cookie
4. Client stores access token in localStorage
5. Client sends access token in Authorization header
6. When access token expires, client uses refresh token to get new access token
7. Refresh token rotation: New refresh token issued with each refresh

### Implementation

```typescript
// Generate tokens
const accessToken = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '30m' }
);

const refreshToken = jwt.sign(
  { userId: user.id, type: 'refresh' },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: '7d' }
);
```

### Protected Routes

```typescript
// Middleware
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Role-based access
const requireRole = (role: Role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};
```

---

## 📴 Offline-First Strategy

### Service Worker

```javascript
// sw.js
const CACHE_NAME = 'ruralrise-v1';

// Install - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll([
        '/',
        '/index.html',
        '/assets/index.js',
        '/assets/index.css',
      ])
    )
  );
});

// Fetch - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone and cache response
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-assessments') {
    event.waitUntil(syncPendingActions());
  }
});
```

### IndexedDB for Offline Data

```typescript
// offlineStorage.ts
import { openDB } from 'idb';

export const initDB = async () => {
  return openDB('RuralRiseDB', 1, {
    upgrade(db) {
      db.createObjectStore('lessons', { keyPath: 'id' });
      db.createObjectStore('progress', { keyPath: 'id' });
      db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
    },
  });
};

export const saveLessonOffline = async (lesson) => {
  const db = await initDB();
  await db.put('lessons', lesson);
};

export const queueAction = async (action) => {
  const db = await initDB();
  await db.add('syncQueue', {
    ...action,
    timestamp: Date.now(),
    synced: false,
  });
};
```

### Sync Strategy

1. **Download**: User downloads lesson content to IndexedDB
2. **Offline Work**: User completes lessons, submissions queued
3. **Detect Online**: Listen to `navigator.onLine`
4. **Sync**: Process queue when online, mark as synced
5. **Conflict Resolution**: Last-write-wins or manual merge

---

## 🤖 AI Integration Points

### Where AI is Used

1. **Learning Path Personalization**
   - Endpoint: `POST /api/learner/learning-path`
   - AI determines next lesson based on:
     - Current progress
     - Learning style
     - Performance history
     - Time constraints

2. **Assessment Grading**
   - Endpoint: `POST /api/trainer/assessment`
   - AI provides:
     - Automated scoring (multiple choice, fill-in-blank)
     - Preliminary feedback on open-ended responses
     - Flagging for trainer review

3. **Learner Interventions**
   - AI flags at-risk learners based on:
     - Declining engagement
     - Low assessment scores
     - Missed deadlines
   - Recommends interventions to trainers

4. **Resource Optimization**
   - Endpoint: `POST /api/operations/optimization`
   - AI recommends:
     - Trainer-to-learner ratios
     - Cohort redistributions
     - Capacity planning

### AI Service Architecture

```
Frontend → API Gateway → AI Service (Python/FastAPI)
                              ↓
                      ML Models (scikit-learn, TensorFlow)
                              ↓
                      Training Data (PostgreSQL)
```

### Mock AI Responses (Initial)

```typescript
// Until AI service is built, return intelligent mocks
const mockAIRecommendation = (userData) => {
  // Rule-based logic
  if (userData.progress < 50) {
    return { difficulty: 'Beginner', focus: 'Fundamentals' };
  } else if (userData.assessmentScore < 70) {
    return { difficulty: 'Intermediate', focus: 'Practice' };
  } else {
    return { difficulty: 'Advanced', focus: 'Specialization' };
  }
};
```

---

## 🚀 Deployment Architecture

### Production Stack

```
┌─────────────────────────────────────────────────────┐
│                    Cloudflare CDN                   │
│              (Static Assets + DDoS Protection)      │
└────────────┬──────────────────────┬─────────────────┘
             │                      │
    ┌────────▼────────┐    ┌───────▼────────┐
    │   Frontend      │    │   Backend      │
    │   (Vercel)      │    │   (Railway)    │
    │   React + Vite  │    │   Node.js API  │
    └─────────────────┘    └───────┬────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
            ┌───────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐
            │  PostgreSQL  │ │   Redis   │ │   AWS S3    │
            │   (Supabase) │ │ (Upstash) │ │ (Files)     │
            └──────────────┘ └───────────┘ └─────────────┘
```

### Environment Variables (Production)

```bash
# Backend .env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
AWS_S3_BUCKET=...
SENDGRID_API_KEY=...
SENTRY_DSN=...
NODE_ENV=production
PORT=3001
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm test
      - run: npm run lint

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: railway up
```

---

## 🎯 Next Steps

### Immediate (This Week)

1. ✅ Set up `.env.example` (DONE)
2. ✅ Update `.gitignore` (DONE)
3. ✅ Create type definitions (DONE)
4. ✅ Create API service layer (DONE)
5. ✅ Create Auth context (DONE)
6. ✅ Create custom hooks (DONE)
7. ⏳ Decide on backend stack
8. ⏳ Set up backend project structure

### Sprint 1 (Week 1-2): Backend Foundation

1. Initialize backend project
2. Set up Prisma + PostgreSQL
3. Implement authentication (JWT)
4. Create protected API routes
5. Build basic CRUD operations
6. Test with Postman/Insomnia

### Sprint 2 (Week 3-4): Data Integration

1. Replace mock data with real API calls
2. Implement TanStack Query throughout frontend
3. Add loading/error states
4. Test all user workflows
5. Fix bugs and edge cases

### Sprint 3 (Week 5-6): Advanced Features

1. Implement offline-first (Service Worker + IndexedDB)
2. Add Recharts visualizations
3. Real-time updates (WebSockets)
4. Assessment submission flow
5. File upload (AWS S3)

### Sprint 4 (Week 7-8): Quality & Testing

1. Set up testing (Vitest + Playwright)
2. Write tests (80% coverage)
3. Enable TypeScript strict mode
4. Security audit
5. Performance optimization

### Sprint 5 (Week 9-10): Production Deployment

1. Docker setup
2. CI/CD pipeline
3. Monitoring (Sentry)
4. Load testing
5. Production deployment

---

## 📞 Support

For questions or issues:
- Create an issue in the GitHub repository
- Review this architecture document
- Consult the README.md for setup instructions

---

**Last Updated**: 2025-11-08
**Version**: 1.0.0
**Author**: RuralRise OS Team
