import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-muted', className)}
      {...props}
    />
  );
}

// Preset skeleton variants
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl border bg-card p-6', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonList({
  count = 5,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonCode({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl bg-muted/50 border p-4 space-y-2', className)}>
      <Skeleton className="h-4 w-24 bg-muted-foreground/10" />
      <Skeleton className="h-4 w-full bg-muted-foreground/10" />
      <Skeleton className="h-4 w-3/4 bg-muted-foreground/10" />
      <Skeleton className="h-4 w-5/6 bg-muted-foreground/10" />
      <Skeleton className="h-4 w-1/2 bg-muted-foreground/10" />
      <Skeleton className="h-4 w-2/3 bg-muted-foreground/10" />
    </div>
  );
}

export function SkeletonProjectCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl border bg-card overflow-hidden', className)}>
      <Skeleton className="h-40 rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}

export function SkeletonDashboard({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-28" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonProjectCard key={i} />
        ))}
      </div>
    </div>
  );
}
