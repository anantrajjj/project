import React, { useEffect, useState } from 'react';
import OpenAI from 'openai';

const Analytics = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const analyzeData = async () => {
      try {
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          dangerouslyAllowBrowser: true // Only for demo, use server-side in production
        });

        const sampleData = {
          performance: "Increased sprint speed by 5%, strength gains in squat +10kg",
          training: "Completed 85% of planned sessions, showing consistent progress",
          nutrition: "Meeting macro targets, improved recovery metrics"
        };

        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "system",
            content: "You are a sports analytics expert. Analyze the following athlete data and provide insights."
          }, {
            role: "user",
            content: JSON.stringify(sampleData)
          }]
        });

        setInsights(response.choices[0].message.content.split('\n'));
      } catch (error) {
        console.error('Error analyzing data:', error);
        setInsights(['Unable to analyze data at this time']);
      } finally {
        setLoading(false);
      }
    };

    analyzeData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Performance Analytics</h1>
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">AI Insights</h2>
          {loading ? (
            <p className="text-gray-300">Analyzing your data...</p>
          ) : (
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-300">{insight}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;