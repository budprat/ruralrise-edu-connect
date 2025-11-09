// ================================================================
// RuralRise OS - TypeScript Type Definitions
// ================================================================

// ----------------------------------------------------------------
// User & Authentication Types
// ----------------------------------------------------------------

export enum UserRole {
  LEARNER = 'LEARNER',
  TRAINER = 'TRAINER',
  OPERATIONS = 'OPERATIONS',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  profile: UserProfile;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  currentLevel?: string;
  overallProgress: number;
  weeklyGoal: number;
  weeklyProgress: number;
  streak: number;
  totalPoints: number;
  nextCertification?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

// ----------------------------------------------------------------
// Learner Types
// ----------------------------------------------------------------

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  offline: boolean;
  aiRecommended?: boolean;
  description?: string;
  contentUrl?: string;
  thumbnailUrl?: string;
  moduleId?: string;
}

export interface LearningModule {
  id: string;
  title: string;
  progress: number;
  status: 'completed' | 'current' | 'locked';
  lessons: Lesson[];
  order: number;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  description?: string;
  points?: number;
}

export interface AIInsight {
  id: string;
  type: 'improvement' | 'strength' | 'recommendation';
  message: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface LearningPathProgress {
  moduleId: string;
  moduleName: string;
  progress: number;
  status: 'completed' | 'current' | 'locked';
  startedAt?: string;
  completedAt?: string;
}

// ----------------------------------------------------------------
// Trainer Types
// ----------------------------------------------------------------

export interface Cohort {
  id: string;
  name: string;
  trainerId: string;
  startDate: string;
  endDate?: string;
  learners: number;
  progress: number;
  atRiskCount: number;
  status: 'active' | 'completed' | 'archived';
}

export interface Assessment {
  id: string;
  learnerId: string;
  learnerName: string;
  assessmentType: string;
  lessonId?: string;
  cohortId: string;
  cohort: string;
  submittedDate: string;
  aiScore?: number;
  trainerScore?: number;
  flagged: boolean;
  status: 'pending' | 'reviewed' | 'completed';
  feedback?: string;
  rubric?: AssessmentRubric;
}

export interface AssessmentRubric {
  criteria: RubricCriterion[];
  totalPoints: number;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  earnedPoints?: number;
}

export interface AIFlag {
  id: string;
  learnerId: string;
  learnerName: string;
  cohortId: string;
  cohort: string;
  issue: string;
  priority: 'high' | 'medium' | 'low';
  recommendation: string;
  lastActivity: string;
  resolved: boolean;
  resolvedAt?: string;
}

export interface InterventionRequest {
  learnerId: string;
  learnerName: string;
  trainerId: string;
  trainerName: string;
  interventionType: 'proactive_outreach' | 'performance_review' | 'technical_support';
  issue: string;
  notes?: string;
}

// ----------------------------------------------------------------
// Operations Types
// ----------------------------------------------------------------

export interface DashboardMetrics {
  totalLearners: number;
  activeCohorts: number;
  completionRate: number;
  qualityScore: number;
  clientSatisfaction: number;
  revenue: number;
  trendsComparison: {
    learners: number;
    completion: number;
    quality: number;
    satisfaction: number;
  };
}

export interface ClientMetrics {
  id: string;
  client: string;
  activeLearners: number;
  completionRate: number;
  qualityScore: number;
  onTime: boolean;
  revenue: number;
  nextMilestone: string;
  contactEmail?: string;
  startDate: string;
}

export interface TrainerPerformance {
  id: string;
  trainerId: string;
  name: string;
  learners: number;
  completionRate: number;
  qualityScore: number;
  interventions: number;
  satisfaction: number;
  efficiency: 'High' | 'Medium' | 'Low';
}

export interface RiskAlert {
  id: string;
  type: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  affectedLearners: number;
  recommendedAction: string;
  timeframe: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
}

export interface ReportRequest {
  reportType: 'Executive Summary' | 'Client Performance' | 'Quality Assurance' | 'Financial Analysis';
  timeframe: string;
  requestedBy: string;
  includeAIInsights: boolean;
  format?: 'pdf' | 'excel' | 'csv';
}

export interface OptimizationRequest {
  optimizationType: 'resource_allocation' | 'capacity_planning' | 'cost_optimization';
  currentCapacity: TrainerPerformance[];
  demandForecast: string;
  constraints?: Record<string, any>;
}

// ----------------------------------------------------------------
// API Response Types
// ----------------------------------------------------------------

export interface APIResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface APIError {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
  path?: string;
}

// ----------------------------------------------------------------
// Offline Sync Types
// ----------------------------------------------------------------

export interface SyncAction {
  id?: number;
  type: 'lesson_progress' | 'assessment_submission' | 'profile_update';
  payload: Record<string, any>;
  timestamp: number;
  synced: boolean;
  retryCount: number;
}

export interface OfflineLesson {
  id: string;
  lesson: Lesson;
  content: string;
  downloadedAt: string;
  expiresAt?: string;
}

// ----------------------------------------------------------------
// WebSocket/Real-time Types
// ----------------------------------------------------------------

export interface WebSocketMessage {
  type: 'notification' | 'update' | 'alert';
  payload: any;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

// ----------------------------------------------------------------
// Form Types
// ----------------------------------------------------------------

export interface LessonStartRequest {
  lessonId: string;
  userId: string;
  currentProgress: number;
  learningStyle?: string;
  timestamp: string;
}

export interface AssessmentSubmission {
  assessmentId: string;
  learnerId: string;
  answers: AssessmentAnswer[];
  timeSpent: number;
  submittedAt: string;
}

export interface AssessmentAnswer {
  questionId: string;
  answer: string | string[] | number;
  confidence?: number;
}

// ----------------------------------------------------------------
// Utility Types
// ----------------------------------------------------------------

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export interface FilterConfig {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'contains';
  value: any;
}
