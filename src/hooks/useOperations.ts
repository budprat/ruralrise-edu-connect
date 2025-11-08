// ================================================================
// Operations Hooks - TanStack Query Integration
// ================================================================
// Custom hooks for operations/management data fetching
// ================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { operationsService } from '@/services';
import { useToast } from '@/hooks/use-toast';
import type {
  DashboardMetrics,
  ClientMetrics,
  TrainerPerformance,
  RiskAlert,
  ReportRequest,
  OptimizationRequest
} from '@/types';

// ----------------------------------------------------------------
// Query Keys
// ----------------------------------------------------------------

export const operationsKeys = {
  all: ['operations'] as const,
  dashboard: (timeframe: string) => [...operationsKeys.all, 'dashboard', timeframe] as const,
  clients: () => [...operationsKeys.all, 'clients'] as const,
  client: (clientId: string) => [...operationsKeys.all, 'client', clientId] as const,
  trainers: () => [...operationsKeys.all, 'trainers'] as const,
  trainer: (trainerId: string) => [...operationsKeys.all, 'trainer', trainerId] as const,
  quality: () => [...operationsKeys.all, 'quality'] as const,
  risks: (status?: string) => [...operationsKeys.all, 'risks', status] as const,
  reports: () => [...operationsKeys.all, 'reports'] as const,
  health: () => [...operationsKeys.all, 'health'] as const,
};

// ----------------------------------------------------------------
// Dashboard Hooks
// ----------------------------------------------------------------

export const useDashboardMetrics = (timeframe: string = '30d') => {
  return useQuery({
    queryKey: operationsKeys.dashboard(timeframe),
    queryFn: () => operationsService.getDashboardMetrics(timeframe),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};

export const useKPITrends = (metric: string, timeframe: string = '30d') => {
  return useQuery({
    queryKey: [...operationsKeys.all, 'kpi-trends', metric, timeframe],
    queryFn: () => operationsService.getKPITrends(metric, timeframe),
    enabled: !!metric,
    staleTime: 15 * 60 * 1000,
  });
};

// ----------------------------------------------------------------
// Client Management Hooks
// ----------------------------------------------------------------

export const useClientMetrics = () => {
  return useQuery({
    queryKey: operationsKeys.clients(),
    queryFn: () => operationsService.getClientMetrics(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useClient = (clientId: string) => {
  return useQuery({
    queryKey: operationsKeys.client(clientId),
    queryFn: () => operationsService.getClient(clientId),
    enabled: !!clientId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      clientId,
      updates,
    }: {
      clientId: string;
      updates: Partial<ClientMetrics>;
    }) => operationsService.updateClient(clientId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: operationsKeys.clients() });
      toast({
        title: 'Client updated',
        description: 'Client information has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// ----------------------------------------------------------------
// Trainer Management Hooks
// ----------------------------------------------------------------

export const useTrainerPerformance = () => {
  return useQuery({
    queryKey: operationsKeys.trainers(),
    queryFn: () => operationsService.getTrainerPerformance(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useTrainer = (trainerId: string) => {
  return useQuery({
    queryKey: operationsKeys.trainer(trainerId),
    queryFn: () => operationsService.getTrainer(trainerId),
    enabled: !!trainerId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useRedistributeLearners = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: {
      fromTrainerId: string;
      toTrainerId: string;
      learnerIds: string[];
    }) => operationsService.redistributeLearners(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: operationsKeys.trainers() });
      toast({
        title: 'Learners redistributed',
        description: 'Learners have been successfully reassigned.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Redistribution failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// ----------------------------------------------------------------
// Quality Assurance Hooks
// ----------------------------------------------------------------

export const useQualityMetrics = () => {
  return useQuery({
    queryKey: operationsKeys.quality(),
    queryFn: () => operationsService.getQualityMetrics(),
    staleTime: 15 * 60 * 1000,
  });
};

export const useComplianceStatus = () => {
  return useQuery({
    queryKey: [...operationsKeys.all, 'compliance'],
    queryFn: () => operationsService.getComplianceStatus(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// ----------------------------------------------------------------
// Risk Management Hooks
// ----------------------------------------------------------------

export const useRiskAlerts = (status?: 'open' | 'in_progress' | 'resolved') => {
  return useQuery({
    queryKey: operationsKeys.risks(status),
    queryFn: () => operationsService.getRiskAlerts(status),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
};

export const useRiskAlert = (riskId: string) => {
  return useQuery({
    queryKey: [...operationsKeys.all, 'risk', riskId],
    queryFn: () => operationsService.getRiskAlert(riskId),
    enabled: !!riskId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateRiskAlert = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Partial<RiskAlert>) =>
      operationsService.createRiskAlert(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: operationsKeys.risks() });
      toast({
        title: 'Risk alert created',
        description: 'New risk alert has been added to the system.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create alert',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useResolveRiskAlert = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ riskId, resolution }: { riskId: string; resolution: string }) =>
      operationsService.resolveRiskAlert(riskId, resolution),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: operationsKeys.risks() });
      toast({
        title: 'Risk resolved',
        description: 'Risk alert has been marked as resolved.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to resolve',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// ----------------------------------------------------------------
// Analytics & Reporting Hooks
// ----------------------------------------------------------------

export const useGenerateReport = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (request: ReportRequest) =>
      operationsService.generateReport(request),
    onSuccess: (data) => {
      toast({
        title: 'Report generation started',
        description: `Report ID: ${data.reportId}. You will be notified when it's ready.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Report generation failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useScheduledReports = () => {
  return useQuery({
    queryKey: operationsKeys.reports(),
    queryFn: () => operationsService.getScheduledReports(),
    staleTime: 30 * 60 * 1000,
  });
};

// ----------------------------------------------------------------
// Optimization Hooks
// ----------------------------------------------------------------

export const useRequestOptimization = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (request: OptimizationRequest) =>
      operationsService.requestOptimization(request),
    onSuccess: (data) => {
      toast({
        title: 'Optimization analysis complete',
        description: `${data.recommendations.length} recommendations generated.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Optimization failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useOptimizationHistory = () => {
  return useQuery({
    queryKey: [...operationsKeys.all, 'optimizations'],
    queryFn: () => operationsService.getOptimizationHistory(),
    staleTime: 30 * 60 * 1000,
  });
};

// ----------------------------------------------------------------
// Financial Analytics Hooks
// ----------------------------------------------------------------

export const useRevenueAnalytics = (timeframe: string = '30d') => {
  return useQuery({
    queryKey: [...operationsKeys.all, 'revenue', timeframe],
    queryFn: () => operationsService.getRevenueAnalytics(timeframe),
    staleTime: 15 * 60 * 1000,
  });
};

export const useCostBreakdown = (timeframe: string = '30d') => {
  return useQuery({
    queryKey: [...operationsKeys.all, 'costs', timeframe],
    queryFn: () => operationsService.getCostBreakdown(timeframe),
    staleTime: 15 * 60 * 1000,
  });
};

// ----------------------------------------------------------------
// System Health Hooks
// ----------------------------------------------------------------

export const useSystemHealth = () => {
  return useQuery({
    queryKey: operationsKeys.health(),
    queryFn: () => operationsService.getSystemHealth(),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
};
