import React from 'react';
import { Card, CardContent, Badge, Button } from "../ui";
import { Play, Clock, Dumbbell } from "lucide-react";

const workoutTypeColors = {
  strength: "bg-blue-100 text-blue-800 border-blue-200",
  cardio: "bg-red-100 text-red-800 border-red-200",
  flexibility: "bg-purple-100 text-purple-800 border-purple-200",
  mixed: "bg-green-100 text-green-800 border-green-200"
};

export default function WorkoutCard({ workout, onStart, index = 0 }) {
  return (
    <div
      style={{
        animationDelay: `${index * 0.1}s`,
        animation: 'fadeInUp 0.5s ease-out forwards'
      }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{workout.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`border ${workoutTypeColors[workout.type]}`}>
                  {workout.type}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{workout.estimated_duration}min</span>
                </div>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <Dumbbell className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">{workout.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {workout.exercises?.length || 0} exercises
            </div>
            <Button onClick={() => onStart(workout)} className="bg-blue-600 hover:bg-blue-700">
              <Play className="w-4 h-4 mr-2" />
              Start Workout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}