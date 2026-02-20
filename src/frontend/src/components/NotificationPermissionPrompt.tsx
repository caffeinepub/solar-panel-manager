import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotificationPermissionPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      const hasSeenPrompt = localStorage.getItem('notification-prompt-seen');
      if (!hasSeenPrompt) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }
  }, []);

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setShowPrompt(false);
        localStorage.setItem('notification-prompt-seen', 'true');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    localStorage.setItem('notification-prompt-seen', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 w-80 md:bottom-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <Bell className="h-5 w-5 text-primary" />
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={dismissPrompt}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardTitle className="text-base">Enable Deadline Reminders</CardTitle>
          <CardDescription className="text-sm">
            Get notified before task deadlines to prevent delays
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={requestPermission} className="w-full">
            Enable Notifications
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
