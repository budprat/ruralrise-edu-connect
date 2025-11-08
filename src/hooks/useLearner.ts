// ================================================================
// Learner Hooks - TanStack Query Integration
// ================================================================
// Custom hooks for learner-related data fetching and mutations
// ================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { learnerService } from '@/services';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type {
  UserProfile,
  Lesson,
  LearningModule,
  Achievement,
  AIInsight,
  LessonStartRequest,
  AssessmentSubmission
} from '@/types';

// ----------------------------------------------------------------
// Query Keys
// ----------------------------------------------------------------

export const learnerKeys = {
  all: ['learner'] as const,
  profile: (userId: string) => [...learnerKeys.all, 'profile', userId] as const,
  lessons: (userId: string) => [...learnerKeys.all, 'lessons', userId] as const,
  lesson: (lessonId: string) => [...learnerKeys.all, 'lesson', lessonId] as const,
  learningPath: (userId: string) => [...learnerKeys.all, 'learning-path', userId] as const,
  progress: (userId: string) => [...learnerKeys.all, 'progress', userId] as const,
  achievements: (userId: string) => [...learnerKeys.all, 'achievements', userId] as const,
  aiInsights: (userId: string) => [...learnerKeys.all, 'ai-insights', userId] as const,
  recommended: (userId: string) => [...learnerKeys.all, 'recommended', userId] as const,
  weeklyStats: (userId: string) => [...learnerKeys.all, 'weekly-stats', userId] as const,
};

// ----------------------------------------------------------------
// Profile Hooks
// ----------------------------------------------------------------

export const useLearnerProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: learnerKeys.profile(user?.id || ''),
    queryFn: () => learnerService.getProfile(user!.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (updates: Partial<UserProfile>) =>
      learnerService.updateProfile(user!.id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: learnerKeys.profile(user!.id) });
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    },
  });
};

// ----------------------------------------------------------------
// Lessons Hooks
// ----------------------------------------------------------------

export const useLearnerLessons = (filters?: {
  difficulty?: string;
  type?: string;
  offline?: boolean;
}) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: [...learnerKeys.lessons(user?.id || ''), filters],
    queryFn: () => learnerService.getLessons(user!.id, filters),
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useLesson = (lessonId: string) => {
  return useQuery({
    queryKey: learnerKeys.lesson(lessonId),
    queryFn: () => learnerService.getLesson(lessonId),
    enabled: !!lessonId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useStartLesson = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (request: LessonStartRequest) =>
      learnerService.startLesson(request),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: learnerKeys.progress(user!.id) });
      toast({
        title: 'Lesson started',
        description: 'Your personalized lesson content is ready!',
      });
    },
    onError: (error: any) => {
      // Check if offline mode is enabled
      if (import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true') {
        toast({
          title: 'Starting offline lesson',
          description: 'Lesson loaded from local cache.',
        });
      } else {
        toast({
          title: 'Failed to start lesson',
          description: error.message || 'Please try again',
          variant: 'destructive',
        });
      }
    },
  });
};

export const useCompleteLesson = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (lessonId: string) =>
      learnerService.completeLesson(user!.id, lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: learnerKeys.progress(user!.id) });
      queryClient.invalidateQueries({ queryKey: learnerKeys.learningPath(user!.id) });
      queryClient.invalidateQueries({ queryKey: learnerKeys.achievements(user!.id) });
      toast({
        title: 'Lesson completed! 🎉',
        description: 'Great job! Your progress has been updated.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to complete lesson',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// ----------------------------------------------------------------
// Learning Path Hooks
// ----------------------------------------------------------------

export const useLearningPath = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: learnerKeys.learningPath(user?.id || ''),
    queryFn: () => learnerService.getLearningPath(user!.id),
    enabled: !!user,
    staleTime: 10 * 60 * 1000,
  });
};

export const useLearningPathProgress = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: learnerKeys.progress(user?.id || ''),
    queryFn: () => learnerService.getLearningPathProgress(user!.id),
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes - more frequent updates
  });
};

// ----------------------------------------------------------------
// Achievements Hooks
// ----------------------------------------------------------------

export const useAchievements = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: learnerKeys.achievements(user?.id || ''),
    queryFn: () => learnerService.getAchievements(user!.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
};

// ----------------------------------------------------------------
// AI Insights Hooks
// ----------------------------------------------------------------

export const useAIInsights = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: learnerKeys.aiInsights(user?.id || ''),
    queryFn: () => learnerService.getAIInsights(user!.id),
    enabled: !!user && import.meta.env.VITE_ENABLE_AI_INSIGHTS === 'true',
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useRecommendedLessons = (limit = 5) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: [...learnerKeys.recommended(user?.id || ''), limit],
    queryFn: () => learnerService.getRecommendedLessons(user!.id, limit),
    enabled: !!user && import.meta.env.VITE_ENABLE_AI_INSIGHTS === 'true',
    staleTime: 10 * 60 * 1000,
  });
};

// ----------------------------------------------------------------
// Assessment Hooks
// ----------------------------------------------------------------

export const useSubmitAssessment = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (submission: AssessmentSubmission) =>
      learnerService.submitAssessment(submission),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: learnerKeys.progress(user!.id) });
      toast({
        title: 'Assessment submitted',
        description: `Your score: ${data.score}%`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Submission failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// ----------------------------------------------------------------
// Statistics Hooks
// ----------------------------------------------------------------

export const useWeeklyStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: learnerKeys.weeklyStats(user?.id || ''),
    queryFn: () => learnerService.getWeeklyStats(user!.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

export const useProgressHistory = (timeframe: 'week' | 'month' | 'year' = 'month') => {
  const { user } = useAuth();

  return useQuery({
    queryKey: [...learnerKeys.all, 'progress-history', user?.id, timeframe],
    queryFn: () => learnerService.getProgressHistory(user!.id, timeframe),
    enabled: !!user,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};
