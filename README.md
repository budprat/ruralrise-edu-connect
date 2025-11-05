# RuralRise OS - AI-Powered Rural Workforce Training Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)

## 🌟 Overview

RuralRise OS is an innovative AI-powered platform designed to transform rural workforce development through personalized digital skills training. Built specifically to address the unique challenges of rural communities, the platform features offline-first architecture, adaptive learning paths, and comprehensive analytics for learners, trainers, and operations teams.

### Key Features

- 🤖 **AI-Powered Personalization**: Machine learning algorithms adapt curriculum to individual learning styles and progress
- 📶 **Offline-First Design**: Optimized for low-bandwidth environments with full offline capability
- 🎓 **Multi-Stakeholder Platform**: Dedicated interfaces for learners, trainers, and operations managers
- 📊 **Intelligent Analytics**: Real-time insights, predictive interventions, and automated reporting
- 🌍 **Impact Sourcing Ready**: Built for sustainable rural employment and digital inclusion
- 🔒 **Enterprise-Grade Quality**: Comprehensive assessment tools with human oversight

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd ruralrise-edu-connect
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your configuration
# See Environment Variables section below for details
```

4. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## 🏗️ Technology Stack

### Core Technologies

- **[Vite](https://vitejs.dev/)** - Next-generation frontend build tool
- **[React 18](https://reactjs.org/)** - UI framework with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[React Router](https://reactrouter.com/)** - Client-side routing

### UI & Styling

- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable component library
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide Icons](https://lucide.dev/)** - Beautiful & consistent icons

### State & Data Management

- **[TanStack Query](https://tanstack.com/query)** - Powerful data synchronization
- **[React Hook Form](https://react-hook-form.com/)** - Performant form validation
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

### Charts & Visualization

- **[Recharts](https://recharts.org/)** - Composable charting library

## 📁 Project Structure

```
ruralrise-edu-connect/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── LearnerDashboard.tsx
│   │   ├── TrainerConsole.tsx
│   │   └── OperationsAnalytics.tsx
│   ├── pages/              # Page components
│   │   ├── Index.tsx       # Landing page
│   │   └── NotFound.tsx    # 404 page
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── assets/             # Static assets (images, etc.)
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── public/                 # Public static files
├── .env.example            # Environment variables template
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies
```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# API Webhook URLs
VITE_LEARNING_PATH_WEBHOOK_URL=https://your-api.com/learning-path
VITE_ASSESSMENT_WEBHOOK_URL=https://your-api.com/assessment
VITE_INTERVENTION_WEBHOOK_URL=https://your-api.com/intervention
VITE_ANALYTICS_WEBHOOK_URL=https://your-api.com/analytics
VITE_OPTIMIZATION_WEBHOOK_URL=https://your-api.com/optimization

# Application Configuration
VITE_APP_NAME=RuralRise OS
VITE_APP_ENV=development
```

> **⚠️ Security Note**: Never commit `.env` files to version control. Use `.env.example` for documentation.

## 👥 User Roles & Features

### 🎓 Learner Interface

- Personalized learning paths with AI recommendations
- Offline-capable micro-lessons
- Progress tracking and achievements
- AI-powered insights and career guidance
- Community features and peer support

### 👨‍🏫 Trainer Console

- Cohort management dashboard
- AI-flagged learner support needs
- Assessment review and grading tools
- Intervention recommendation system
- Performance analytics and reporting

### 📊 Operations Dashboard

- Real-time KPI monitoring
- Resource allocation insights
- Quality assurance tracking
- Risk management alerts
- Automated client reporting
- Predictive analytics

## 🎨 Design System

The application uses a custom design system built on Tailwind CSS with the following color palette:

- **Primary**: Rural earth tones
- **Learning**: Blue accent for educational content
- **Progress**: Green for achievements and success
- **Success**: Emerald for completed states
- **Warning**: Amber for alerts
- **Destructive**: Red for errors and critical alerts

## 🔒 Security

- Environment-based configuration management
- No hardcoded secrets or API keys
- TypeScript for type safety
- Secure authentication hooks ready
- CORS and CSP configuration ready

See `.env.example` for required environment variables.

## 📦 Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` directory.

## 🚢 Deployment

The application can be deployed to various platforms:

- **Vercel**: Connect your repository and deploy automatically
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **AWS S3 + CloudFront**: Upload build files to S3 bucket
- **Docker**: Build and deploy as containerized application

### Example Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards

- Follow TypeScript best practices
- Use ESLint configuration provided
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌍 Impact & Mission

RuralRise OS is committed to:

- **Digital Inclusion**: Bridging the digital divide in rural communities
- **Sustainable Employment**: Creating long-term career opportunities
- **Quality Education**: Enterprise-grade training accessible to all
- **Community Empowerment**: Building local capacity and expertise
- **Environmental Consciousness**: Reducing carbon footprint through remote work

## 📞 Support

For support, questions, or feedback:

- Create an issue in the GitHub repository
- Check the documentation in `/docs`
- Review the FAQ section

## 🙏 Acknowledgments

Built with modern web technologies to serve rural communities worldwide. Special thanks to all contributors working towards digital inclusion and workforce development.

---

**Made with ❤️ for rural community empowerment**
