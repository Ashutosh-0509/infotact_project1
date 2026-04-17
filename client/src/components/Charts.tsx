import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const salesData = [
  { month: 'Jan', revenue: 45000, orders: 120, growth: 5 },
  { month: 'Feb', revenue: 52000, orders: 145, growth: 8 },
  { month: 'Mar', revenue: 48000, orders: 132, growth: 12 },
  { month: 'Apr', revenue: 61000, orders: 168, growth: 15 },
  { month: 'May', revenue: 55000, orders: 152, growth: 18 },
  { month: 'Jun', revenue: 67000, orders: 185, growth: 22 },
];

const categoryData = [
  { name: 'Electronics', value: 4500, color: '#00f2ff' },
  { name: 'Clothing', value: 3200, color: '#7c3aed' },
  { name: 'Food', value: 2800, color: '#10b981' },
  { name: 'Garden', value: 2100, color: '#f59e0b' },
  { name: 'Sports', value: 1400, color: '#ef4444' },
];

const topProductsData = [
  { name: 'Headphones', sales: 1250, revenue: 62500 },
  { name: 'Smart Watch', sales: 980, revenue: 147000 },
  { name: 'Stand', sales: 875, revenue: 26250 },
  { name: 'Cable', sales: 1450, revenue: 21750 },
  { name: 'Case', sales: 1680, revenue: 25200 },
];

interface SalesChartProps {
  type?: 'revenue' | 'growth';
}

export function SalesChart({ type = 'revenue' }: SalesChartProps) {
  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={salesData}>
          <defs>
            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorGro" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
            tickFormatter={(value) => type === 'revenue' ? `₹${value/1000}k` : `${value}%`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#0a0a1a',
              border: '1px solid #00f2ff30',
              borderRadius: '16px',
              fontSize: '12px',
              boxShadow: '0 10px 30px #000000'
            }}
            itemStyle={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10px' }}
          />
          {type === 'revenue' ? (
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#00f2ff" 
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRev)"
              animationDuration={1500}
            />
          ) : (
            <Area 
              type="monotone" 
              dataKey="growth" 
              stroke="#a855f7" 
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorGro)"
              animationDuration={1500}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryChart() {
  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={8}
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                stroke="none"
                style={{ filter: `drop-shadow(0 0 5px ${entry.color}40)` }}
              />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{
              backgroundColor: '#0a0a1a',
              border: '1px solid #ffffff10',
              borderRadius: '16px',
              fontSize: '12px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TopProductsChart() {
  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={topProductsData} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#ffffff', fontSize: 10, fontWeight: 'black' }}
            width={80}
          />
          <Tooltip 
             contentStyle={{
              backgroundColor: '#0a0a1a',
              border: '1px solid #00f2ff30',
              borderRadius: '16px',
            }}
          />
          <Bar 
            dataKey="sales" 
            fill="#00f2ff" 
            radius={[0, 10, 10, 0]} 
            barSize={20}
            style={{ filter: 'drop-shadow(0 0 10px #00f2ff30)' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}