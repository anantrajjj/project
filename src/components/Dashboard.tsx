import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Camera, Brain, Dumbbell, Trophy } from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    const { data: athleteData } = await supabase
      .from('athletes')
      .select('id')
      .single();

    if (athleteData) {
      const { data } = await supabase
        .from('athlete_metrics')
        .select('*')
        .eq('athlete_id', athleteData.id)
        .order('recorded_at', { ascending: true });

      if (data) {
        setMetrics(data);
        generatePredictions(data);
      }
    }
    setLoading(false);
  };

  const generatePredictions = (data: any[]) => {
    // Simulated AI predictions
    setPredictions([
      "Peak performance predicted in next 2 weeks",
      "Recommended: Increase endurance training by 15%",
      "Recovery optimization: Focus on sleep quality"
    ]);
  };

  const performanceData = {
    labels: metrics.map(m => new Date(m.recorded_at).toLocaleDateString()),
    datasets: [
      {
        label: 'Performance Score',
        data: metrics.map(m => m.value),
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.4
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MVPCard
            icon={<Camera className="w-8 h-8 text-purple-500" />}
            title="Real-time Form Analysis"
            description="AI-powered movement analysis using your device camera"
          />
          <MVPCard
            icon={<Brain className="w-8 h-8 text-blue-500" />}
            title="Performance Prediction"
            description="ML-based forecasting of your peak performance days"
          />
          <MVPCard
            icon={<Dumbbell className="w-8 h-8 text-green-500" />}
            title="Smart Training Plans"
            description="Personalized workout recommendations using Google Vertex AI"
          />
          <MVPCard
            icon={<Trophy className="w-8 h-8 text-yellow-500" />}
            title="Competition Analysis"
            description="AI scouting reports and competition strategies"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Performance Trends</h2>
            {!loading && metrics.length > 0 && (
              <Line 
                data={performanceData}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      },
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                      }
                    },
                    x: {
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      },
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      labels: {
                        color: 'rgba(255, 255, 255, 0.7)'
                      }
                    }
                  }
                }}
              />
            )}
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
            <div className="space-y-4">
              {predictions.map((prediction, index) => (
                <div 
                  key={index}
                  className="bg-gray-700 rounded-lg p-4"
                >
                  <p className="text-sm text-gray-300">{prediction}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MVPCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-gray-800 rounded-xl p-6">
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-400">{description}</p>
  </div>
);

export default Dashboard;