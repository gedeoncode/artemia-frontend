// components/InsightsPanel.tsx
import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Lightbulb, 
  ArrowRight,
  ThumbsUp,
  Clock,
  Package,
  Users,
  DollarSign
} from "lucide-react";
import { useMediaQuery } from "@/hooks";
import { Insight } from "../../types";



interface InsightsPanelProps {
  insights: Insight[];
  onInsightClick?: (insight: Insight) => void;
  autoRotate?: boolean;
  rotateInterval?: number;
}

const insightIcons = {
  positive: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />,
  warning: <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />,
  opportunity: <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />,
  improvement: <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
};

const priorityColors = {
  low: 'border-l-4 border-gray-300',
  medium: 'border-l-4 sm:border-l-8 border-yellow-400',
  high: 'border-l-4 sm:border-l-12 border-red-500 sm:ring-2 sm:ring-red-200'
};



export function InsightsPanel({ 
  insights, 
  onInsightClick, 
  autoRotate = true, 
  rotateInterval = 8000 
}: InsightsPanelProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  // Auto-rotate insights
  useEffect(() => {
    if (!autoRotate || insights.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % insights.length);
    }, rotateInterval);
    
    return () => clearInterval(interval);
  }, [autoRotate, insights.length, rotateInterval]);

  const getMetricIcon = (metricType?: string) => {
    switch (metricType) {
      case 'revenue': return <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'orders': return <Package className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'customers': return <Users className="w-3 h-3 sm:w-4 sm:h-4" />;
      default: return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  if (insights.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">Insights</h3>
        </div>
        <div className="p-4 sm:p-6 text-center text-gray-500">
          <Lightbulb className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-gray-300" />
          <p className="text-sm sm:text-base">No insights available at this moment.</p>
          {!isMobile && (
            <p className="text-xs sm:text-sm">Check back later for personalized recommendations.</p>
          )}
        </div>
      </div>
    );
  }

  const activeInsight = insights[activeIndex];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900">AI Insights</h3>
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
              Beta
            </span>
          </div>
          
          {/* Navigation dots - Scrollable on mobile if many */}
          {insights.length > 1 && (
            <div className={`
              ${isMobile && insights.length > 5 ? 'overflow-x-auto scrollbar-hide' : ''}
              flex gap-1 sm:gap-1.5
            `}>
              <div className={`flex gap-1 sm:gap-1.5 ${isMobile && insights.length > 5 ? 'min-w-max' : ''}`}>
                {insights.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`
                      transition-all duration-200 rounded-full
                      ${idx === activeIndex 
                        ? 'bg-blue-600 w-3 sm:w-4 h-1.5 sm:h-2' 
                        : 'bg-gray-300 hover:bg-gray-400 w-1.5 sm:w-2 h-1.5 sm:h-2'
                      }
                      touch-manipulation
                    `}
                    aria-label={`Go to insight ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Featured insight (carousel) */}
      <div 
        className="p-3 sm:p-6 transition-all duration-300 cursor-pointer active:bg-gray-50 sm:hover:bg-gray-50"
        onClick={() => onInsightClick?.(activeInsight)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onInsightClick?.(activeInsight);
          }
        }}
      >
        <div className={`${priorityColors[activeInsight.priority]} pl-2 sm:pl-4`}>
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
            <div className="flex-shrink-0">
              {insightIcons[activeInsight.type]}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900">
                  {activeInsight.title}
                </h4>
                <span className={`text-[10px] sm:text-xs font-medium capitalize px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full inline-block w-fit ${
                  activeInsight.priority === 'high' ? 'bg-red-100 text-red-700' :
                  activeInsight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {activeInsight.priority} priority
                </span>
              </div>
              
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-600">
                {isMobile && activeInsight.description.length > 120 
                  ? `${activeInsight.description.substring(0, 120)}...` 
                  : activeInsight.description}
              </p>
              
              {activeInsight.metric && (
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                  <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm">
                    {getMetricIcon()}
                    <span className="font-medium">{activeInsight.metric.value}</span>
                    <span className="text-gray-500">{activeInsight.metric.unit}</span>
                  </div>
                  <div className={`flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm ${
                    activeInsight.metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {activeInsight.metric.change >= 0 ? (
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                    <span>{Math.abs(activeInsight.metric.change)}%</span>
                  </div>
                </div>
              )}
              
              {activeInsight.action && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onInsightClick?.(activeInsight);
                  }}
                  className="inline-flex items-center mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800 touch-manipulation"
                >
                  {activeInsight.action.label}
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5 sm:ml-1" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* All insights list (expandable) */}
      <div className="border-t border-gray-200">
        <button
          onClick={() => setExpandedInsight(expandedInsight ? null : 'all')}
          className="w-full px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm text-left text-gray-600 hover:bg-gray-50 active:bg-gray-50 touch-manipulation"
        >
          {expandedInsight ? 'Show less' : `View all ${insights.length} insights`}
        </button>
        
        {expandedInsight && (
          <div className="divide-y divide-gray-200 border-t border-gray-200 max-h-[400px] overflow-y-auto">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="p-3 sm:p-4 cursor-pointer active:bg-gray-50 sm:hover:bg-gray-50 touch-manipulation"
                onClick={() => onInsightClick?.(insight)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onInsightClick?.(insight);
                  }
                }}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="flex-shrink-0">
                    {insightIcons[insight.type]}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <h5 className="text-xs sm:text-sm font-medium text-gray-900">
                        {insight.title}
                      </h5>
                      <span className="text-[10px] sm:text-xs text-gray-500 capitalize">
                        {insight.priority}
                      </span>
                    </div>
                    
                    <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-gray-600">
                      {isMobile && insight.description.length > 100
                        ? `${insight.description.substring(0, 100)}...`
                        : insight.description}
                    </p>
                    
                    {insight.action && (
                      <div className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-blue-600">
                        {insight.action.label} →
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}