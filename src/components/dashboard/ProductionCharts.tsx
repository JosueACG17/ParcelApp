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

  // Generar datos de producción simulados basados en cultivos reales
  const productionData: ProductionData[] = useMemo(() => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    
    // Si no hay cultivos reales, usar datos mínimos básicos
    if (cropData.length === 0) {
      return months.map(month => ({
        month,
        maiz: Math.floor(Math.random() * 50) + 70,
        soja: Math.floor(Math.random() * 50) + 60
      }));
    }
    
    return months.map(month => {
      const data: ProductionData = { month };
      cropData.forEach(cultivo => {
        const cultivoKey = cultivo.name.toLowerCase().replace(/\s+/g, '');
        // Simular producción mensual variable basada en el área del cultivo
        const baseProduction = cultivo.area * 2; // Factor de producción
        data[cultivoKey] = Math.floor(Math.random() * 40) + baseProduction;
      });
      return data;
    });
  }, [cropData]);

  // Datos por defecto si no hay cultivos (solo mostrará si realmente no hay nada)
  const defaultCropData: CropData[] = cropData.length > 0 ? cropData : [
    { name: 'Maíz', value: 60, area: 10, color: '#22c55e' },
    { name: 'Soja', value: 40, area: 10, color: '#f59e0b' }
  ];

  const displayCropData = defaultCropData;
  const displayProductionData = productionData;

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
            {displayCropData.map((crop) => (
              <Bar 
                key={crop.name}
                dataKey={crop.name.toLowerCase().replace(/\s+/g, '')} 
                fill={crop.color} 
                name={crop.name} 
                radius={[2, 2, 0, 0]} 
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductionCharts;