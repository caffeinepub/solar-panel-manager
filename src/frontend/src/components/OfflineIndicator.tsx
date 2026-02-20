import { useEffect, useState } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSyncs, setPendingSyncs] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && pendingSyncs === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 w-80">
      <Alert variant={isOnline ? 'default' : 'destructive'}>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <>
              <Wifi className="h-4 w-4" />
              <AlertDescription className="flex items-center gap-2">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Syncing {pendingSyncs} changes...
              </AlertDescription>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              <AlertDescription>You're offline. Changes will sync when reconnected.</AlertDescription>
            </>
          )}
        </div>
      </Alert>
    </div>
  );
}
