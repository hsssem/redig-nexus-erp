
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, SendIcon, BrainCircuit } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { projects, customers, teamMembers } from '@/services/mockData';

type ChartType = 'bar' | 'pie' | 'line' | 'none';

interface AIChartData {
  chartType: ChartType;
  chartTitle: string;
  chartDescription: string;
  chartData: any[];
  dataKeys?: string[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00C49F', '#FFBB28', '#FF8042'];

const AiAssistant = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIChartData | null>(null);
  const [error, setError] = useState('');

  const processPrompt = () => {
    setLoading(true);
    setError('');
    
    // Simulate AI processing with predefined responses based on keywords
    setTimeout(() => {
      try {
        // Very simple pattern matching for demo purposes
        let chartData: AIChartData;
        
        if (prompt.toLowerCase().includes('revenue') || prompt.toLowerCase().includes('income')) {
          chartData = {
            chartType: 'bar',
            chartTitle: 'Monthly Revenue Analysis',
            chartDescription: 'Analysis of revenue by month shows that May has the highest revenue.',
            chartData: [
              { name: 'Jan', value: 12000 },
              { name: 'Feb', value: 15000 },
              { name: 'Mar', value: 18000 },
              { name: 'Apr', value: 16000 },
              { name: 'May', value: 21000 },
              { name: 'Jun', value: 20000 },
            ],
            dataKeys: ['value']
          };
        } 
        else if (prompt.toLowerCase().includes('client') || prompt.toLowerCase().includes('customer')) {
          chartData = {
            chartType: 'pie',
            chartTitle: 'Revenue by Client',
            chartDescription: 'DataFlow Systems contributes the most to your revenue.',
            chartData: [
              { name: 'TechCorp Inc.', value: 25000 },
              { name: 'Innovate Co', value: 50000 },
              { name: 'DataFlow Systems', value: 120000 },
              { name: 'WebWorks', value: 30000 },
              { name: 'Global Technologies', value: 15000 },
            ]
          };
        }
        else if (prompt.toLowerCase().includes('team') || prompt.toLowerCase().includes('staff')) {
          chartData = {
            chartType: 'bar',
            chartTitle: 'Project Distribution by Team Member',
            chartDescription: 'Alice Cooper is involved in the most projects.',
            chartData: [
              { name: 'Alice Cooper', value: 3 },
              { name: 'Bob Thompson', value: 2 },
              { name: 'Charlie Martinez', value: 2 },
              { name: 'Dana Johnson', value: 2 },
              { name: 'Evan Williams', value: 3 },
              { name: 'Frank Miller', value: 2 },
              { name: 'Grace Lee', value: 2 },
            ],
            dataKeys: ['value']
          };
        }
        else if (prompt.toLowerCase().includes('project') || prompt.toLowerCase().includes('progress')) {
          chartData = {
            chartType: 'bar',
            chartTitle: 'Project Progress Analysis',
            chartDescription: 'Two projects are fully complete, with others at various stages.',
            chartData: projects.map(project => ({
              name: project.name.split(' ')[0],
              progress: project.progress
            })),
            dataKeys: ['progress']
          };
        }
        else {
          chartData = {
            chartType: 'none',
            chartTitle: 'No Specific Data Found',
            chartDescription: 'I couldn\'t find specific data matching your request. Try asking about revenue, clients, team members, or projects.',
            chartData: []
          };
        }
        
        setResult(chartData);
      } catch (err) {
        setError('Failed to process your request. Please try a different query.');
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  const renderChart = () => {
    if (!result) return null;
    
    if (result.chartType === 'none') {
      return <p className="text-center text-muted-foreground">{result.chartDescription}</p>;
    }
    
    if (result.chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={result.chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {result.dataKeys?.map((key, index) => (
              <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    }
    
    if (result.chartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={result.chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {result.chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }
    
    return null;
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-purple-500" />
          <span>AI Chart Generator</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask a question about your business data..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={processPrompt} 
              disabled={!prompt || loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4" />}
            </Button>
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          {result && (
            <div className="border rounded-lg p-4 mt-4">
              <h3 className="font-medium text-lg mb-1">{result.chartTitle}</h3>
              <p className="text-sm text-muted-foreground mb-4">{result.chartDescription}</p>
              {renderChart()}
            </div>
          )}
          
          <div className="text-xs text-muted-foreground border-t pt-4 mt-4">
            <p>Try asking questions like:</p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>What is my monthly revenue?</li>
              <li>Who are my best clients?</li>
              <li>How is my team performing?</li>
              <li>What is the progress of my projects?</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiAssistant;
