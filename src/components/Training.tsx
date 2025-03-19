import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { format } from 'date-fns';
import { Dumbbell, HeartPulse, Activity, Utensils, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Training = () => {
  const [workouts, setWorkouts] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainingData();
  }, []);

  const fetchTrainingData = async () => {
    try {
      const { data: athleteData } = await supabase
        .from('athletes')
        .select('id')
        .single();
      
      if (athleteData) {
        const { data: workoutData } = await supabase
          .from('workout_plans')
          .select('*')
          .eq('athlete_id', athleteData.id)
          .order('date', { ascending: true });
        
        const { data: nutritionData } = await supabase
          .from('nutrition_plans')
          .select('*')
          .eq('athlete_id', athleteData.id)
          .order('date', { ascending: true });

        if (workoutData) setWorkouts(workoutData);
        if (nutritionData) setNutrition(nutritionData);
      }
    } catch (error) {
      console.error('Error fetching training data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWorkoutChartData = () => {
    return {
      labels: workouts.map(w => format(new Date(w.date), 'MMM d')),
      datasets: [{
        label: 'Workout Intensity',
        data: workouts.map(w => w.intensity),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4
      }]
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Training Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <Dumbbell className="w-6 h-6 text-red-500 mr-2" />
              <h2 className="text-xl font-semibold">Workout Progress</h2>
            </div>
            <Line data={getWorkoutChartData()} options={{ responsive: true }} />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <Utensils className="w-6 h-6 text-green-500 mr-2" />
            <h2 className="text-xl font-semibold">Nutrition & Hydration</h2>
          </div>
          <div className="space-y-4">
            {nutrition.slice(-5).map((item, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-300">
                    {format(new Date(item.date), 'MMM d, yyyy')}
                  </span>
                  <span className="text-sm font-semibold text-green-400">
                    {item.meal_type}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{item.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Training;