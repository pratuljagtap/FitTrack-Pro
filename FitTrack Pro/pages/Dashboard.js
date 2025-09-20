import React, { useState, useEffect } from "react";
import { Workout, Goal, WorkoutSet } from "@/entities/all";
import { 
  Calendar,
  Clock,
  Target,
  Zap,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";

import StatsCard from "../components/dashboard/StatsCard";
import RecentWorkouts from "../components/dashboard/RecentWorkouts";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [workoutSets, setWorkoutSets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    thisWeekWorkouts: 0,
    totalVolume: 0,
    activeGoals: 0,
    averageWorkoutTime: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [workoutsData, goalsData, setsData] = await Promise.all([
        Workout.list('-date', 10),
        Goal.list('-created_date'),
        WorkoutSet.list('-created_date', 100)
      ]);

      setWorkouts(workoutsData);
      setGoals(goalsData);
      setWorkoutSets(setsData);

      // Calculate stats
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const thisWeekWorkouts = workoutsData.filter(w => new Date(w.date) >= weekAgo);
      const totalVolume = setsData.reduce((sum, set) => sum + ((set.weight || 0) * (set.reps || 0)), 0);
      const activeGoals = goalsData.filter(g => g.status === 'active').length;
      const avgTime = workoutsData.length > 0 
        ? workoutsData.reduce((sum, w) => sum + (w.duration_minutes || 0), 0) / workoutsData.length
        : 0;

      setStats({
        totalWorkouts: workoutsData.length,
        thisWeekWorkouts: thisWeekWorkouts.length,
        totalVolume,
        activeGoals,
        averageWorkoutTime: Math.round(avgTime)
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome Back! 💪
          </h1>
          <p className="text-lg text-gray-600">Ready to crush your fitness goals today?</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Workouts"
            value={stats.totalWorkouts}
            icon={Calendar}
            color="bg-blue-500"
            delay={0}
          />
          <StatsCard
            title="This Week"
            value={stats.thisWeekWorkouts}
            icon={Zap}
            color="bg-green-500"
            trend={stats.thisWeekWorkouts > 0 ? `${stats.thisWeekWorkouts} sessions` : 'Start your week!'}
            delay={0.1}
          />
          <StatsCard
            title="Total Volume"
            value={Math.round(stats.totalVolume).toLocaleString()}
            unit="lbs"
            icon={TrendingUp}
            color="bg-purple-500"
            delay={0.2}
          />
          <StatsCard
            title="Active Goals"
            value={stats.activeGoals}
            icon={Target}
            color="bg-orange-500"
            delay={0.3}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentWorkouts workouts={workouts} isLoading={isLoading} />
          </div>
          
          <div className="space-y-6">
            <QuickActions />
            
            {stats.averageWorkoutTime > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <StatsCard
                  title="Avg Workout Time"
                  value={stats.averageWorkoutTime}
                  unit="min"
                  icon={Clock}
                  color="bg-indigo-500"
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
