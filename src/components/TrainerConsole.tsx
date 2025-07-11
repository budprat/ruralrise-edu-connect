import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft, Users, AlertTriangle, CheckCircle, Clock, 
  Brain, MessageSquare, FileText, Award, TrendingUp,
  Eye, UserCheck, AlertCircle, Star, BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TrainerConsoleProps {
  onBack: () => void;
}

const TrainerConsole = ({ onBack }: TrainerConsoleProps) => {
  const { toast } = useToast();

  // Mock data for demo
  const trainerProfile = {
    name: "Dr. Sarah Chen",
    title: "Senior Training Specialist",
    currentCohorts: 3,
    totalLearners: 45,
    pendingReviews: 12,
    thisWeekCompletions: 28
  };

  const cohorts = [
    {
      id: 1,
      name: "Digital Communications Batch 2024-Q1",
      learners: 15,
      startDate: "2024-01-15",
      progress: 68,
      atRiskCount: 2,
      status: "active"
    },
    {
      id: 2,
      name: "Customer Service Excellence Q1",
      learners: 18,
      startDate: "2024-02-01",
      progress: 45,
      atRiskCount: 1,
      status: "active"
    },
    {
      id: 3,
      name: "Advanced Remote Work Skills",
      learners: 12,
      startDate: "2024-02-15",
      progress: 23,
      atRiskCount: 0,
      status: "active"
    }
  ];

  const aiFlags = [
    {
      id: 1,
      learnerName: "Maria Santos",
      cohort: "Digital Communications",
      issue: "Declining engagement patterns",
      priority: "high",
      recommendation: "Schedule 1:1 check-in session",
      lastActivity: "2 days ago"
    },
    {
      id: 2,
      learnerName: "Carlos Rodriguez",
      cohort: "Customer Service",
      issue: "Assessment scores below threshold",
      priority: "medium",
      recommendation: "Provide additional practice materials",
      lastActivity: "1 day ago"
    },
    {
      id: 3,
      learnerName: "Ana Gutierrez",
      cohort: "Digital Communications",
      issue: "Rapid progress - ready for advancement",
      priority: "low",
      recommendation: "Consider accelerated track",
      lastActivity: "3 hours ago"
    }
  ];

  const pendingAssessments = [
    {
      id: 1,
      learnerName: "Roberto Silva",
      assessmentType: "Final Project Review",
      submittedDate: "2024-03-10",
      aiScore: 85,
      flagged: false,
      cohort: "Digital Communications"
    },
    {
      id: 2,
      learnerName: "Isabella Torres",
      assessmentType: "Customer Scenario Response",
      submittedDate: "2024-03-09",
      aiScore: 72,
      flagged: true,
      cohort: "Customer Service"
    },
    {
      id: 3,
      learnerName: "Diego Morales",
      assessmentType: "Email Communication Sample",
      submittedDate: "2024-03-08",
      aiScore: 91,
      flagged: false,
      cohort: "Digital Communications"
    }
  ];

  const handleReviewAssessment = async (assessmentId: number) => {
    const assessment = pendingAssessments.find(a => a.id === assessmentId);
    
    try {
      // Simulate AI assessment analysis API call
      const response = await fetch('[INSERT_ASSESSMENT_WEBHOOK_URL]', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId: assessmentId,
          learnerName: assessment?.learnerName,
          trainerFeedbackRequested: true,
          aiScore: assessment?.aiScore,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      toast({
        title: "Assessment Analysis Ready",
        description: `AI analysis prepared for ${assessment?.learnerName}'s submission.`,
      });
    } catch (error) {
      toast({
        title: "Assessment Available",
        description: `Opening review interface for ${assessment?.learnerName}.`,
        variant: "default"
      });
    }
  };

  const handleContactLearner = async (learnerName: string, issue: string) => {
    try {
      // Simulate intervention webhook
      const response = await fetch('[INSERT_INTERVENTION_WEBHOOK_URL]', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          learnerName: learnerName,
          trainerName: trainerProfile.name,
          interventionType: 'proactive_outreach',
          issue: issue,
          timestamp: new Date().toISOString()
        })
      });

      toast({
        title: "Outreach Initiated",
        description: `Personal support message sent to ${learnerName}.`,
      });
    } catch (error) {
      toast({
        title: "Message Queued",
        description: `Support message for ${learnerName} will be sent when connection is restored.`,
      });
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
                <h1 className="text-xl font-bold text-foreground">Trainer Console</h1>
                <p className="text-sm text-muted-foreground">{trainerProfile.name} • {trainerProfile.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-progress text-progress-foreground">
                {trainerProfile.pendingReviews} Pending Reviews
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cohorts">My Cohorts</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="rural-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-progress" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{trainerProfile.totalLearners}</p>
                      <p className="text-sm text-muted-foreground">Active Learners</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rural-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{trainerProfile.thisWeekCompletions}</p>
                      <p className="text-sm text-muted-foreground">Completions This Week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rural-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{trainerProfile.pendingReviews}</p>
                      <p className="text-sm text-muted-foreground">Pending Reviews</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rural-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-learning" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{trainerProfile.currentCohorts}</p>
                      <p className="text-sm text-muted-foreground">Active Cohorts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Priority Alerts */}
            <Card className="rural-card border-l-4 border-l-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-accent" />
                  AI-Flagged Priority Actions
                </CardTitle>
                <CardDescription>
                  Learners requiring immediate attention based on AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiFlags.slice(0, 3).map((flag) => (
                    <div key={flag.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          flag.priority === 'high' ? 'bg-destructive' :
                          flag.priority === 'medium' ? 'bg-warning' : 'bg-success'
                        }`} />
                        <div>
                          <h4 className="font-medium text-foreground">{flag.learnerName}</h4>
                          <p className="text-sm text-muted-foreground">{flag.issue}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {flag.cohort} • Last activity: {flag.lastActivity}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          flag.priority === 'high' ? 'destructive' :
                          flag.priority === 'medium' ? 'secondary' : 'default'
                        }>
                          {flag.priority} priority
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleContactLearner(flag.learnerName, flag.issue)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Cohort Performance */}
            <Card className="rural-card">
              <CardHeader>
                <CardTitle>Cohort Performance Summary</CardTitle>
                <CardDescription>Current progress across your training cohorts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cohorts.map((cohort) => (
                    <div key={cohort.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{cohort.name}</h4>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-muted-foreground">{cohort.learners} learners</span>
                          {cohort.atRiskCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {cohort.atRiskCount} at risk
                            </Badge>
                          )}
                        </div>
                        <div className="mt-3">
                          <Progress value={cohort.progress} className="h-2" />
                          <p className="text-sm text-muted-foreground mt-1">{cohort.progress}% average progress</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cohorts Tab */}
          <TabsContent value="cohorts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cohorts.map((cohort) => (
                <Card key={cohort.id} className="rural-card">
                  <CardHeader>
                    <CardTitle className="text-lg">{cohort.name}</CardTitle>
                    <CardDescription>
                      Started {cohort.startDate} • {cohort.learners} learners
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Average Progress</span>
                          <span>{cohort.progress}%</span>
                        </div>
                        <Progress value={cohort.progress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <UserCheck className="h-4 w-4 text-success" />
                          <span className="text-sm text-muted-foreground">
                            {cohort.learners - cohort.atRiskCount} on track
                          </span>
                        </div>
                        {cohort.atRiskCount > 0 && (
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="h-4 w-4 text-destructive" />
                            <span className="text-sm text-destructive">
                              {cohort.atRiskCount} at risk
                            </span>
                          </div>
                        )}
                      </div>

                      <Button className="w-full" variant="outline">
                        Manage Cohort
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-6">
            <Card className="rural-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Powered Learning Analytics
                </CardTitle>
                <CardDescription>
                  Intelligent insights to optimize your training effectiveness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Learner</TableHead>
                      <TableHead>Cohort</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>AI Recommendation</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {aiFlags.map((flag) => (
                      <TableRow key={flag.id}>
                        <TableCell className="font-medium">{flag.learnerName}</TableCell>
                        <TableCell>{flag.cohort}</TableCell>
                        <TableCell>{flag.issue}</TableCell>
                        <TableCell>
                          <Badge variant={
                            flag.priority === 'high' ? 'destructive' :
                            flag.priority === 'medium' ? 'secondary' : 'default'
                          }>
                            {flag.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-sm truncate">{flag.recommendation}</p>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleContactLearner(flag.learnerName, flag.issue)}
                          >
                            Act
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assessments Tab */}
          <TabsContent value="assessments" className="space-y-6">
            <Card className="rural-card">
              <CardHeader>
                <CardTitle>Pending Assessment Reviews</CardTitle>
                <CardDescription>
                  AI-analyzed submissions requiring trainer review
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Learner</TableHead>
                      <TableHead>Assessment Type</TableHead>
                      <TableHead>Cohort</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>AI Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingAssessments.map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell className="font-medium">{assessment.learnerName}</TableCell>
                        <TableCell>{assessment.assessmentType}</TableCell>
                        <TableCell>{assessment.cohort}</TableCell>
                        <TableCell>{assessment.submittedDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{assessment.aiScore}%</span>
                            {assessment.aiScore >= 90 && <Star className="h-4 w-4 text-success" />}
                          </div>
                        </TableCell>
                        <TableCell>
                          {assessment.flagged ? (
                            <Badge variant="destructive">Flagged for Review</Badge>
                          ) : (
                            <Badge variant="default">AI Approved</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            onClick={() => handleReviewAssessment(assessment.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rural-card">
                <CardHeader>
                  <CardTitle>Training Effectiveness</CardTitle>
                  <CardDescription>Performance metrics across your cohorts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Average Completion Rate</span>
                      <span className="text-2xl font-bold text-success">89%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Quality Score</span>
                      <span className="text-2xl font-bold text-learning">4.7/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Certification Rate</span>
                      <span className="text-2xl font-bold text-progress">92%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rural-card">
                <CardHeader>
                  <CardTitle>Intervention Success</CardTitle>
                  <CardDescription>Impact of AI-recommended interventions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Early Interventions</span>
                      <span className="text-2xl font-bold text-accent">24</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Success Rate</span>
                      <span className="text-2xl font-bold text-success">83%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Time Saved</span>
                      <span className="text-2xl font-bold text-progress">15hrs</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TrainerConsole;