// components/LeadConversionFunnel.tsx
import { useState, useEffect } from "react";
import { 
  Users, 
  Phone, 
  MessageCircle, 
  TrendingUp, 
  ArrowRight,
  Download,
  PieChart
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Funnel,
  FunnelChart,
  Cell
} from "recharts";
import { useMediaQuery } from "@/hooks";

interface LeadConversionFunnelProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string;
    }>;
  };
  conversionRate: number;
  onViewDetails?: () => void;
  onExport?: () => void;
}

const funnelColors = ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];


// Helper for responsive chart height
const getResponsiveHeight = (isMobile: boolean, isTablet: boolean): number => {
  if (isMobile) return 320;
  if (isTablet) return 360;
  return 400;
};

export function LeadConversionFunnel({
  data,
  conversionRate,
  onViewDetails,
  onExport
}: LeadConversionFunnelProps) {
  const [view, setView] = useState<'funnel' | 'bar'>('funnel');
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  
  const responsiveHeight = getResponsiveHeight(isMobile, isTablet);
  
  // Transform data for funnel chart
  const funnelData = data.labels.map((label, index) => ({
    name: label,
    value: data.datasets[0]?.data[index] || 0,
    fill: funnelColors[index % funnelColors.length]
  }));

  const barData = data.labels.map((label, index) => ({
    name: label,
    Leads: data.datasets[0]?.data[index] || 0
  }));

  const totalLeads = funnelData.reduce((sum, item) => sum + item.value, 0);
  const convertedLeads = funnelData.find(item => item.name === 'Converted')?.value || 0;
  const actualConversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      // Default export functionality
      const exportData = {
        funnelData,
        conversionRate: actualConversionRate,
        totalLeads,
        convertedLeads,
        exportedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lead-conversion-funnel-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Responsive tooltip settings
  const tooltipProps = {
    contentStyle: {
      fontSize: isMobile ? '11px' : '13px',
      padding: isMobile ? '4px 8px' : '8px 12px'
    }
  };

  const legendProps = {
    wrapperStyle: {
      fontSize: isMobile ? '11px' : '13px',
      paddingTop: isMobile ? '8px' : '0px'
    },
    verticalAlign: isMobile ? "bottom" as const : "top" as const,
    height: isMobile ? 36 : undefined,
    iconSize: isMobile ? 8 : 10
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header - Responsive */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-500 flex-shrink-0" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900">
              Lead Conversion Funnel
            </h3>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* View toggle - Horizontal scroll on mobile */}
            <div className={`
              ${isMobile ? 'overflow-x-auto scrollbar-hide' : ''}
              flex rounded-md shadow-sm
            `}>
              <div className={`flex ${isMobile ? 'min-w-max' : ''}`}>
                <button
                  onClick={() => setView('funnel')}
                  className={`
                    px-2 sm:px-3 py-1.5 sm:py-1 text-xs sm:text-sm font-medium border
                    transition-colors duration-200
                    min-h-[32px] min-w-[64px] sm:min-w-0
                    touch-manipulation
                    ${view === 'funnel'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    } rounded-l-md
                  `}
                  aria-label="Funnel view"
                >
                  Funnel
                </button>
                <button
                  onClick={() => setView('bar')}
                  className={`
                    px-2 sm:px-3 py-1.5 sm:py-1 text-xs sm:text-sm font-medium border
                    transition-colors duration-200
                    min-h-[32px] min-w-[64px] sm:min-w-0
                    touch-manipulation
                    ${view === 'bar'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    } rounded-r-md
                  `}
                  aria-label="Bar chart view"
                >
                  Bar Chart
                </button>
              </div>
            </div>
            
            {/* Export button - Larger tap target on mobile */}
            <button
              onClick={handleExport}
              className={`
                p-1.5 sm:p-1 text-gray-500 hover:text-gray-700
                min-h-[32px] min-w-[32px] sm:min-w-0
                flex items-center justify-center rounded-md
                hover:bg-gray-100 transition-colors duration-200
              `}
              aria-label="Export data"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Conversion rate summary - Responsive */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Overall Conversion Rate</p>
            <div className="flex flex-wrap items-baseline gap-1 sm:gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-purple-600">
                {conversionRate.toFixed(1)}%
              </span>
              <span className="text-xs sm:text-sm text-gray-500">
                ({convertedLeads} / {totalLeads} leads)
              </span>
            </div>
          </div>
          
          {/* Channel indicators - Wrap on mobile */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center space-x-1">
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              <span className="text-xs sm:text-sm text-gray-600">Phone</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              <span className="text-xs sm:text-sm text-gray-600">WhatsApp</span>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3">
          <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
            <div 
              className="h-full transition-all duration-500 bg-purple-600 rounded-full"
              style={{ width: `${conversionRate}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Chart container - Responsive height */}
      <div className="p-3 sm:p-6">
        <div style={{ height: responsiveHeight }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            {view === 'funnel' ? (
              <FunnelChart margin={{ 
                top: 20, 
                right: isMobile ? 10 : 30, 
                left: isMobile ? 10 : 30, 
                bottom: isMobile ? 40 : 20 
              }}>
                <Tooltip {...tooltipProps} />
                {!isMobile && <Legend {...legendProps} />}
                <Funnel
                  dataKey="value"
                  data={funnelData}
                  nameKey="name"
                  isAnimationActive
                >
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Funnel>
              </FunnelChart>
            ) : (
              <BarChart 
                data={barData}
                margin={{ 
                  top: 20, 
                  right: isMobile ? 10 : 30, 
                  left: isMobile ? 0 : 20, 
                  bottom: isMobile ? 40 : 20 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={isMobile ? 0.5 : 1} />
                <XAxis 
                  dataKey="name" 
                  tick={{ 
                    fontSize: isMobile ? 10 : 12,
                    angle: isMobile ? -45 : 0,
                    textAnchor: isMobile ? "end" : "middle"
                  }}
                  interval={isMobile ? "preserveStartEnd" : 0}
                  height={isMobile ? 60 : 30}
                  tickMargin={isMobile ? 10 : 5}
                />
                <YAxis 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  width={isMobile ? 40 : 60}
                />
                <Tooltip {...tooltipProps} />
                {!isMobile && <Legend {...legendProps} />}
                <Bar 
                  dataKey="Leads" 
                  fill="#8B5CF6" 
                  radius={isMobile ? [2, 2, 0, 0] : [4, 4, 0, 0]}
                  barSize={isMobile ? 30 : 40}
                >
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={funnelColors[index % funnelColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        
        {/* Stage details - Responsive grid */}
        <div className={`
          grid gap-3 sm:gap-4 mt-4 sm:mt-6
          ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-4'}
        `}>
          {funnelData.map((stage, index) => {
            const percentage = totalLeads > 0 ? (stage.value / totalLeads) * 100 : 0;
            const dropOff = index > 0 ? funnelData[index - 1].value - stage.value : 0;
            const dropOffRate = index > 0 && funnelData[index - 1].value > 0 
              ? (dropOff / funnelData[index - 1].value) * 100 
              : 0;
              
            return (
              <div key={stage.name} className="p-3 sm:p-4 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-600">
                    {stage.name}
                  </span>
                  <span className="text-base sm:text-lg font-semibold text-gray-900">
                    {stage.value}
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-gray-500">
                    <span>{percentage.toFixed(1)}% of total</span>
                    {index > 0 && (
                      <span className="text-red-500 text-xs">
                        -{dropOffRate.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full rounded-full bg-purple-600 transition-all duration-300"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Insights and recommendations - Responsive */}
        {actualConversionRate < 20 && totalLeads > 10 && (
          <div className="p-3 sm:p-4 mt-4 sm:mt-6 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
              <TrendingUp className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">
                  Conversion Optimization Opportunity
                </p>
                <p className="mt-1 text-xs sm:text-sm text-yellow-700">
                  Your conversion rate is below the industry average (25%). Consider:
                </p>
                <ul className="mt-2 space-y-1 text-xs sm:text-sm text-yellow-700 list-disc list-inside">
                  <li>Following up with leads within 5 minutes</li>
                  {!isMobile && <li>Offering limited-time discounts for new leads</li>}
                  <li>Implementing an automated WhatsApp/SMS follow-up sequence</li>
                </ul>
                {onViewDetails && (
                  <button
                    onClick={onViewDetails}
                    className="flex items-center mt-3 text-xs sm:text-sm font-medium text-yellow-800 hover:text-yellow-900"
                  >
                    View detailed analytics
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {actualConversionRate > 30 && (
          <div className="p-3 sm:p-4 mt-4 sm:mt-6 bg-green-50 rounded-lg border border-green-200">
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
              <PieChart className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">
                  Excellent Conversion Performance!
                </p>
                <p className="mt-1 text-xs sm:text-sm text-green-700">
                  Your conversion rate of {actualConversionRate.toFixed(1)}% is outstanding. 
                  {!isMobile && " You're performing better than 90% of sellers."}
                </p>
                {!isMobile && (
                  <p className="mt-1 text-xs sm:text-sm text-green-700">
                    Consider scaling your lead generation efforts to maximize this high conversion rate.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}