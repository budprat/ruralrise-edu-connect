import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, BarChart3, Wifi, WifiOff, GraduationCap, Target, TrendingUp, Globe, Heart, Zap } from "lucide-react";
import LearnerDashboard from "@/components/LearnerDashboard";
import TrainerConsole from "@/components/TrainerConsole";
import OperationsAnalytics from "@/components/OperationsAnalytics";
import ruralHeroImage from "@/assets/rural-hero-training.jpg";
import aiNetworkImage from "@/assets/ai-learning-network.jpg";
import successStoryImage from "@/assets/success-story-portrait.jpg";

type UserRole = 'learner' | 'trainer' | 'operations' | null;

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [isOnline, setIsOnline] = useState(true);

  if (selectedRole === 'learner') {
    return <LearnerDashboard onBack={() => setSelectedRole(null)} />;
  }

  if (selectedRole === 'trainer') {
    return <TrainerConsole onBack={() => setSelectedRole(null)} />;
  }

  if (selectedRole === 'operations') {
    return <OperationsAnalytics onBack={() => setSelectedRole(null)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 hero-gradient rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">RuralRise OS</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Rural Workforce Training</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={isOnline ? "default" : "secondary"} className={isOnline ? "online-badge" : "offline-badge"}>
                {isOnline ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Empowering Rural Communities Through <span className="text-accent">Digital Skills</span>
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            AI-powered personalized learning paths, offline-first design, and comprehensive workforce development for sustainable rural employment.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="text-lg py-2 px-4">
              <Heart className="h-4 w-4 mr-2" />
              Impact Sourcing Ready
            </Badge>
            <Badge variant="secondary" className="text-lg py-2 px-4">
              <Globe className="h-4 w-4 mr-2" />
              Multi-Language Support
            </Badge>
            <Badge variant="secondary" className="text-lg py-2 px-4">
              <Zap className="h-4 w-4 mr-2" />
              AI-Powered Personalization
            </Badge>
          </div>
        </div>
      </section>

      {/* Visual Impact Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={ruralHeroImage} 
            alt="Rural learners engaged in digital training" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/60"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h3 className="text-4xl font-bold mb-6">Real Impact, Real People</h3>
              <p className="text-xl mb-8 opacity-90">
                Witness the transformation as rural communities gain access to global digital opportunities through our AI-powered training platform.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <span className="text-lg">1,200+ Rural Professionals Trained</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <span className="text-lg">89% Successfully Employed</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <span className="text-lg">15+ Partner Organizations</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={successStoryImage} 
                alt="Success story of rural digital skills transformation" 
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-lg shadow-lg border border-border">
                <p className="text-sm font-medium text-foreground">"From farm work to digital excellence"</p>
                <p className="text-xs text-muted-foreground">Maria S., Digital Communications Specialist</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Transforming Rural Workforce Development</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive platform designed for rural connectivity constraints while delivering enterprise-grade training and analytics.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="rural-card border-l-4 border-l-learning">
              <CardHeader>
                <Target className="h-12 w-12 text-learning mb-4" />
                <CardTitle>Personalized Learning Paths</CardTitle>
                <CardDescription>
                  AI-driven curriculum adaptation based on individual performance, client requirements, and connectivity constraints.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Micro-lessons optimized for rural bandwidth</li>
                  <li>• Offline-first content delivery</li>
                  <li>• Cultural and linguistic adaptation</li>
                  <li>• Progress-based difficulty adjustment</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rural-card border-l-4 border-l-progress">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-progress mb-4" />
                <CardTitle>Intelligent Assessment</CardTitle>
                <CardDescription>
                  Advanced AI evaluation with human trainer oversight for maintaining quality standards and personalized feedback.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Natural language processing for evaluations</li>
                  <li>• Automated quality assurance</li>
                  <li>• Predictive intervention algorithms</li>
                  <li>• Client-specific standard compliance</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rural-card border-l-4 border-l-success">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-success mb-4" />
                <CardTitle>Comprehensive Analytics</CardTitle>
                <CardDescription>
                  Real-time insights for learners, trainers, and operations teams with predictive analytics and intervention recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Real-time performance dashboards</li>
                  <li>• Resource allocation optimization</li>
                  <li>• Risk prediction and early warnings</li>
                  <li>• Client reporting automation</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* AI Network Visualization */}
          <div className="mt-16 relative">
            <img 
              src={aiNetworkImage} 
              alt="AI-powered learning network connecting rural communities" 
              className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-transparent rounded-xl flex items-center">
              <div className="container mx-auto px-8">
                <div className="max-w-lg">
                  <h4 className="text-2xl font-bold text-white mb-4">AI-Powered Personalization</h4>
                  <p className="text-white/90 mb-6">
                    Our advanced machine learning algorithms adapt to each learner's pace, style, and goals, creating truly personalized educational experiences.
                  </p>
                  <Badge variant="secondary" className="text-lg py-2 px-4">
                    <Zap className="h-4 w-4 mr-2" />
                    Powered by Advanced AI
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Choose Your Path</h3>
            <p className="text-xl text-muted-foreground">
              Experience RuralRise OS from your perspective - each interface designed for your specific needs and responsibilities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card 
              className="rural-card cursor-pointer hover:scale-105 transition-transform duration-300 border-2 hover:border-learning"
              onClick={() => setSelectedRole('learner')}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-learning text-learning-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">New Trainee</CardTitle>
                <CardDescription className="text-lg">
                  Begin your digital skills journey with personalized learning paths and AI-powered support.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-learning rounded-full mr-3"></div>
                    Personalized skill assessments
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-learning rounded-full mr-3"></div>
                    Offline-capable micro-lessons
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-learning rounded-full mr-3"></div>
                    Progress tracking & achievements
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-learning rounded-full mr-3"></div>
                    AI-powered career guidance
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-learning hover:bg-learning/90 text-learning-foreground">
                  Start Learning Journey
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="rural-card cursor-pointer hover:scale-105 transition-transform duration-300 border-2 hover:border-progress"
              onClick={() => setSelectedRole('trainer')}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-progress text-progress-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">Trainer & Mentor</CardTitle>
                <CardDescription className="text-lg">
                  Guide and support learners with AI-enhanced insights and intervention recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-progress rounded-full mr-3"></div>
                    Cohort management dashboard
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-progress rounded-full mr-3"></div>
                    AI-flagged support needs
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-progress rounded-full mr-3"></div>
                    Assessment review tools
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-progress rounded-full mr-3"></div>
                    Certification workflows
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-progress hover:bg-progress/90 text-progress-foreground">
                  Access Trainer Console
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="rural-card cursor-pointer hover:scale-105 transition-transform duration-300 border-2 hover:border-success"
              onClick={() => setSelectedRole('operations')}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-success text-success-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">Operations Manager</CardTitle>
                <CardDescription className="text-lg">
                  Monitor performance, allocate resources, and ensure quality standards across all training programs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-success rounded-full mr-3"></div>
                    Real-time KPI monitoring
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-success rounded-full mr-3"></div>
                    Resource allocation insights
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-success rounded-full mr-3"></div>
                    Quality assurance tracking
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-success rounded-full mr-3"></div>
                    Automated client reporting
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-success hover:bg-success/90 text-success-foreground">
                  View Analytics Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">RuralRise OS</h4>
              <p className="text-primary-foreground/80">
                Empowering rural communities through AI-powered workforce development and digital skills training.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Key Features</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>• Offline-first learning platform</li>
                <li>• AI-powered personalization</li>
                <li>• Multi-language support</li>
                <li>• Enterprise-grade analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Impact</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>• Sustainable rural employment</li>
                <li>• Digital inclusion initiatives</li>
                <li>• Quality workforce development</li>
                <li>• Community empowerment</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
            <p>&copy; 2024 RuralRise OS. Transforming rural communities through digital empowerment.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;