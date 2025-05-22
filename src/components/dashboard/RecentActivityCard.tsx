
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, User, BriefcaseBusiness, CheckSquare, Calendar } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'invoice' | 'customer' | 'project' | 'task' | 'meeting';
  action: string;
  entity: string;
  user: string;
  timestamp: string;
}

interface RecentActivityCardProps {
  activities: ActivityItem[];
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ activities }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'invoice':
        return <FileText className="h-5 w-5 text-darkblue-500" />;
      case 'customer':
        return <User className="h-5 w-5 text-darkyellow-500" />;
      case 'project':
        return <BriefcaseBusiness className="h-5 w-5 text-purple-500" />;
      case 'task':
        return <CheckSquare className="h-5 w-5 text-amber-500" />;
      case 'meeting':
        return <Calendar className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getActionText = (item: ActivityItem) => {
    switch (item.action) {
      case 'created':
        return <span>created a new {item.type} <strong>{item.entity}</strong></span>;
      case 'updated':
        return <span>updated {item.type} <strong>{item.entity}</strong></span>;
      case 'added':
        return <span>added new {item.type} <strong>{item.entity}</strong></span>;
      case 'completed':
        return <span>marked {item.type} <strong>{item.entity}</strong> as completed</span>;
      case 'scheduled':
        return <span>scheduled a new meeting <strong>{item.entity}</strong></span>;
      default:
        return <span>{item.action} {item.type} <strong>{item.entity}</strong></span>;
    }
  };

  return (
    <Card className="h-full gradient-card">
      <CardHeader className="pb-3">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[300px] overflow-auto scrollbar-hidden">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-md hover:bg-background/50 transition-all duration-200">
            <div className="flex-shrink-0 mt-0.5 p-1.5 bg-background rounded-full">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{activity.user}</p>
                <span className="text-xs text-muted-foreground">
                  {activity.timestamp.split(' ')[0]}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {getActionText(activity)}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
