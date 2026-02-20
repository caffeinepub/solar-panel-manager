import { Progress } from '@/components/ui/progress';

interface UploadProgressBarProps {
  progress: number;
  status?: 'uploading' | 'complete' | 'error';
}

export default function UploadProgressBar({ progress, status = 'uploading' }: UploadProgressBarProps) {
  const getStatusColor = () => {
    if (status === 'complete') return 'bg-green-500';
    if (status === 'error') return 'bg-destructive';
    return '';
  };

  const getStatusText = () => {
    if (status === 'complete') return 'Upload complete';
    if (status === 'error') return 'Upload failed';
    return `Uploading... ${progress}%`;
  };

  return (
    <div className="space-y-2">
      <Progress value={progress} className={getStatusColor()} />
      <p className="text-sm text-muted-foreground">{getStatusText()}</p>
    </div>
  );
}
