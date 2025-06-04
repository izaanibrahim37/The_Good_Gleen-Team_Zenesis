import React from 'react';
import { format } from 'date-fns';

interface MatchingCardProps {
  title: string;
  matches: Array<{
    id: string;
    name: string;
    foodType: string;
    quantity: number;
    location: string;
    date: Date;
    status: 'pending' | 'matched' | 'completed';
  }>;
  onAction: (id: string) => void;
  actionLabel: string;
}

const MatchingCard: React.FC<MatchingCardProps> = ({
  title,
  matches,
  onAction,
  actionLabel,
}) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="mt-6 space-y-4">
          {matches.map(match => (
            <div
              key={match.id}
              className="border rounded-lg p-4 hover:border-green-500 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{match.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {match.foodType} - {match.quantity} units
                  </p>
                  <p className="text-sm text-gray-500">
                    {match.location}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(match.date, 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`
                    px-2 py-1 text-xs font-medium rounded-full
                    ${match.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${match.status === 'matched' ? 'bg-blue-100 text-blue-800' : ''}
                    ${match.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                  `}>
                    {match.status}
                  </span>
                  <button
                    onClick={() => onAction(match.id)}
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                  >
                    {actionLabel}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchingCard;