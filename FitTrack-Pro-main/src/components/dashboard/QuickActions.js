import { Card, CardContent, CardHeader, CardTitle, Button } from "../ui";
import { Play, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";

const actions = [
  {
    title: "Start Workout",
    description: "Begin a new training session",
    icon: Play,
    color: "bg-blue-600 hover:bg-blue-700",
    url: "Workouts",
  },
  {
    title: "Set New Goal",
    description: "Define your fitness targets",
    icon: Target,
    color: "bg-green-600 hover:bg-green-700",
    url: "Goals",
  },
  {
    title: "View Progress",
    description: "Track your improvements",
    icon: TrendingUp,
    color: "bg-purple-600 hover:bg-purple-700",
    url: "Progress",
  },
];

export default function QuickActions() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {actions.map((action, index) => (
            <div
              key={action.title}
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: "fadeInUp 0.5s ease-out forwards",
              }}
            >
              <Link to={createPageUrl(action.url)}>
                <Button
                  className={`w-full justify-start h-auto py-4 px-4 ${action.color} text-white shadow-sm`}
                  variant="default"
                >
                  <action.icon className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">{action.title}</div>
                    <div className="text-xs opacity-90">
                      {action.description}
                    </div>
                  </div>
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
