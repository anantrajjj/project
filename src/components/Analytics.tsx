import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { format } from 'date-fns';
import { Brain, TrendingUp, Activity, LineChart } from 'lucide-react';
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

interface Metric {
  recorded_at: string;
  value: number;
  metric_type: string;
}

interface PerformanceMetric {
  recorded_at: string;
  value: number;
  metric_name: string;
  notes: string;
}

const Analytics = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  useEffect(() => {
    fetchData();
  }, [selectedTimeframe]);

  const fetchData = async () => {
    try {
      // Get the athlete's ID first
      const { data: athleteData } = await supabase
        .from('athletes')
        .select('id')
        .single();

      if (athleteData) {
        // Fetch metrics
        const { data: metricsData } = await supabase
          .from('athlete_metrics')
          .select('*')
          .eq('athlete_id', athleteData.id)
          .order('recorded_at', { ascending: true });

        // Fetch performance metrics
        const { data: performanceData } = await supabase
          .from('performance_metrics')
          .select('*')
          .eq('athlete_id', athleteData.id)
          .order('recorded_at', { ascending: true });

        if (metricsData) setMetrics(metricsData);
        if (performanceData) setPerformanceMetrics(performanceData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = (metricType: string) => {
    const filteredMetrics = metrics.filter(m => m.metric_type === metricType);
    
    return {
      labels: filteredMetrics.map(m => format(new Date(m.recorded_at), 'MMM d')),
      datasets: [{
        label: metricType.replace(/_/g, ' ').toUpperCase(),
        data: filteredMetrics.map(m => m.value),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }]
    };
  };

  const getPerformanceChartData = () => {
    return {
      labels: performanceMetrics.map(m => format(new Date(m.recorded_at), 'MMM d')),
      datasets: [{
        label: 'Performance Score',
        data: performanceMetrics.map(m => m.value),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      }]
    };
  };

  const chartOptions = {
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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Analytics Dashboard</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedTimeframe('week')}
              className={`px-4 py-2 rounded-lg ${
                selectedTimeframe === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setSelectedTimeframe('month')}
              className={`px-4 py-2 rounded-lg ${
                selectedTimeframe === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Month
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <Brain className="w-6 h-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold">Strength Score Trend</h2>
            </div>
            <Line data={getChartData('strength_score')} options={chartOptions} />
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <Activity className="w-6 h-6 text-green-500 mr-2" />
              <h2 className="text-xl font-semibold">Endurance Progress</h2>
            </div>
            <Line data={getChartData('endurance_score')} options={chartOptions} />
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-6 h-6 text-purple-500 mr-2" />
            <h2 className="text-xl font-semibold">Overall Performance</h2>
          </div>
          <Bar data={getPerformanceChartData()} options={chartOptions} />
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <LineChart className="w-6 h-6 text-yellow-500 mr-2" />
            <h2 className="text-xl font-semibold">Recent Performance Notes</h2>
          </div>
          <div className="space-y-4">
            {performanceMetrics.slice(-5).reverse().map((metric, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-300">
                    {format(new Date(metric.recorded_at), 'MMM d, yyyy')}
                  </span>
                  <span className="text-sm font-semibold text-blue-400">
                    Score: {metric.value}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{metric.notes || 'No notes available'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;