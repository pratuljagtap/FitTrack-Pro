import React, { useState, useEffect } from "react";
import { Goal } from "../entities/all";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Progress } from "../components/ui";
import { Plus, Target, Calendar, TrendingUp, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

const goalTypeColors = {
  weight_loss: "bg-red-100 text-red-800 border-red-200",
  muscle_gain: "bg-blue-100 text-blue-800 border-blue-200",
  strength: "bg-purple-100 text-purple-800 border-purple-200",
  endurance: "bg-green-100 text-green-800 border-green-200",
  flexibility: "bg-yellow-100 text-yellow-800 border-yellow-200",
  habit: "bg-orange-100 text-orange-800 border-orange-200"
};

const statusColors = {
  active: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  paused: "bg-gray-100 text-gray-800"
};

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal_type: 'strength',
    target_value: '',
    current_value: 0,
    unit: '',
    target_date: ''
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    setIsLoading(true);
    try {
      const data = await Goal.list('-created_date');
      setGoals(data);
    } catch (error) {
      console.error('Error loading goals:', error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Goal.create(formData);
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        goal_type: 'strength',
        target_value: '',
        current_value: 0,
        unit: '',
        target_date: ''
      });
      loadGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const calculateProgress = (goal) => {
    if (!goal.target_value || goal.target_value === 0) return 0;
    return Math.min((goal.current_value || 0) / goal.target_value * 100, 100);
  };

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid md:grid-cols-2 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Goals</h1>
            <p className="text-gray-600">Set and track your fitness objectives</p>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Goal
          </Button>
        </div>

        {/* Goal Form */}
        {showForm && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Create New Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g., Bench Press 200 lbs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Goal Type</label>
                      <select
                        value={formData.goal_type}
                        onChange={(e) => setFormData({...formData, goal_type: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="strength">Strength</option>
                        <option value="muscle_gain">Muscle Gain</option>
                        <option value="weight_loss">Weight Loss</option>
                        <option value="endurance">Endurance</option>
                        <option value="flexibility">Flexibility</option>
                        <option value="habit">Habit</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <Input
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe your goal in detail"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Target Value</label>
                      <Input
                        type="number"
                        value={formData.target_value}
                        onChange={(e) => setFormData({...formData, target_value: parseFloat(e.target.value)})}
                        placeholder="200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                      <Input
                        value={formData.unit}
                        onChange={(e) => setFormData({...formData, unit: e.target.value})}
                        placeholder="lbs, kg, minutes, reps"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
                      <Input
                        type="date"
                        value={formData.target_date}
                        onChange={(e) => setFormData({...formData, target_date: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Create Goal
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{activeGoals.length}</div>
                <div className="text-sm text-gray-600">Active Goals</div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{completedGoals.length}</div>
                <div className="text-sm text-gray-600">Completed Goals</div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {activeGoals.length > 0 ? 
                    Math.round(activeGoals.reduce((sum, goal) => sum + calculateProgress(goal), 0) / activeGoals.length) : 0}%
                </div>
                <div className="text-sm text-gray-600">Avg Progress</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Goals</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {activeGoals.map((goal, index) => (
                <div
                  key={goal.id}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fadeInUp 0.5s ease-out forwards'
                  }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-1">{goal.title}</h3>
                          <p className="text-gray-600 text-sm">{goal.description}</p>
                        </div>
                        <Badge className={`border ${goalTypeColors[goal.goal_type]}`}>
                          {goal.goal_type.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Progress</span>
                            <span className="text-sm font-medium">
                              {goal.current_value || 0} / {goal.target_value} {goal.unit}
                            </span>
                          </div>
                          <Progress value={calculateProgress(goal)} className="h-2" />
                          <div className="text-center mt-1">
                            <span className="text-sm font-medium text-blue-600">
                              {Math.round(calculateProgress(goal))}% Complete
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Due {format(new Date(goal.target_date), "MMM d, yyyy")}</span>
                          </div>
                          <Badge className={statusColors[goal.status]}>
                            {goal.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Completed Goals</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedGoals.map((goal, index) => (
                <div
                  key={goal.id}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fadeInUp 0.5s ease-out forwards'
                  }}
                >
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                      <div className="text-sm text-green-700">
                        Achieved {goal.target_value} {goal.unit}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}

        {goals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Target className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No goals set yet</h3>
            <p className="text-gray-600 mb-4">Start setting fitness goals to track your progress</p>
            <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Goal
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}