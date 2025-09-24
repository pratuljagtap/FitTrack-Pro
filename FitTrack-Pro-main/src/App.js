import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Exercises from "./pages/Exercises";
import Goals from "./pages/Goals";
import Progress from "./pages/Progress";
import "./App.css";

// Mock entities - In a real app, these would connect to a database
window.mockData = {
  exercises: [],
  workouts: [],
  goals: [],
  workoutSets: [],
};

// Mock Entity classes for demonstration
const createMockEntity = (entityName) => ({
  async list(orderBy = "", limit = null) {
    const items = window.mockData[entityName.toLowerCase() + "s"] || [];
    let sorted = [...items];

    if (orderBy.startsWith("-")) {
      const field = orderBy.substring(1);
      sorted.sort((a, b) => new Date(b[field] || 0) - new Date(a[field] || 0));
    }

    return limit ? sorted.slice(0, limit) : sorted;
  },

  async create(data) {
    const newItem = {
      id: Date.now().toString(),
      created_date: new Date().toISOString(),
      ...data,
    };

    const entityKey = entityName.toLowerCase() + "s";
    if (!window.mockData[entityKey]) {
      window.mockData[entityKey] = [];
    }
    window.mockData[entityKey].push(newItem);
    return newItem;
  },

  async findById(id) {
    const items = window.mockData[entityName.toLowerCase() + "s"] || [];
    return items.find((item) => item.id === id);
  },

  async update(id, data) {
    const items = window.mockData[entityName.toLowerCase() + "s"] || [];
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...data };
      return items[index];
    }
    return null;
  },
});

// Create mock entities
window.Exercise = createMockEntity("Exercise");
window.Workout = createMockEntity("Workout");
window.Goal = createMockEntity("Goal");
window.WorkoutSet = createMockEntity("WorkoutSet");

// Initialize with sample data
const initializeSampleData = () => {
  // Sample exercises
  const sampleExercises = [
    {
      id: "1",
      name: "Bench Press",
      muscle_group: "chest",
      equipment: "barbell",
      instructions: "Lie on bench, lower bar to chest, press up with control.",
      difficulty: "intermediate",
    },
    {
      id: "2",
      name: "Squats",
      muscle_group: "legs",
      equipment: "barbell",
      instructions:
        "Stand with feet shoulder-width apart, lower hips back and down, return to standing.",
      difficulty: "beginner",
    },
    {
      id: "3",
      name: "Pull-ups",
      muscle_group: "back",
      equipment: "bodyweight",
      instructions:
        "Hang from bar, pull body up until chin clears bar, lower with control.",
      difficulty: "advanced",
    },
    {
      id: "4",
      name: "Push-ups",
      muscle_group: "chest",
      equipment: "bodyweight",
      instructions:
        "Start in plank position, lower body to floor, push back up.",
      difficulty: "beginner",
    },
    {
      id: "5",
      name: "Deadlifts",
      muscle_group: "back",
      equipment: "barbell",
      instructions:
        "Stand with feet hip-width apart, hinge at hips, lift bar keeping back straight.",
      difficulty: "intermediate",
    },
  ];

  // Sample workouts
  const sampleWorkouts = [
    {
      id: "1",
      name: "Upper Body Strength",
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      duration_minutes: 45,
      workout_type: "strength",
      total_volume: 2500,
      calories_burned: 320,
    },
    {
      id: "2",
      name: "HIIT Cardio",
      date: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
      duration_minutes: 30,
      workout_type: "cardio",
      calories_burned: 280,
    },
    {
      id: "3",
      name: "Lower Body Power",
      date: new Date(Date.now() - 4 * 86400000).toISOString(), // 4 days ago
      duration_minutes: 55,
      workout_type: "strength",
      total_volume: 3200,
      calories_burned: 380,
    },
  ];

  // Sample goals
  const sampleGoals = [
    {
      id: "1",
      title: "Bench Press 200 lbs",
      description: "Increase bench press to 200 pounds for 1 rep max",
      goal_type: "strength",
      target_value: 200,
      current_value: 175,
      unit: "lbs",
      target_date: new Date(Date.now() + 60 * 86400000)
        .toISOString()
        .split("T")[0], // 60 days from now
      status: "active",
    },
    {
      id: "2",
      title: "Workout 4x per week",
      description: "Maintain consistent workout schedule",
      goal_type: "habit",
      target_value: 4,
      current_value: 3,
      unit: "sessions/week",
      target_date: new Date(Date.now() + 30 * 86400000)
        .toISOString()
        .split("T")[0],
      status: "active",
    },
  ];

  // Sample workout sets
  const sampleSets = [
    {
      id: "1",
      workout_id: "1",
      exercise_id: "1",
      exercise_name: "Bench Press",
      set_number: 1,
      reps: 10,
      weight: 155,
      rest_seconds: 90,
    },
    {
      id: "2",
      workout_id: "1",
      exercise_id: "1",
      exercise_name: "Bench Press",
      set_number: 2,
      reps: 8,
      weight: 165,
      rest_seconds: 90,
    },
    {
      id: "3",
      workout_id: "1",
      exercise_id: "4",
      exercise_name: "Push-ups",
      set_number: 1,
      reps: 15,
      weight: 0,
      rest_seconds: 60,
    },
  ];

  // Initialize data if not already present
  if (!window.mockData.exercises.length) {
    window.mockData.exercises = sampleExercises;
  }
  if (!window.mockData.workouts.length) {
    window.mockData.workouts = sampleWorkouts;
  }
  if (!window.mockData.goals.length) {
    window.mockData.goals = sampleGoals;
  }
  if (!window.mockData.workoutSets.length) {
    window.mockData.workoutSets = sampleSets;
  }
};

function App() {
  // Initialize sample data on app start
  React.useEffect(() => {
    initializeSampleData();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <Layout currentPageName="Dashboard">
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/workouts"
            element={
              <Layout currentPageName="Workouts">
                <Workouts />
              </Layout>
            }
          />
          <Route
            path="/exercises"
            element={
              <Layout currentPageName="Exercises">
                <Exercises />
              </Layout>
            }
          />
          <Route
            path="/goals"
            element={
              <Layout currentPageName="Goals">
                <Goals />
              </Layout>
            }
          />
          <Route
            path="/progress"
            element={
              <Layout currentPageName="Progress">
                <Progress />
              </Layout>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
