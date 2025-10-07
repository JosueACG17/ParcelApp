import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface CropData {
  name: string;
  value: number;
  area: number;
  color: string;
  [key: string]: string | number;
}

interface ProductionData {
  month: string;
  maiz: number;
  trigo: number;
  soja: number;
  girasol: number;
}

const cropData: CropData[] = [
  { name: 'Maíz', value: 35, area: 54.8, color: '#22c55e' },
  { name: 'Trigo', value: 25, area: 39.2, color: '#f59e0b' },
  { name: 'Soja', value: 25, area: 39.2, color: '#3b82f6' },
  { name: 'Girasol', value: 15, area: 23.6, color: '#f97316' }
];

const productionData: ProductionData[] = [
  { month: 'Ene', maiz: 120, trigo: 80, soja: 95, girasol: 60 },
  { month: 'Feb', maiz: 135, trigo: 85, soja: 100, girasol: 65 },
  { month: 'Mar', maiz: 150, trigo: 90, soja: 110, girasol: 70 },
  { month: 'Abr', maiz: 165, trigo: 95, soja: 105, girasol: 75 },
  { month: 'May', maiz: 180, trigo: 100, soja: 120, girasol: 80 },
  { month: 'Jun', maiz: 195, trigo: 110, soja: 125, girasol: 85 }
];

const ProductionCharts: React.FC = () => {
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-semibold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Distribución de Cultivos - Gráfico de Pastel */}
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          Distribución de Cultivos
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={cropData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {cropData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number, name: string) => [
                `${value}% (${cropData.find(c => c.name === name)?.area} ha)`,
                name
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Leyenda personalizada */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {cropData.map((crop, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: crop.color }}
              ></div>
              <span className="text-sm text-gray-600">
                {crop.name} - {crop.area} ha
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Producción Mensual - Gráfico de Barras */}
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        Producción Mensual (Toneladas)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Bar dataKey="maiz" fill="#22c55e" name="Maíz" radius={[2, 2, 0, 0]} />
            <Bar dataKey="trigo" fill="#f59e0b" name="Trigo" radius={[2, 2, 0, 0]} />
            <Bar dataKey="soja" fill="#3b82f6" name="Soja" radius={[2, 2, 0, 0]} />
            <Bar dataKey="girasol" fill="#f97316" name="Girasol" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductionCharts;