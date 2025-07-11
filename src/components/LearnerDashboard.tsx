import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, BookOpen, Play, CheckCircle, Clock, Trophy, 
  Wifi, WifiOff, Download, Users, MessageCircle, Target,
  Star, Award, Brain, Lightbulb, TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LearnerDashboardProps {
  onBack: () => void;
}

const LearnerDashboard = ({ onBack }: LearnerDashboardProps) => {
  const [isOnline, setIsOnline] = useState(true);
  const [currentLesson, setCurrentLesson] = useState(null);
  const { toast } = useToast();

  // Mock data for demo
  const learnerProfile = {
    name: "Maria Santos",
    currentLevel: "Digital Communications Specialist",
    overallProgress: 68,
    weeklyGoal: 15,
    weeklyProgress: 12,
    streak: 7,
    totalPoints: 1240,
    nextCertification: "Advanced Customer Service",
    aiInsights: [
      "Your typing speed has improved 23% this week",
      "You excel at empathy-based customer interactions",
      "Consider practicing email formatting techniques"
    ]
  };

  const currentPath = [
    { id: 1, title: "Digital Communication Fundamentals", progress: 100, status: "completed" },
    { id: 2, title: "Customer Service Excellence", progress: 85, status: "current" },
    { id: 3, title: "Email Management & Etiquette", progress: 45, status: "current" },
    { id: 4, title: "Advanced Problem Resolution", progress: 0, status: "locked" },
    { id: 5, title: "Leadership in Remote Teams", progress: 0, status: "locked" }
  ];

  const availableLessons = [
    {
      id: 1,
      title: "Handling Difficult Customer Situations",
      duration: "8 minutes",
      type: "Interactive Scenario",
      offline: true,
      difficulty: "Intermediate",
      aiRecommended: true
    },
    {
      id: 2,
      title: "Professional Email Templates",
      duration: "6 minutes",
      type: "Practical Exercise",
      offline: true,
      difficulty: "Beginner"
    },
    {
      id: 3,
      title: "Cultural Sensitivity in Communications",
      duration: "12 minutes",
      type: "Video + Quiz",
      offline: false,
      difficulty: "Advanced"
    }
  ];

  const achievements = [
    { id: 1, title: "First Week Complete", icon: "🎯", earned: true },
    { id: 2, title: "Perfect Assessment Score", icon: "⭐", earned: true },
    { id: 3, title: "Helping Hand", icon: "🤝", earned: true },
    { id: 4, title: "30-Day Streak", icon: "🔥", earned: false }
  ];

  const handleStartLesson = async (lessonId: number) => {
    const lesson = availableLessons.find(l => l.id === lessonId);
    
    try {
      // Simulate AI personalization API call
      const response = await fetch('[INSERT_LEARNING_PATH_WEBHOOK_URL]', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          learnerId: 'maria_santos_001',
          lessonId: lessonId,
          currentProgress: learnerProfile.overallProgress,
          learningStyle: 'visual_kinesthetic',
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      toast({
        title: "Lesson Starting",
        description: `Loading "${lesson?.title}" with AI-optimized content...`,
      });

      setCurrentLesson(lessonId);
    } catch (error) {
      // Offline mode fallback
      toast({
        title: "Starting Offline Lesson",
        description: `"${lesson?.title}" loaded from local cache.`,
        variant: "default"
      });
      setCurrentLesson(lessonId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Platform
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">Welcome back, {learnerProfile.name}</h1>
                <p className="text-sm text-muted-foreground">{learnerProfile.currentLevel}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={isOnline ? "default" : "secondary"} className={isOnline ? "online-badge" : "offline-badge"}>
                {isOnline ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
                {isOnline ? 'Online' : 'Offline Mode'}
              </Badge>
              <Badge variant="outline" className="bg-success text-success-foreground">
                {learnerProfile.totalPoints} Points
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="learning">My Learning</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="rural-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-learning" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{learnerProfile.overallProgress}%</p>
                      <p className="text-sm text-muted-foreground">Overall Progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rural-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-progress" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{learnerProfile.weeklyProgress}/{learnerProfile.weeklyGoal}</p>
                      <p className="text-sm text-muted-foreground">Weekly Goal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rural-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-success" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{learnerProfile.streak}</p>
                      <p className="text-sm text-muted-foreground">Day Streak</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rural-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{achievements.filter(a => a.earned).length}</p>
                      <p className="text-sm text-muted-foreground">Achievements</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
            <Card className="rural-card border-l-4 border-l-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-accent" />
                  AI-Powered Insights
                </CardTitle>
                <CardDescription>
                  Personalized recommendations based on your learning patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {learnerProfile.aiInsights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                      <Lightbulb className="h-4 w-4 text-accent mt-0.5" />
                      <p className="text-sm text-foreground">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Continue Learning */}
            <Card className="rural-card">
              <CardHeader>
                <CardTitle>Continue Your Journey</CardTitle>
                <CardDescription>Pick up where you left off or start something new</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {availableLessons.slice(0, 2).map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-learning text-learning-foreground rounded-lg flex items-center justify-center">
                        <Play className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{lesson.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{lesson.duration}</span>
                          <span>•</span>
                          <span>{lesson.type}</span>
                          {lesson.offline && (
                            <>
                              <span>•</span>
                              <Download className="h-3 w-3" />
                              <span>Offline Ready</span>
                            </>
                          )}
                          {lesson.aiRecommended && (
                            <Badge variant="secondary" className="text-xs">
                              <Brain className="h-3 w-3 mr-1" />
                              AI Recommended
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleStartLesson(lesson.id)}
                      className="bg-learning hover:bg-learning/90 text-learning-foreground"
                    >
                      Start Lesson
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learning Tab */}
          <TabsContent value="learning" className="space-y-6">
            <Card className="rural-card">
              <CardHeader>
                <CardTitle>Your Learning Path</CardTitle>
                <CardDescription>
                  AI-customized curriculum for {learnerProfile.nextCertification} certification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentPath.map((module) => (
                  <div key={module.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      module.status === 'completed' ? 'bg-success text-success-foreground' :
                      module.status === 'current' ? 'bg-learning text-learning-foreground' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {module.status === 'completed' ? <CheckCircle className="h-5 w-5" /> :
                       module.status === 'current' ? <Play className="h-5 w-5" /> :
                       <Clock className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{module.title}</h4>
                      <div className="mt-2">
                        <Progress value={module.progress} className="h-2" />
                        <p className="text-sm text-muted-foreground mt-1">{module.progress}% complete</p>
                      </div>
                    </div>
                    <Badge variant={
                      module.status === 'completed' ? 'default' :
                      module.status === 'current' ? 'secondary' : 'outline'
                    }>
                      {module.status === 'completed' ? 'Completed' :
                       module.status === 'current' ? 'In Progress' : 'Locked'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rural-card">
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Your learning milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                      <div 
                        key={achievement.id}
                        className={`p-4 border border-border rounded-lg text-center transition-all ${
                          achievement.earned ? 'bg-success/10 border-success' : 'bg-muted/50'
                        }`}
                      >
                        <div className="text-2xl mb-2">{achievement.icon}</div>
                        <p className={`text-sm font-medium ${
                          achievement.earned ? 'text-success' : 'text-muted-foreground'
                        }`}>
                          {achievement.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="rural-card">
                <CardHeader>
                  <CardTitle>Weekly Progress</CardTitle>
                  <CardDescription>Your activity this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Lessons Completed</span>
                        <span>{learnerProfile.weeklyProgress}/{learnerProfile.weeklyGoal}</span>
                      </div>
                      <Progress value={(learnerProfile.weeklyProgress / learnerProfile.weeklyGoal) * 100} className="h-2" />
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                        <div 
                          key={index}
                          className={`h-8 rounded text-xs flex items-center justify-center ${
                            index < learnerProfile.streak ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <Card className="rural-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Learning Community
                </CardTitle>
                <CardDescription>
                  Connect with fellow learners and share your journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Join study groups, share achievements, and support each other in your learning journey.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LearnerDashboard;