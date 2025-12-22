import React, { ReactNode } from 'react';
import { Video as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'increase' | 'decrease';
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType,
  color = 'blue' 
}: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  const changeColorClasses = {
    increase: 'text-green-600',
    decrease: 'text-red-600'
  };

  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="text-sm font-medium text-gray-500">{title}</div>
            <div className="text-2xl font-semibold text-gray-900">{value}</div>
            {change && (
              <div className={`text-sm ${changeType ? changeColorClasses[changeType] : 'text-gray-500'}`}>
                {change}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}