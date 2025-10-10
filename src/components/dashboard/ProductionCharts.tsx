import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useParcelas } from '../../hooks/useParcelasData';

interface CropData {
  name: string;
  value: number;
  area: number;
  color: string;
  [key: string]: string | number;
}

interface ProductionData {
  month: string;
  [key: string]: string | number;
}

const ProductionCharts: React.FC = () => {
  const { parcelas } = useParcelas();
  // const { cultivos } = useCultivos(); // Disponible para uso futuro

  // Generar datos de cultivos basados en datos reales
  const cropData: CropData[] = useMemo(() => {
    const cultivoCounts: Record<string, number> = {};
    
    // Contar cultivos en todas las parcelas activas
    parcelas
      .filter(p => !p.isDeleted)
      .forEach(parcela => {
        parcela.nombresCultivos.forEach(cultivo => {
          cultivoCounts[cultivo] = (cultivoCounts[cultivo] || 0) + 1;
        });
      });

    const totalCultivos = Object.values(cultivoCounts).reduce((sum, count) => sum + count, 0);
    const colors = ['#22c55e', '#f59e0b', '#3b82f6', '#f97316', '#8b5cf6', '#ef4444'];
    
    return Object.entries(cultivoCounts).map(([name, count], index) => ({
      name,
      value: Math.round((count / totalCultivos) * 100),
      area: count * 10, // Simular área en hectáreas
      color: colors[index % colors.length]
    }));
  }, [parcelas]);

  // Generar datos de producción simulados
  const productionData: ProductionData[] = useMemo(() => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    const cultivoNames = cropData.map(c => c.name.toLowerCase().replace(/\s+/g, ''));
    
    return months.map(month => {
      const data: ProductionData = { month };
      cultivoNames.forEach(cultivo => {
        // Simular producción mensual variable
        data[cultivo] = Math.floor(Math.random() * 100) + 50;
      });
      return data;
    });
  }, [cropData]);

  // Si no hay datos, mostrar datos de ejemplo
  const fallbackCropData: CropData[] = [
    { name: 'Maíz', value: 35, area: 54.8, color: '#22c55e' },
    { name: 'Trigo', value: 25, area: 39.2, color: '#f59e0b' },
    { name: 'Soja', value: 25, area: 39.2, color: '#3b82f6' },
    { name: 'Girasol', value: 15, area: 23.6, color: '#f97316' }
  ];

  const fallbackProductionData: ProductionData[] = [
    { month: 'Ene', maiz: 120, trigo: 80, soja: 95, girasol: 60 },
    { month: 'Feb', maiz: 135, trigo: 85, soja: 100, girasol: 65 },
    { month: 'Mar', maiz: 150, trigo: 90, soja: 110, girasol: 70 },
    { month: 'Abr', maiz: 165, trigo: 95, soja: 105, girasol: 75 },
    { month: 'May', maiz: 180, trigo: 100, soja: 120, girasol: 80 },
    { month: 'Jun', maiz: 195, trigo: 110, soja: 125, girasol: 85 }
  ];

  const displayCropData = cropData.length > 0 ? cropData : fallbackCropData;
  const displayProductionData = productionData.length > 0 ? productionData : fallbackProductionData;

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
              data={displayCropData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {displayCropData.map((entry, index) => (
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
                `${value}% (${displayCropData.find(c => c.name === name)?.area} ha)`,
                name
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Leyenda personalizada */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {displayCropData.map((crop, index) => (
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
          <BarChart data={displayProductionData}>
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