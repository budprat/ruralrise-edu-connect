import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft, BookOpen, Play, CheckCircle, Clock, Trophy,
  Wifi, WifiOff, Download, Users, MessageCircle, Target,
  Star, Award, Brain, Lightbulb, TrendingUp, AlertCircle, RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useLearnerProfile,
  useLearnerLessons,
  useLearningPath,
  useAchievements,
  useAIInsights,
  useWeeklyStats,
  useStartLesson,
  useCompleteLesson
} from "@/hooks/useLearner";
import { useAuth } from "@/contexts/AuthContext";

interface LearnerDashboardProps {
  onBack: () => void;
}

// Loading skeleton component
const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="rural-card">
          <CardContent className="p-6">
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-4 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
    <Card className="rural-card">
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-60" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// Error display component
const ErrorDisplay = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <Card className="rural-card border-destructive">
    <CardContent className="p-6 text-center">
      <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">Something went wrong</h3>
      <p className="text-muted-foreground mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </CardContent>
  </Card>
);

const LearnerDashboard = ({ onBack }: LearnerDashboardProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();
  const { user } = useAuth();

  // API hooks
  const { data: profile, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useLearnerProfile();
  const { data: lessons, isLoading: lessonsLoading, error: lessonsError } = useLearnerLessons();
  const { data: learningPaths, isLoading: pathLoading, error: pathError } = useLearningPath();
  const { data: achievements, isLoading: achievementsLoading } = useAchievements();
  const { data: aiInsights, isLoading: insightsLoading } = useAIInsights();
  const { data: weeklyStats, isLoading: statsLoading } = useWeeklyStats();

  const startLessonMutation = useStartLesson();
  const completeLessonMutation = useCompleteLesson();

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({ title: "Back online", description: "Your connection has been restored." });
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast({ title: "You're offline", description: "Some features may be limited.", variant: "destructive" });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Handle lesson start
  const handleStartLesson = async (lessonId: string) => {
    try {
      await startLessonMutation.mutateAsync({
        lessonId,
        userId: user?.id || '',
        currentProgress: profile?.overallProgress || 0,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      // Error handled by mutation hook
    }
  };

  // Fallback data for when API isn't available
  const fallbackProfile = {
    name: user?.profile?.name || "Learner",
    currentLevel: "Digital Communications Specialist",
    overallProgress: 68,
    weeklyGoal: 15,
    weeklyProgress: 12,
    streak: 7,
    totalPoints: 1240,
  };

  const fallbackLessons = [
    { id: "1", title: "Handling Difficult Customer Situations", duration: "8 minutes", type: "Interactive Scenario", offline: true, difficulty: "Intermediate", aiRecommended: true },
    { id: "2", title: "Professional Email Templates", duration: "6 minutes", type: "Practical Exercise", offline: true, difficulty: "Beginner", aiRecommended: false },
    { id: "3", title: "Cultural Sensitivity in Communications", duration: "12 minutes", type: "Video + Quiz", offline: false, difficulty: "Advanced", aiRecommended: false },
  ];

  const fallbackPath = [
    { id: "1", title: "Digital Communication Fundamentals", progress: 100, status: "completed" as const },
    { id: "2", title: "Customer Service Excellence", progress: 85, status: "current" as const },
    { id: "3", title: "Email Management & Etiquette", progress: 45, status: "current" as const },
    { id: "4", title: "Advanced Problem Resolution", progress: 0, status: "locked" as const },
    { id: "5", title: "Leadership in Remote Teams", progress: 0, status: "locked" as const },
  ];

  const fallbackAchievements = [
    { id: "1", title: "First Week Complete", icon: "🎯", earned: true },
    { id: "2", title: "Perfect Assessment Score", icon: "⭐", earned: true },
    { id: "3", title: "Helping Hand", icon: "🤝", earned: true },
    { id: "4", title: "30-Day Streak", icon: "🔥", earned: false },
  ];

  const fallbackInsights = [
    { id: "1", message: "Your typing speed has improved 23% this week", type: "improvement" as const },
    { id: "2", message: "You excel at empathy-based customer interactions", type: "strength" as const },
    { id: "3", message: "Consider practicing email formatting techniques", type: "recommendation" as const },
  ];

  // Use API data or fallback
  const displayProfile = profile || fallbackProfile;
  const displayLessons = lessons || fallbackLessons;
  const displayPath = learningPaths?.[0]?.modules || fallbackPath;
  const displayAchievements = achievements || fallbackAchievements;
  const displayInsights = aiInsights || fallbackInsights;
  const displayStats = weeklyStats || { lessonsCompleted: 12, weeklyGoal: 15, streak: 7, totalPoints: 1240 };

  const isLoading = profileLoading && lessonsLoading && pathLoading;

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
                <h1 className="text-xl font-bold text-foreground">
                  Welcome back, {displayProfile.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {displayProfile.currentLevel || 'Digital Skills Learner'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                variant={isOnline ? "default" : "secondary"}
                className={isOnline ? "online-badge" : "offline-badge"}
              >
                {isOnline ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
                {isOnline ? 'Online' : 'Offline Mode'}
              </Badge>
              <Badge variant="outline" className="bg-success text-success-foreground">
                {displayProfile.totalPoints || 0} Points
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <DashboardSkeleton />
        ) : (
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
                        <p className="text-2xl font-bold text-foreground">
                          {displayProfile.overallProgress || 0}%
                        </p>
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
                        <p className="text-2xl font-bold text-foreground">
                          {displayStats.lessonsCompleted || displayProfile.weeklyProgress || 0}/
                          {displayStats.weeklyGoal || displayProfile.weeklyGoal || 10}
                        </p>
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
                        <p className="text-2xl font-bold text-foreground">
                          {displayStats.streak || displayProfile.streak || 0}
                        </p>
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
                        <p className="text-2xl font-bold text-foreground">
                          {displayAchievements.filter((a: any) => a.earned).length}
                        </p>
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
                  {insightsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {displayInsights.map((insight: any, index: number) => (
                        <div key={insight.id || index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                          <Lightbulb className="h-4 w-4 text-accent mt-0.5" />
                          <p className="text-sm text-foreground">{insight.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Continue Learning */}
              <Card className="rural-card">
                <CardHeader>
                  <CardTitle>Continue Your Journey</CardTitle>
                  <CardDescription>Pick up where you left off or start something new</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {lessonsLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : (
                    displayLessons.slice(0, 2).map((lesson: any) => (
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
                          disabled={startLessonMutation.isPending}
                        >
                          {startLessonMutation.isPending ? 'Starting...' : 'Start Lesson'}
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Learning Tab */}
            <TabsContent value="learning" className="space-y-6">
              <Card className="rural-card">
                <CardHeader>
                  <CardTitle>Your Learning Path</CardTitle>
                  <CardDescription>
                    AI-customized curriculum for your certification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pathLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : (
                    displayPath.map((module: any) => (
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
                    ))
                  )}
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
                    {achievementsLoading ? (
                      <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                          <Skeleton key={i} className="h-24 w-full" />
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {displayAchievements.map((achievement: any) => (
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
                    )}
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
                          <span>
                            {displayStats.lessonsCompleted || displayProfile.weeklyProgress || 0}/
                            {displayStats.weeklyGoal || displayProfile.weeklyGoal || 10}
                          </span>
                        </div>
                        <Progress
                          value={((displayStats.lessonsCompleted || displayProfile.weeklyProgress || 0) /
                                  (displayStats.weeklyGoal || displayProfile.weeklyGoal || 10)) * 100}
                          className="h-2"
                        />
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                          <div
                            key={index}
                            className={`h-8 rounded text-xs flex items-center justify-center ${
                              index < (displayStats.streak || displayProfile.streak || 0)
                                ? 'bg-success text-success-foreground'
                                : 'bg-muted text-muted-foreground'
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
        )}
      </div>
    </div>
  );
};

export default LearnerDashboard;
