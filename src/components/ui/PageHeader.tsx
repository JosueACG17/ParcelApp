import React from 'react';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  buttonText: string;
  buttonColor?: 'blue' | 'green' | 'red' | 'purple';
  onButtonClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  buttonText,
  buttonColor = 'blue',
  onButtonClick,
  icon: Icon = Plus
}) => {
  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    red: 'bg-red-600 hover:bg-red-700',
    purple: 'bg-purple-600 hover:bg-purple-700'
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={onButtonClick}
          className={`flex items-center gap-2 px-4 py-2 ${colorClasses[buttonColor]} text-white rounded-lg transition-colors font-medium`}
        >
          <Icon className="w-4 h-4" />
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default PageHeader;