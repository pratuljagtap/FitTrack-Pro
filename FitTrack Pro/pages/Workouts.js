import React, { useState, useEffect } from "react";
import { Workout } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

import WorkoutCard from "../components/workouts/WorkoutCard";

// Sample workout templates
const workoutTemplates = [
  {
    id: 'template-1',
    name: 'Push Day',
    type: 'strength',
    description: 'Chest, shoulders, and triceps focused workout',
    estimated_duration: 60,
    exercises: ['Bench Press', 'Shoulder Press', 'Chest Fly', 'Tricep Dips']
  },
  {
    id: 'template-2',
    name: 'Pull Day',
    type: 'strength',
    description: 'Back and biceps focused workout',
    estimated_duration: 55,
    exercises: ['Pull-ups', 'Barbell Row', 'Lat Pulldown', 'Bicep Curls']
  },
  {
    id: 'template-3',
    name: 'Leg Day',
    type: 'strength',
    description: 'Lower body strength and power',
    estimated_duration: 65,
    exercises: ['Squats', 'Deadlifts', 'Lunges', 'Calf Raises']
  },
  {
    id: 'template-4',
    name: 'HIIT Cardio',
    type: 'cardio',
    description: 'High intensity interval training',
    estimated_duration: 30,
    exercises: ['Burpees', 'Mountain Climbers', 'Jump Squats', 'Plank']
  },
  {
    id: 'template-5',
    name: 'Full Body Flow',
    type: 'mixed',
    description: 'Complete body workout with varied exercises',
    estimated_duration: 45,
    exercises: ['Deadlifts', 'Push-ups', 'Squats', 'Rows']
  }
];

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    setIsLoading(true);
    try {
      const data = await Workout.list('-date');
      setWorkouts(data);
    } catch (error) {
      console.error('Error loading workouts:', error);
    }
    setIsLoading(false);
  };

  const startWorkout = async (workoutTemplate) => {
    try {
      const newWorkout = await Workout.create({
        name: workoutTemplate.name,
        date: new Date().toISOString(),
        workout_type: workoutTemplate.type,
        notes: `Started from template: ${workoutTemplate.name}`
      });
      
      // In a real app, this would navigate to an active workout screen
      console.log('Started workout:', newWorkout);
      loadWorkouts(); // Refresh the list
    } catch (error) {
      console.error('Error starting workout:', error);
    }
  };

  const filteredTemplates = workoutTemplates.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workout.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || workout.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Workouts</h1>
            <p className="text-gray-600">Choose a workout to get started</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Custom Workout
          </Button>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search workouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'strength', 'cardio', 'mixed'].map((type) => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                onClick={() => setFilterType(type)}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Workout Templates */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((workout, index) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onStart={startWorkout}
              index={index}
            />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Filter className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No workouts found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}

        {/* Recent Workouts History */}
        {workouts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Sessions</h2>
            <div className="space-y-4">
              {workouts.slice(0, 5).map((workout, index) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{workout.name}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(workout.date).toLocaleDateString()} • 
                        {workout.duration_minutes ? ` ${workout.duration_minutes}min` : ' Duration not recorded'}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
