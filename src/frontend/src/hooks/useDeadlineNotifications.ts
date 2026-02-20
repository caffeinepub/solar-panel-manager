import { useEffect, useRef } from 'react';
import { useTasks } from './useQueries';

export function useDeadlineNotifications() {
  const { data: tasks } = useTasks('deadline');
  const notifiedTasksRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!tasks || !('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const checkDeadlines = () => {
      const now = new Date();
      const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      tasks.forEach((task) => {
        const deadline = new Date(task.deadline);
        const taskId = task.id;

        // Notify if deadline is within 24 hours and not already notified
        if (deadline <= oneDayFromNow && deadline > now && !notifiedTasksRef.current.has(taskId)) {
          new Notification('Task Deadline Approaching', {
            body: `"${task.title}" is due soon for ${task.customerName}`,
            icon: '/favicon.ico',
            tag: taskId,
          });
          notifiedTasksRef.current.add(taskId);
        }
      });
    };

    // Check immediately
    checkDeadlines();

    // Check every hour
    const interval = setInterval(checkDeadlines, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [tasks]);
}
