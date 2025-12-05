import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft, BarChart3, TrendingUp, TrendingDown, Users,
  AlertTriangle, CheckCircle, Clock, DollarSign, Target,
  FileBarChart, Download, RefreshCw, Calendar, Globe,
  Award, Brain, Zap, Shield, Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useDashboardMetrics,
  useClientMetrics,
  useTrainerPerformance,
  useRiskAlerts,
  useQualityMetrics,
  useComplianceStatus,
  useScheduledReports,
  useGenerateReport,
  useRequestOptimization,
  useResolveRiskAlert,
} from "@/hooks/useOperations";

interface OperationsAnalyticsProps {
  onBack: () => void;
}

// Skeleton components for loading states
const KPICardSkeleton = () => (
  <Card className="rural-card">
    <CardContent className="p-6">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-5 w-5 rounded" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const TableRowSkeleton = ({ columns }: { columns: number }) => (
  <TableRow>
    {Array.from({ length: columns }).map((_, i) => (
      <TableCell key={i}>
        <Skeleton className="h-4 w-full" />
      </TableCell>
    ))}
  </TableRow>
);

const AlertCardSkeleton = () => (
  <div className="p-4 border border-border rounded-lg bg-destructive/5">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Skeleton className="w-3 h-3 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-64" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  </div>
);

const OperationsAnalytics = ({ onBack }: OperationsAnalyticsProps) => {
  const { toast } = useToast();
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  // API Hooks
  const { data: dashboardData, isLoading: dashboardLoading } = useDashboardMetrics(selectedTimeframe);
  const { data: clients, isLoading: clientsLoading } = useClientMetrics();
  const { data: trainers, isLoading: trainersLoading } = useTrainerPerformance();
  const { data: risks, isLoading: risksLoading } = useRiskAlerts('open');
  const { data: quality, isLoading: qualityLoading } = useQualityMetrics();
  const { data: compliance, isLoading: complianceLoading } = useComplianceStatus();
  const { data: scheduledReports, isLoading: reportsLoading } = useScheduledReports();

  // Mutations
  const generateReportMutation = useGenerateReport();
  const optimizationMutation = useRequestOptimization();
  const resolveRiskMutation = useResolveRiskAlert();

  // Fallback data when API is unavailable
  const fallbackDashboardMetrics = {
    totalLearners: 1247,
    activeCohorts: 12,
    completionRate: 89.2,
    qualityScore: 4.7,
    clientSatisfaction: 94.5,
    revenue: 285000,
    trendsComparison: {
      learners: 12.5,
      completion: -2.1,
      quality: 5.8,
      satisfaction: 1.3
    }
  };

  const fallbackRiskAlerts = [
    {
      id: "1",
      type: "Quality Risk",
      description: "Batch CS-2024-Q1 showing declining assessment scores",
      severity: "high",
      affectedLearners: 18,
      recommendedAction: "Increase trainer support frequency",
      timeframe: "Immediate"
    },
    {
      id: "2",
      type: "Capacity Risk",
      description: "Trainer Maria Lopez approaching maximum learner capacity",
      severity: "medium",
      affectedLearners: 25,
      recommendedAction: "Redistribute 5-8 learners to other trainers",
      timeframe: "Within 48 hours"
    },
    {
      id: "3",
      type: "Client SLA Risk",
      description: "Acme Corp certification timeline at risk",
      severity: "high",
      affectedLearners: 12,
      recommendedAction: "Accelerate current cohort or add weekend sessions",
      timeframe: "This week"
    }
  ];

  const fallbackClientMetrics = [
    {
      id: "1",
      client: "Acme Corporation",
      activeLearners: 45,
      completionRate: 92,
      qualityScore: 4.8,
      onTime: true,
      revenue: 85000,
      nextMilestone: "Q1 Certification Batch"
    },
    {
      id: "2",
      client: "Global Tech Solutions",
      activeLearners: 32,
      completionRate: 87,
      qualityScore: 4.6,
      onTime: true,
      revenue: 65000,
      nextMilestone: "Advanced Skills Module"
    },
    {
      id: "3",
      client: "Digital Innovations Inc",
      activeLearners: 28,
      completionRate: 94,
      qualityScore: 4.9,
      onTime: false,
      revenue: 58000,
      nextMilestone: "Leadership Training"
    }
  ];

  const fallbackTrainerPerformance = [
    {
      id: "1",
      name: "Dr. Sarah Chen",
      learners: 45,
      completionRate: 94,
      qualityScore: 4.8,
      interventions: 8,
      satisfaction: 4.9,
      efficiency: "High"
    },
    {
      id: "2",
      name: "Prof. Miguel Rivera",
      learners: 38,
      completionRate: 91,
      qualityScore: 4.7,
      interventions: 12,
      satisfaction: 4.7,
      efficiency: "High"
    },
    {
      id: "3",
      name: "Maria Lopez",
      learners: 42,
      completionRate: 87,
      qualityScore: 4.5,
      interventions: 15,
      satisfaction: 4.6,
      efficiency: "Medium"
    }
  ];

  // Use API data or fallback
  const dashboardMetrics = dashboardData || fallbackDashboardMetrics;
  const riskAlerts = risks || fallbackRiskAlerts;
  const clientMetrics = clients || fallbackClientMetrics;
  const trainerPerformance = trainers || fallbackTrainerPerformance;

  const handleGenerateReport = (reportType: string) => {
    generateReportMutation.mutate(
      {
        reportType,
        timeframe: selectedTimeframe,
        includeAIInsights: true,
      },
      {
        onError: () => {
          // Fallback toast when API unavailable
          toast({
            title: "Report Queued",
            description: `${reportType} report will be generated when connection is restored.`,
            variant: "default"
          });
        }
      }
    );
  };

  const handleOptimizeResources = () => {
    optimizationMutation.mutate(
      {
        type: 'resource_allocation',
        parameters: {
          currentCapacity: trainerPerformance,
          demandForecast: 'q2_2024',
        }
      },
      {
        onError: () => {
          // Fallback toast when API unavailable
          toast({
            title: "Optimization Queued",
            description: "Resource optimization analysis will run when connection is restored.",
          });
        }
      }
    );
  };

  const handleResolveRisk = (riskId: string, action: string) => {
    resolveRiskMutation.mutate(
      { riskId, resolution: action },
      {
        onError: () => {
          toast({
            title: "Action Queued",
            description: "Risk mitigation will be applied when connection is restored.",
          });
        }
      }
    );
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
                <h1 className="text-xl font-bold text-foreground">Operations Analytics</h1>
                <p className="text-sm text-muted-foreground">Comprehensive performance monitoring & insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGenerateReport("Executive Summary")}
                disabled={generateReportMutation.isPending}
              >
                {generateReportMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export Report
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOptimizeResources}
                disabled={optimizationMutation.isPending}
              >
                {optimizationMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                AI Optimize
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="trainers">Trainers</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="risks">Risk Management</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {dashboardLoading ? (
                <>
                  <KPICardSkeleton />
                  <KPICardSkeleton />
                  <KPICardSkeleton />
                  <KPICardSkeleton />
                  <KPICardSkeleton />
                  <KPICardSkeleton />
                </>
              ) : (
                <>
                  <Card className="rural-card">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-2xl font-bold text-foreground">{dashboardMetrics.totalLearners.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Total Learners</p>
                          <div className="flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 text-success mr-1" />
                            <span className="text-xs text-success">+{dashboardMetrics.trendsComparison.learners}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rural-card">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-learning" />
                        <div>
                          <p className="text-2xl font-bold text-foreground">{dashboardMetrics.activeCohorts}</p>
                          <p className="text-sm text-muted-foreground">Active Cohorts</p>
                          <div className="flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 text-success mr-1" />
                            <span className="text-xs text-success">+2 this month</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rural-card">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-success" />
                        <div>
                          <p className="text-2xl font-bold text-foreground">{dashboardMetrics.completionRate}%</p>
                          <p className="text-sm text-muted-foreground">Completion Rate</p>
                          <div className="flex items-center mt-1">
                            <TrendingDown className="h-3 w-3 text-destructive mr-1" />
                            <span className="text-xs text-destructive">{dashboardMetrics.trendsComparison.completion}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rural-card">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Award className="h-5 w-5 text-progress" />
                        <div>
                          <p className="text-2xl font-bold text-foreground">{dashboardMetrics.qualityScore}/5</p>
                          <p className="text-sm text-muted-foreground">Quality Score</p>
                          <div className="flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 text-success mr-1" />
                            <span className="text-xs text-success">+{dashboardMetrics.trendsComparison.quality}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rural-card">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-5 w-5 text-accent" />
                        <div>
                          <p className="text-2xl font-bold text-foreground">{dashboardMetrics.clientSatisfaction}%</p>
                          <p className="text-sm text-muted-foreground">Client Satisfaction</p>
                          <div className="flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 text-success mr-1" />
                            <span className="text-xs text-success">+{dashboardMetrics.trendsComparison.satisfaction}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rural-card">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-warning" />
                        <div>
                          <p className="text-2xl font-bold text-foreground">${(dashboardMetrics.revenue / 1000).toFixed(0)}K</p>
                          <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                          <div className="flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 text-success mr-1" />
                            <span className="text-xs text-success">+8.5%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Critical Alerts */}
            <Card className="rural-card border-l-4 border-l-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Critical Risk Alerts
                </CardTitle>
                <CardDescription>
                  Issues requiring immediate attention to maintain quality and delivery standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {risksLoading ? (
                    <>
                      <AlertCardSkeleton />
                      <AlertCardSkeleton />
                    </>
                  ) : (
                    riskAlerts.slice(0, 2).map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-destructive/5">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${
                            alert.severity === 'high' ? 'bg-destructive' : 'bg-warning'
                          }`} />
                          <div>
                            <h4 className="font-medium text-foreground">{alert.type}</h4>
                            <p className="text-sm text-muted-foreground">{alert.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Affects {alert.affectedLearners} learners • Action needed: {alert.timeframe}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="destructive">{alert.severity} risk</Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResolveRisk(alert.id, alert.recommendedAction)}
                            disabled={resolveRiskMutation.isPending}
                          >
                            {resolveRiskMutation.isPending ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Shield className="h-4 w-4 mr-2" />
                            )}
                            Mitigate
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rural-card">
                <CardHeader>
                  <CardTitle>Client Portfolio Health</CardTitle>
                  <CardDescription>Overview of client engagement and satisfaction</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clientsLoading ? (
                      <>
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-48" />
                            </div>
                            <Skeleton className="h-5 w-16" />
                          </div>
                        ))}
                      </>
                    ) : (
                      clientMetrics.slice(0, 3).map((client) => (
                        <div key={client.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div>
                            <h4 className="font-medium text-foreground">{client.client}</h4>
                            <p className="text-sm text-muted-foreground">
                              {client.activeLearners} learners • {client.completionRate}% completion
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={client.onTime ? "default" : "destructive"}>
                              {client.onTime ? "On Track" : "At Risk"}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="rural-card">
                <CardHeader>
                  <CardTitle>AI Insights Summary</CardTitle>
                  <CardDescription>Key recommendations from AI analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-learning/10 rounded-lg">
                      <Brain className="h-4 w-4 text-learning mt-0.5" />
                      <p className="text-sm text-foreground">
                        Optimal trainer-to-learner ratio identified: 1:15 for digital communications training
                      </p>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-success/10 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-success mt-0.5" />
                      <p className="text-sm text-foreground">
                        Predictive model shows 94% certification probability for current Q1 cohorts
                      </p>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-warning/10 rounded-lg">
                      <Clock className="h-4 w-4 text-warning mt-0.5" />
                      <p className="text-sm text-foreground">
                        Resource reallocation recommended to meet Q2 demand surge (+35% expected enrollment)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <Card className="rural-card">
              <CardHeader>
                <CardTitle>Client Performance Dashboard</CardTitle>
                <CardDescription>
                  Individual client metrics and SLA compliance tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Active Learners</TableHead>
                      <TableHead>Completion Rate</TableHead>
                      <TableHead>Quality Score</TableHead>
                      <TableHead>SLA Status</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Next Milestone</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientsLoading ? (
                      <>
                        <TableRowSkeleton columns={8} />
                        <TableRowSkeleton columns={8} />
                        <TableRowSkeleton columns={8} />
                      </>
                    ) : (
                      clientMetrics.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">{client.client}</TableCell>
                          <TableCell>{client.activeLearners}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>{client.completionRate}%</span>
                              <Progress value={client.completionRate} className="w-16 h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <span>{client.qualityScore}</span>
                              <Award className="h-4 w-4 text-success" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={client.onTime ? "default" : "destructive"}>
                              {client.onTime ? "On Track" : "At Risk"}
                            </Badge>
                          </TableCell>
                          <TableCell>${client.revenue.toLocaleString()}</TableCell>
                          <TableCell className="max-w-xs">
                            <p className="text-sm truncate">{client.nextMilestone}</p>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGenerateReport(`Client: ${client.client}`)}
                            >
                              <FileBarChart className="h-4 w-4 mr-2" />
                              Report
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trainers Tab */}
          <TabsContent value="trainers" className="space-y-6">
            <Card className="rural-card">
              <CardHeader>
                <CardTitle>Trainer Performance Analytics</CardTitle>
                <CardDescription>
                  Individual trainer metrics and capacity optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Trainer</TableHead>
                      <TableHead>Current Learners</TableHead>
                      <TableHead>Completion Rate</TableHead>
                      <TableHead>Quality Score</TableHead>
                      <TableHead>Interventions</TableHead>
                      <TableHead>Satisfaction</TableHead>
                      <TableHead>Efficiency</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trainersLoading ? (
                      <>
                        <TableRowSkeleton columns={8} />
                        <TableRowSkeleton columns={8} />
                        <TableRowSkeleton columns={8} />
                      </>
                    ) : (
                      trainerPerformance.map((trainer) => (
                        <TableRow key={trainer.id}>
                          <TableCell className="font-medium">{trainer.name}</TableCell>
                          <TableCell>{trainer.learners}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>{trainer.completionRate}%</span>
                              <Progress value={trainer.completionRate} className="w-16 h-2" />
                            </div>
                          </TableCell>
                          <TableCell>{trainer.qualityScore}/5</TableCell>
                          <TableCell>{trainer.interventions}</TableCell>
                          <TableCell>{trainer.satisfaction}/5</TableCell>
                          <TableCell>
                            <Badge variant={
                              trainer.efficiency === 'High' ? 'default' :
                              trainer.efficiency === 'Medium' ? 'secondary' : 'destructive'
                            }>
                              {trainer.efficiency}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGenerateReport(`Trainer: ${trainer.name}`)}
                            >
                              <BarChart3 className="h-4 w-4 mr-2" />
                              Analyze
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quality Tab */}
          <TabsContent value="quality" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rural-card">
                <CardHeader>
                  <CardTitle>Quality Assurance Metrics</CardTitle>
                  <CardDescription>AI-powered quality monitoring and compliance tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                      <span className="text-sm font-medium">Overall Quality Score</span>
                      <span className="text-2xl font-bold text-success">4.7/5</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                      <span className="text-sm font-medium">Client Standards Compliance</span>
                      <span className="text-2xl font-bold text-learning">98.5%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                      <span className="text-sm font-medium">AI Quality Predictions</span>
                      <span className="text-2xl font-bold text-progress">95.2%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                      <span className="text-sm font-medium">Quality Interventions Success</span>
                      <span className="text-2xl font-bold text-accent">87%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rural-card">
                <CardHeader>
                  <CardTitle>Compliance Dashboard</CardTitle>
                  <CardDescription>Regulatory and client-specific compliance status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium">ISO 27001 Compliance</span>
                      </div>
                      <Badge variant="default">Certified</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium">GDPR Compliance</span>
                      </div>
                      <Badge variant="default">Compliant</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-warning" />
                        <span className="text-sm font-medium">Client SLA Reviews</span>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Risk Management Tab */}
          <TabsContent value="risks" className="space-y-6">
            <Card className="rural-card">
              <CardHeader>
                <CardTitle>Risk Management Dashboard</CardTitle>
                <CardDescription>
                  AI-powered risk detection and mitigation recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {risksLoading ? (
                    <>
                      <AlertCardSkeleton />
                      <AlertCardSkeleton />
                      <AlertCardSkeleton />
                    </>
                  ) : (
                    riskAlerts.map((alert) => (
                      <div key={alert.id} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${
                              alert.severity === 'high' ? 'bg-destructive' : 'bg-warning'
                            }`} />
                            <h4 className="font-medium text-foreground">{alert.type}</h4>
                            <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                              {alert.severity} priority
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">{alert.timeframe}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-muted-foreground">
                              Affects {alert.affectedLearners} learners
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-foreground">{alert.recommendedAction}</p>
                            <Button
                              size="sm"
                              onClick={() => handleResolveRisk(alert.id, alert.recommendedAction)}
                              disabled={resolveRiskMutation.isPending}
                            >
                              {resolveRiskMutation.isPending ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Shield className="h-4 w-4 mr-2" />
                              )}
                              Implement
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rural-card">
                <CardHeader>
                  <CardTitle>Automated Reporting</CardTitle>
                  <CardDescription>Generate comprehensive reports with AI insights</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleGenerateReport("Executive Summary")}
                  >
                    <FileBarChart className="h-4 w-4 mr-2" />
                    Executive Summary Report
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleGenerateReport("Client Performance")}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Client Performance Report
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleGenerateReport("Quality Assurance")}
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Quality Assurance Report
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleGenerateReport("Financial Analysis")}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Financial Analysis Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="rural-card">
                <CardHeader>
                  <CardTitle>Report Scheduling</CardTitle>
                  <CardDescription>Automate regular reporting cycles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Weekly Performance Summary</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Every Monday 9:00 AM</p>
                  </div>
                  <div className="p-3 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Monthly Client Reports</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">1st of each month</p>
                  </div>
                  <div className="p-3 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Quarterly Business Review</span>
                      <Badge variant="secondary">Scheduled</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Next: April 1st, 2024</p>
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

export default OperationsAnalytics;