import React, { useState, useEffect } from "react";
import { Exercise } from "../entities/all";
import { Card, CardContent, Badge, Input, Button } from "../components/ui";
import { Search, Filter, Dumbbell, User, Zap } from "lucide-react";

const muscleGroupColors = {
  chest: "bg-red-100 text-red-800 border-red-200",
  back: "bg-blue-100 text-blue-800 border-blue-200",
  shoulders: "bg-purple-100 text-purple-800 border-purple-200",
  arms: "bg-orange-100 text-orange-800 border-orange-200",
  legs: "bg-green-100 text-green-800 border-green-200",
  core: "bg-yellow-100 text-yellow-800 border-yellow-200",
  cardio: "bg-pink-100 text-pink-800 border-pink-200",
  full_body: "bg-indigo-100 text-indigo-800 border-indigo-200",
};

const difficultyColors = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
};

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMuscle, setFilterMuscle] = useState("all");
  const [filterEquipment, setFilterEquipment] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    setIsLoading(true);
    try {
      const data = await Exercise.list();
      setExercises(data);
    } catch (error) {
      console.error("Error loading exercises:", error);
    }
    setIsLoading(false);
  };

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.instructions.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscle =
      filterMuscle === "all" || exercise.muscle_group === filterMuscle;
    const matchesEquipment =
      filterEquipment === "all" || exercise.equipment === filterEquipment;
    return matchesSearch && matchesMuscle && matchesEquipment;
  });

  const muscleGroups = [...new Set(exercises.map((e) => e.muscle_group))];
  const equipmentTypes = [...new Set(exercises.map((e) => e.equipment))];

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Exercise Library
          </h1>
          <p className="text-gray-600">
            Discover exercises with proper form and technique
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-lg py-6"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Muscle:
              </span>
              <Button
                variant={filterMuscle === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterMuscle("all")}
              >
                All
              </Button>
              {muscleGroups.map((muscle) => (
                <Button
                  key={muscle}
                  variant={filterMuscle === muscle ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterMuscle(muscle)}
                  className="capitalize"
                >
                  {muscle.replace("_", " ")}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Dumbbell className="w-4 h-4" />
                Equipment:
              </span>
              <Button
                variant={filterEquipment === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterEquipment("all")}
              >
                All
              </Button>
              {equipmentTypes.map((equipment) => (
                <Button
                  key={equipment}
                  variant={
                    filterEquipment === equipment ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setFilterEquipment(equipment)}
                  className="capitalize"
                >
                  {equipment.replace("_", " ")}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Exercise Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise, index) => (
            <div
              key={exercise.id}
              style={{
                animationDelay: `${index * 0.05}s`,
                animation: "fadeInUp 0.5s ease-out forwards",
              }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-lg text-gray-900 flex-1 mr-2">
                      {exercise.name}
                    </h3>
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Dumbbell className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge
                      className={`border ${muscleGroupColors[exercise.muscle_group]}`}
                    >
                      {exercise.muscle_group.replace("_", " ")}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {exercise.equipment.replace("_", " ")}
                    </Badge>
                    {exercise.difficulty && (
                      <Badge className={difficultyColors[exercise.difficulty]}>
                        {exercise.difficulty}
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {exercise.instructions}
                  </p>

                  {exercise.image_url && (
                    <div className="mt-4">
                      <img
                        src={exercise.image_url}
                        alt={exercise.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {filteredExercises.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No exercises found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
