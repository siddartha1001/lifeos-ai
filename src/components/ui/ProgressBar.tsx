interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  gradient?: string;
  showLabel?: boolean;
  height?: string;
}

export function ProgressBar({
  value,
  max = 100,
  className = '',
  gradient = 'from-purple-500 to-blue-500',
  showLabel = false,
  height = 'h-2.5',
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full ${height} bg-white/10 rounded-full overflow-hidden`}>
        <div
          className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1.5 text-right text-xs text-gray-400">
          {Math.round(pct)}%
        </div>
      )}
    </div>
  );
}
