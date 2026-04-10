import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "@/services/service";

export const notificationKeys = {
  all: ["notifications"] as const,
  paginated: (page: number) => [...notificationKeys.all, page] as const,
};

export const useNotifications = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: notificationKeys.paginated(page),
    queryFn: () => Api.getNotifications(page, limit),
    refetchInterval: 60000, // Poll every minute for new notifications
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => Api.markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => Api.markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => Api.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => Api.deleteAllNotifications(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};
