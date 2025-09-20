
import React, { useState, useEffect, useCallback } from "react";
import { Workout, WorkoutSet, Goal } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TrendingUp, Target, Calendar, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Progress() {
  const [workouts, setWorkouts] = useState([]);
  const [workoutSets, setWorkoutSets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  const prepareWeeklyData = (workouts, sets) => {
    const weeks = {};
    
    workouts.forEach(workout => {
      const date = new Date(workout.date);
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeks[weekKey]) {
        weeks[weekKey] = {
          week: weekKey,
          workouts: 0,
          volume: 0,
          duration: 0
        };
      }
      
      weeks[weekKey].workouts += 1;
      weeks[weekKey].duration += workout.duration_minutes || 0;
      
      // Calculate volume for this workout
      const workoutSets = sets.filter(set => set.workout_id === workout.id);
      const workoutVolume = workoutSets.reduce((sum, set) => 
        sum + ((set.weight || 0) * (set.reps || 0)), 0
      );
      weeks[weekKey].volume += workoutVolume;
    });

    return Object.values(weeks).sort((a, b) => new Date(a.week) - new Date(b.week)).slice(-8);
  };

  const loadProgressData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [workoutsData, setsData, goalsData] = await Promise.all([
        Workout.list('-date', 30),
        WorkoutSet.list('-created_date', 200),
        Goal.list('-created_date')
      ]);

      setWorkouts(workoutsData);
      setWorkoutSets(setsData);
      setGoals(goalsData);

      // Prepare chart data - weekly workout volume
      // prepareWeeklyData is called here, but it's defined within the component scope.
      // If prepareWeeklyData itself depended on state/props, it would need to be memoized or passed as a dependency.
      // In this case, it only depends on its arguments (workoutsData, setsData), so it's fine.
      const weeklyData = prepareWeeklyData(workoutsData, setsData);
      setChartData(weeklyData);
    } catch (error) {
      console.error('Error loading progress data:', error);
    }
    setIsLoading(false);
  }, []); // Empty dependency array means this callback is memoized once and doesn't change unless dependencies do.

  useEffect(() => {
    loadProgressData();
  }, [loadProgressData]); // Now useEffect correctly depends on the memoized loadProgressData

  const calculateStreak = () => {
    if (workouts.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    // Sort workouts by date descending
    const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    for (let workout of sortedWorkouts) {
      const workoutDate = new Date(workout.date);
      workoutDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= streak + 1) {
        streak++;
        currentDate = workoutDate;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const completedGoals = goals.filter(goal => goal.status === 'completed').length;
  const activeGoals = goals.filter(goal => goal.status === 'active').length;
  const totalVolume = workoutSets.reduce((sum, set) => sum + ((set.weight || 0) * (set.reps || 0)), 0);
  const streak = calculateStreak();

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid md:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Tracking</h1>
          <p className="text-gray-600">Monitor your fitness journey and achievements</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{workouts.length}</div>
                <div className="text-sm text-gray-600">Total Workouts</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{streak}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{Math.round(totalVolume).toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Volume (lbs)</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{completedGoals}</div>
                <div className="text-sm text-gray-600">Goals Achieved</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Weekly Volume Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="week" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value) => [`${Math.round(value).toLocaleString()} lbs`, 'Volume']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="volume" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Weekly Workout Frequency</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="week" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value) => [`${value} workouts`, 'Count']}
                    />
                    <Bar dataKey="workouts" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Active Goals */}
        {activeGoals > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Active Goals ({activeGoals})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals.filter(goal => goal.status === 'active').slice(0, 5).map((goal, index) => (
                    <div key={goal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {goal.current_value || 0} / {goal.target_value} {goal.unit}
                        </div>
                        <div className="text-xs text-gray-500">
                          Target: {new Date(goal.target_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
