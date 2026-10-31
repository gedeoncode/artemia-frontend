
export default function LoadingSpinner({
  size = 'lg',
  color = 'primary',
  className = '',
  showLabel = false,
  label = 'Loading...',
  labelPosition = 'right'
}: {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'white' | 'black';
  className?: string;
  showLabel?: boolean;
  label?: string;
  labelPosition?: 'left' | 'right' | 'top' | 'bottom';
}) {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10',
    '2xl': 'h-20 w-20'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-yellow-500',
    info: 'text-cyan-500',
    light: 'text-gray-300',
    dark: 'text-gray-800',
    white: 'text-white',
    black: 'text-black'
  };

  const labelPositionClasses = {
    left: 'flex-row-reverse',
    right: 'flex-row',
    top: 'flex-col-reverse',
    bottom: 'flex-col'
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${labelPositionClasses[labelPosition]} ${className}`}>
      <svg
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {showLabel && (
        <span className={`text-${color.split('-')[0]}-600 text-sm`}>
          {label}
        </span>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
}



interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
  label?: string;
}

export const LoadingSpinner2: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
  label 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-[5px]',
  };

  const colorClasses = {
    primary: 'border-t-blue-600 border-r-blue-600 border-b-transparent border-l-transparent',
    secondary: 'border-t-purple-600 border-r-purple-600 border-b-transparent border-l-transparent',
    white: 'border-t-white border-r-white border-b-transparent border-l-transparent',
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      role="status"
    >
      {label && <span className="sr-only">{label}</span>}
      <span className="sr-only">Loading...</span>
     
    </div>
  );
};

// components/LoadingDots.tsx


interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2.5 w-2.5',
    lg: 'h-3.5 w-3.5',
  };

  const colorClasses = {
    primary: 'bg-blue-600',
    secondary: 'bg-purple-600',
    white: 'bg-white',
  };

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`} role="status">
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce [animation-delay:-0.3s]`}
      />
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce [animation-delay:-0.15s]`}
      />
      <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`} />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// components/LoadingBar.tsx

interface LoadingBarProps {
  className?: string;
}

export const LoadingBar: React.FC<LoadingBarProps> = ({ className = '' }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-1.5 ${className}`} role="status">
      <div className="bg-blue-600 h-1.5 rounded-full animate-progress w-full origin-left-right" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

