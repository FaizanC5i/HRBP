import { useState, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, ReferenceLine } from 'recharts';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface AccelerationData {
  name: string;
  x: number;
  y: number;
  z: number;
  techMaturity: string;
  quadrant: string;
}

interface AccelerationBubbleChartProps {
  data: AccelerationData[];
  getQuadrantColor: (quadrant: string) => string;
}

export const AccelerationBubbleChart = ({ data, getQuadrantColor }: AccelerationBubbleChartProps) => {
  const [timeIndex, setTimeIndex] = useState(5); // 0-5 representing 6 months

  // Generate time-based data (simulate playhead functionality)
  const timeData = useMemo(() => {
    return data.map(item => {
      // Simulate how values change over time
      const timeFactor = (timeIndex + 1) / 6;
      const variance = (Math.random() - 0.5) * 10;
      
      return {
        ...item,
        x: Math.max(0, Math.min(100, item.x * timeFactor + variance)),
        y: Math.max(0, Math.min(100, item.y * (0.5 + timeFactor * 0.5) + variance)),
        z: Math.max(20, item.z * timeFactor)
      };
    });
  }, [data, timeIndex]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <div className="space-y-2">
      {/* Time slider / playhead */}
      <div className="flex items-center gap-3 px-2">
        <span className="text-[9px] text-muted-foreground w-8">{months[0]}</span>
        <Slider
          value={[timeIndex]}
          onValueChange={([val]) => setTimeIndex(val)}
          max={5}
          step={1}
          className="flex-1"
        />
        <span className="text-[9px] text-muted-foreground w-8">{months[5]}</span>
        <Badge variant="outline" className="text-[8px] px-1.5 py-0 h-4">
          {months[timeIndex]} 2024
        </Badge>
      </div>

      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 25, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              type="number" 
              dataKey="x" 
              domain={[0, 100]}
              tick={{ fontSize: 8 }}
              label={{ value: 'Market Volume', position: 'bottom', fontSize: 9, offset: 5 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              domain={[0, 100]}
              tick={{ fontSize: 8 }}
              label={{ value: 'Growth Rate %', angle: -90, position: 'insideLeft', fontSize: 9 }}
            />
            <ZAxis type="number" dataKey="z" range={[30, 200]} />
            
            {/* Reference lines for quadrants */}
            <ReferenceLine x={50} stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <ReferenceLine y={50} stroke="hsl(var(--border))" strokeDasharray="3 3" />
            
            <Tooltip 
              content={({ payload }) => {
                if (payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-popover border rounded-lg p-2 shadow-lg">
                      <p className="text-xs font-medium">{d.name}</p>
                      <p className="text-[10px] text-muted-foreground">Volume: {Math.round(d.x)}</p>
                      <p className="text-[10px] text-muted-foreground">Growth: {Math.round(d.y)}%</p>
                      <p className="text-[10px] text-muted-foreground">Funding: ${Math.round(d.z)}M</p>
                      <p className="text-[10px] text-muted-foreground">Maturity: {d.techMaturity}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Opportunities" data={timeData}>
              {timeData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getQuadrantColor(entry.quadrant)} 
                  fillOpacity={0.7}
                  stroke={getQuadrantColor(entry.quadrant)}
                  strokeWidth={1}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 text-[8px]">
        <span className="text-muted-foreground">Bubble size = Funding velocity</span>
        <span className="text-muted-foreground">•</span>
        <span className="text-muted-foreground">Color = Decision quadrant</span>
      </div>
    </div>
  );
};
