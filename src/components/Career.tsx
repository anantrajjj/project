import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { LineChart, Award, Trophy, Calendar } from 'lucide-react';

interface CareerData {
  id: number;
  athlete_id: number;
  event: string;
  achievement: string;
  date: string;
  notes: string;
}

const Career = () => {
  const [careerData, setCareerData] = useState<CareerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCareerData();
  }, []);

  const fetchCareerData = async () => {
    try {
      const { data: athleteData } = await supabase.from('athletes').select('id').single();
      if (athleteData) {
        const { data: careerRecords } = await supabase
          .from('career_progression')
          .select('*')
          .eq('athlete_id', athleteData.id)
          .order('date', { ascending: true });
        
        if (careerRecords) setCareerData(careerRecords);
      }
    } catch (error) {
      console.error('Error fetching career data:', error);
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold text-white mb-8">Career Progression</h1>
        <div className="space-y-6">
          {careerData.map((career, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 flex items-start">
              <Calendar className="w-6 h-6 text-yellow-500 mr-4" />
              <div>
                <h2 className="text-xl font-semibold text-white">{career.event}</h2>
                <p className="text-gray-300">{format(new Date(career.date), 'MMM d, yyyy')}</p>
                <p className="text-green-400 font-medium">{career.achievement}</p>
                <p className="text-gray-400 mt-2">{career.notes || 'No additional details'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;