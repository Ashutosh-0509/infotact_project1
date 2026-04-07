import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const salesData = [
  { month: 'Jan', revenue: 45000, orders: 120 },
  { month: 'Feb', revenue: 52000, orders: 145 },
  { month: 'Mar', revenue: 48000, orders: 132 },
  { month: 'Apr', revenue: 61000, orders: 168 },
  { month: 'May', revenue: 55000, orders: 152 },
  { month: 'Jun', revenue: 67000, orders: 185 },
];

const categoryData = [
  { name: 'Electronics', value: 4500, color: 'oklch(0.55 0.18 220)' },
  { name: 'Clothing', value: 3200, color: 'oklch(0.60 0.16 180)' },
  { name: 'Food & Beverage', value: 2800, color: 'oklch(0.65 0.15 150)' },
  { name: 'Home & Garden', value: 2100, color: 'oklch(0.68 0.14 50)' },
  { name: 'Sports', value: 1400, color: 'oklch(0.62 0.18 15)' },
];

const topProductsData = [
  { name: 'Wireless Headphones', sales: 1250, revenue: 62500 },
  { name: 'Smart Watch', sales: 980, revenue: 147000 },
  { name: 'Laptop Stand', sales: 875, revenue: 26250 },
  { name: 'USB-C Cable', sales: 1450, revenue: 21750 },
  { name: 'Phone Case', sales: 1680, revenue: 25200 },
];

export function SalesChart() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Revenue Trends</h3>
        <p className="text-sm text-muted-foreground mt-1">Monthly revenue and order volume</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 220)" />
          <XAxis 
            dataKey="month" 
            stroke="oklch(0.48 0.02 220)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="oklch(0.48 0.02 220)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'oklch(0.98 0.004 220)',
              border: '1px solid oklch(0.88 0.01 220)',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="oklch(0.52 0.18 220)" 
            strokeWidth={3}
            dot={{ fill: 'oklch(0.52 0.18 220)', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="orders" 
            stroke="oklch(0.60 0.16 180)" 
            strokeWidth={3}
            dot={{ fill: 'oklch(0.60 0.16 180)', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryChart() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Product Distribution</h3>
        <p className="text-sm text-muted-foreground mt-1">Sales by category</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'oklch(0.98 0.004 220)',
              border: '1px solid oklch(0.88 0.01 220)',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TopProductsChart() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Top Selling Products</h3>
        <p className="text-sm text-muted-foreground mt-1">Best performers this month</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topProductsData}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 220)" />
          <XAxis 
            dataKey="name" 
            stroke="oklch(0.48 0.02 220)"
            style={{ fontSize: '11px' }}
            angle={-15}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="oklch(0.48 0.02 220)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'oklch(0.98 0.004 220)',
              border: '1px solid oklch(0.88 0.01 220)',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
          />
          <Bar 
            dataKey="sales" 
            fill="oklch(0.65 0.15 150)" 
            radius={[8, 8, 0, 0]}
          />
          <Bar 
            dataKey="revenue" 
            fill="oklch(0.52 0.18 220)" 
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}