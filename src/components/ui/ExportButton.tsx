import React from 'react';
import { Download, FileText, FileSpreadsheet, Image } from 'lucide-react';

interface ExportButtonProps {
  onExport: (format: 'pdf' | 'excel' | 'csv' | 'png') => void;
  data?: unknown;
  filename?: string;
  className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ 
  onExport, 
  data = null, 
  filename = 'export',
  className = '' 
}) => {
  // Para evitar warning de variables no usadas
  console.log(`Preparando exportación de ${data ? 'datos' : 'información'} como ${filename}`);
  
  const [isOpen, setIsOpen] = React.useState(false);

  const exportOptions = [
    {
      format: 'pdf' as const,
      label: 'PDF',
      icon: <FileText className="w-4 h-4" />,
      color: 'text-red-600'
    },
    {
      format: 'excel' as const,
      label: 'Excel',
      icon: <FileSpreadsheet className="w-4 h-4" />,
      color: 'text-green-600'
    },
    {
      format: 'csv' as const,
      label: 'CSV',
      icon: <FileText className="w-4 h-4" />,
      color: 'text-blue-600'
    },
    {
      format: 'png' as const,
      label: 'Imagen',
      icon: <Image className="w-4 h-4" />,
      color: 'text-purple-600'
    }
  ];

  const handleExport = (format: 'pdf' | 'excel' | 'csv' | 'png') => {
    onExport(format);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium ${className}`}
      >
        <Download className="w-4 h-4" />
        Exportar
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-2">
              {exportOptions.map((option) => (
                <button
                  key={option.format}
                  onClick={() => handleExport(option.format)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <span className={option.color}>
                    {option.icon}
                  </span>
                  <span className="text-gray-700">
                    Exportar como {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButton;