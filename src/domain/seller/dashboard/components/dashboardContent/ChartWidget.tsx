// components/ChartWidget.tsx
import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";
import { Download, ZoomIn, ZoomOut } from "lucide-react";
import { useMediaQuery } from "@/hooks";

export type ChartType = "line" | "bar" | "pie" | "area";
export type TimeRange = "7d" | "30d" | "90d" | "all";

interface ChartWidgetProps {
  title: string;
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string;
      borderWidth?: number;
      fill?: boolean;
      borderDash?: number[];
    }>;
  };
  type: ChartType;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  enableZoom?: boolean;
  enableExport?: boolean;
  onTimeRangeChange?: (range: TimeRange) => void;
  onDataPointClick?: (data: any) => void;
}

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

// Helper for responsive chart height
const getResponsiveHeight = (
  desktopHeight: number,
  isMobile: boolean,
  isTablet: boolean,
): number => {
  if (isMobile) return Math.min(desktopHeight, 280);
  if (isTablet) return Math.min(desktopHeight, 320);
  return desktopHeight;
};

// Helper for pie chart radius
const getPieRadius = (isMobile: boolean, isTablet: boolean): number => {
  if (isMobile) return 80;
  if (isTablet) return 100;
  return 120;
};

export function ChartWidget({
  title,
  data,
  type,
  height = 400,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  enableZoom = false,
  enableExport = true,
  onTimeRangeChange,
  onDataPointClick,
}: ChartWidgetProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(data.labels.length);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("30d");

  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");

  const responsiveHeight = getResponsiveHeight(height, isMobile, isTablet);
  const pieOuterRadius = getPieRadius(isMobile, isTablet);

  // Transform data for recharts
  const chartData = data.labels.map((label, idx) => {
    const dataPoint: any = { name: label };
    data.datasets.forEach((dataset, datasetIdx) => {
      dataPoint[dataset.label] = dataset.data[idx];
    });
    return dataPoint;
  });

  const filteredData = enableZoom
    ? chartData.slice(startIndex, endIndex)
    : chartData;

  const handleTimeRangeChange = (range: TimeRange) => {
    setSelectedTimeRange(range);
    onTimeRangeChange?.(range);
  };

  const handleExport = () => {
    const exportData = {
      title,
      data: filteredData,
      type,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderChart = () => {
    const commonProps = {
      data: filteredData,
      onClick: onDataPointClick,
      margin: {
        top: 20,
        right: isMobile ? 10 : 30,
        left: isMobile ? 0 : 20,
        bottom: isMobile ? 20 : 5,
      },
    };

    const xAxisProps = {
      dataKey: "name",
      tick: {
        fontSize: isMobile ? 10 : 12,
        angle: isMobile ? -45 : 0,
        textAnchor: isMobile ? "end" : "middle",
      },
      interval: isMobile ? "preserveStartEnd" : 0,
      height: isMobile ? 60 : 30,
      tickMargin: isMobile ? 10 : 5,
    };

    const yAxisProps = {
      tick: { fontSize: isMobile ? 10 : 12 },
      width: isMobile ? 40 : 60,
    };

    const tooltipProps = {
      contentStyle: {
        fontSize: isMobile ? "12px" : "14px",
        padding: isMobile ? "4px 8px" : "8px 12px",
      },
    };

    const legendProps = {
      wrapperStyle: {
        fontSize: isMobile ? "11px" : "14px",
        paddingTop: isMobile ? "8px" : "0px",
      },
      verticalAlign: isMobile ? "bottom" : ("top" as any),
      height: isMobile ? 40 : undefined,
      iconSize: isMobile ? 8 : 10,
      layout: isMobile ? ("horizontal" as const) : ("horizontal" as const),
    };

    switch (type) {
      case "line":
        return (
          <LineChart {...commonProps}>
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                strokeOpacity={isMobile ? 0.5 : 1}
              />
            )}
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            {showTooltip && <Tooltip {...tooltipProps} />}
            {showLegend && <Legend {...legendProps} />}
            {data.datasets.map((dataset, idx) => (
              <Line
                key={idx}
                type="monotone"
                dataKey={dataset.label}
                stroke={dataset.borderColor || COLORS[idx % COLORS.length]}
                strokeWidth={
                  isMobile
                    ? (dataset.borderWidth || 2) * 0.8
                    : dataset.borderWidth || 2
                }
                dot={!isMobile || filteredData.length <= 10}
                activeDot={{ r: isMobile ? 4 : 6 }}
              />
            ))}
          </LineChart>
        );

      case "bar":
        return (
          <BarChart {...commonProps}>
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                strokeOpacity={isMobile ? 0.5 : 1}
              />
            )}
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            {showTooltip && <Tooltip {...tooltipProps} />}
            {showLegend && <Legend {...legendProps} />}
            {data.datasets.map((dataset, idx) => (
              <Bar
                key={idx}
                dataKey={dataset.label}
                fill={
                  (dataset.backgroundColor as string) ||
                  COLORS[idx % COLORS.length]
                }
                radius={isMobile ? [2, 2, 0, 0] : [4, 4, 0, 0]}
                barSize={isMobile ? 20 : 30}
              />
            ))}
          </BarChart>
        );

      case "pie":
        return (
          <PieChart
            margin={{ top: 0, right: 0, bottom: isMobile ? 40 : 0, left: 0 }}
          >
            <Pie
              data={filteredData}
              dataKey={data.datasets[0]?.label || "value"}
              nameKey="name"
              cx="50%"
              cy={isMobile ? "45%" : "50%"}
              outerRadius={pieOuterRadius}
              label={!isMobile}
              labelLine={!isMobile}
              onClick={(data) => onDataPointClick?.(data)}
              paddingAngle={isMobile ? 2 : 0}
            >
              {filteredData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            {showTooltip && <Tooltip {...tooltipProps} />}
            {showLegend && <Legend {...legendProps} />}
          </PieChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                strokeOpacity={isMobile ? 0.5 : 1}
              />
            )}
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            {showTooltip && <Tooltip {...tooltipProps} />}
            {showLegend && <Legend {...legendProps} />}
            {data.datasets.map((dataset, idx) => (
              <Area
                key={idx}
                type="monotone"
                dataKey={dataset.label}
                stroke={dataset.borderColor || COLORS[idx % COLORS.length]}
                fill={
                  (dataset.backgroundColor as string) ||
                  COLORS[idx % COLORS.length]
                }
                fillOpacity={0.3}
              />
            ))}
          </AreaChart>
        );

      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        {/* Stack on mobile, horizontal on desktop */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">
            {title}
          </h3>

          {/* Controls with wrap support */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Time range selector - scrollable on mobile */}
            {onTimeRangeChange && (
              <div
                className={`
                ${isMobile ? "overflow-x-auto scrollbar-hide" : ""}
                flex rounded-md shadow-sm
              `}
              >
                <div className={`flex ${isMobile ? "min-w-max" : ""}`}>
                  {(["7d", "30d", "90d", "all"] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => handleTimeRangeChange(range)}
                      className={`
                        px-2 sm:px-3 py-1.5 sm:py-1 text-xs font-medium capitalize border
                        transition-colors duration-200
                        min-h-[32px] min-w-[44px] sm:min-w-0
                        touch-manipulation
                        ${
                          selectedTimeRange === range
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }
                        first:rounded-l-md last:rounded-r-md
                      `}
                      aria-label={`Time range ${range === "all" ? "all" : range}`}
                    >
                      {range === "all" ? "All" : range}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Zoom controls - larger tap targets on mobile */}
            {enableZoom && (
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => {
                    if (zoomLevel > 1) {
                      setZoomLevel(zoomLevel - 0.5);
                      const step = Math.floor(chartData.length / zoomLevel);
                      setStartIndex(Math.max(0, startIndex - step));
                      setEndIndex(Math.min(chartData.length, endIndex + step));
                    }
                  }}
                  className={`
                    p-1.5 sm:p-1 border border-gray-300 rounded-l-md hover:bg-gray-50
                    min-h-[32px] min-w-[32px] sm:min-w-0
                    flex items-center justify-center
                  `}
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setZoomLevel(zoomLevel + 0.5);
                    const step = Math.floor(
                      chartData.length / (zoomLevel + 0.5),
                    );
                    setStartIndex(startIndex);
                    setEndIndex(Math.min(chartData.length, startIndex + step));
                  }}
                  className={`
                    p-1.5 sm:p-1 border-t border-b border-r border-gray-300 rounded-r-md hover:bg-gray-50
                    min-h-[32px] min-w-[32px] sm:min-w-0
                    flex items-center justify-center
                  `}
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Export button - larger tap target on mobile */}
            {enableExport && (
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
            )}
          </div>
        </div>
      </div>

      {/* Chart container with responsive height */}
      <div className="p-3 sm:p-4">
        <div style={{ height: responsiveHeight }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Brush for zooming - hidden on very small screens */}
      {enableZoom && filteredData.length > 20 && !isMobile && (
        <div className="px-3 sm:px-4 pb-3 sm:pb-4">
          <ResponsiveContainer width="100%" height={isTablet ? 50 : 60}>
            <AreaChart data={chartData}>
              <Area
                type="monotone"
                dataKey={data.datasets[0]?.label}
                fill="#3B82F6"
                stroke="#3B82F6"
              />
              <Brush
                dataKey="name"
                height={isTablet ? 25 : 30}
                stroke="#3B82F6"
                onChange={(brush) => {
                  if (
                    brush.startIndex !== undefined &&
                    brush.endIndex !== undefined
                  ) {
                    setStartIndex(brush.startIndex);
                    setEndIndex(brush.endIndex);
                  }
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Show hint for hidden brush on mobile */}
      {enableZoom && filteredData.length > 20 && isMobile && (
        <div className="px-4 pb-3 text-xs text-gray-500 text-center">
          Use pinch to zoom on chart
        </div>
      )}
    </div>
  );
}
