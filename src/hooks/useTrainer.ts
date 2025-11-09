// ================================================================
// Trainer Hooks - TanStack Query Integration
// ================================================================
// Custom hooks for trainer-related data fetching and mutations
// ================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trainerService } from '@/services';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Cohort, Assessment, AIFlag, InterventionRequest } from '@/types';

// ----------------------------------------------------------------
// Query Keys
// ----------------------------------------------------------------

export const trainerKeys = {
  all: ['trainer'] as const,
  cohorts: (trainerId: string) => [...trainerKeys.all, 'cohorts', trainerId] as const,
  cohort: (cohortId: string) => [...trainerKeys.all, 'cohort', cohortId] as const,
  assessments: (trainerId: string) => [...trainerKeys.all, 'assessments', trainerId] as const,
  assessment: (assessmentId: string) => [...trainerKeys.all, 'assessment', assessmentId] as const,
  aiFlags: (trainerId: string) => [...trainerKeys.all, 'ai-flags', trainerId] as const,
  performance: (trainerId: string) => [...trainerKeys.all, 'performance', trainerId] as const,
};

// ----------------------------------------------------------------
// Cohort Hooks
// ----------------------------------------------------------------

export const useTrainerCohorts = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: trainerKeys.cohorts(user?.id || ''),
    queryFn: () => trainerService.getCohorts(user!.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCohort = (cohortId: string) => {
  return useQuery({
    queryKey: trainerKeys.cohort(cohortId),
    queryFn: () => trainerService.getCohort(cohortId),
    enabled: !!cohortId,
    staleTime: 3 * 60 * 1000,
  });
};

export const useCreateCohort = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Partial<Cohort>) => trainerService.createCohort(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainerKeys.cohorts(user!.id) });
      toast({
        title: 'Cohort created',
        description: 'New cohort has been created successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create cohort',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// ----------------------------------------------------------------
// Assessment Hooks
// ----------------------------------------------------------------

export const usePendingAssessments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: trainerKeys.assessments(user?.id || ''),
    queryFn: () => trainerService.getPendingAssessments(user!.id),
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

export const useAssessment = (assessmentId: string) => {
  return useQuery({
    queryKey: trainerKeys.assessment(assessmentId),
    queryFn: () => trainerService.getAssessment(assessmentId),
    enabled: !!assessmentId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useGradeAssessment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      assessmentId,
      data,
    }: {
      assessmentId: string;
      data: {
        trainerScore: number;
        feedback: string;
        rubricScores?: Record<string, number>;
      };
    }) => trainerService.gradeAssessment(assessmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainerKeys.assessments(user!.id) });
      toast({
        title: 'Assessment graded',
        description: 'Feedback has been sent to the learner.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Grading failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// ----------------------------------------------------------------
// AI Flags Hooks
// ----------------------------------------------------------------

export const useAIFlags = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: trainerKeys.aiFlags(user?.id || ''),
    queryFn: () => trainerService.getAIFlags(user!.id),
    enabled: !!user,
    staleTime: 3 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useResolveAIFlag = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ flagId, notes }: { flagId: string; notes?: string }) =>
      trainerService.resolveAIFlag(flagId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainerKeys.aiFlags(user!.id) });
      toast({
        title: 'Flag resolved',
        description: 'AI flag has been marked as resolved.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to resolve flag',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// ----------------------------------------------------------------
// Intervention Hooks
// ----------------------------------------------------------------

export const useCreateIntervention = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (request: InterventionRequest) =>
      trainerService.createIntervention(request),
    onSuccess: () => {
      toast({
        title: 'Intervention created',
        description: 'Outreach has been initiated with the learner.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Intervention failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useInterventionHistory = (learnerId: string) => {
  return useQuery({
    queryKey: [...trainerKeys.all, 'interventions', learnerId],
    queryFn: () => trainerService.getInterventionHistory(learnerId),
    enabled: !!learnerId,
    staleTime: 10 * 60 * 1000,
  });
};

// ----------------------------------------------------------------
// Communication Hooks
// ----------------------------------------------------------------

export const useSendMessage = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      learnerId,
      message,
    }: {
      learnerId: string;
      message: {
        subject: string;
        body: string;
        type?: 'email' | 'notification' | 'both';
      };
    }) => trainerService.sendMessage(learnerId, message),
    onSuccess: () => {
      toast({
        title: 'Message sent',
        description: 'Your message has been delivered to the learner.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to send message',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// ----------------------------------------------------------------
// Performance Hooks
// ----------------------------------------------------------------

export const useTrainerPerformance = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: trainerKeys.performance(user?.id || ''),
    queryFn: () => trainerService.getPerformanceMetrics(user!.id),
    enabled: !!user,
    staleTime: 15 * 60 * 1000,
  });
};

export const useCohortPerformance = (cohortId: string) => {
  return useQuery({
    queryKey: [...trainerKeys.all, 'cohort-performance', cohortId],
    queryFn: () => trainerService.getCohortPerformance(cohortId),
    enabled: !!cohortId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useLearnerProgress = (learnerId: string) => {
  return useQuery({
    queryKey: [...trainerKeys.all, 'learner-progress', learnerId],
    queryFn: () => trainerService.getLearnerProgress(learnerId),
    enabled: !!learnerId,
    staleTime: 5 * 60 * 1000,
  });
};
