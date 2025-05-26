
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TranslatedText from '@/components/language/TranslatedText';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-darkyellow-500"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getUserDisplayName = () => {
    if (!user) return '';
    return user.user_metadata?.name || user.email?.split('@')[0] || 'User';
  };

  return (
    <PageContainer>
      <PageHeader 
        title={`Welcome to ERP System, ${getUserDisplayName()}`}
        description="Your comprehensive business management platform"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg">
              <TranslatedText text="Quick Start" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              <TranslatedText text="Get started with your daily tasks and overview" />
            </p>
            <a 
              href="/today" 
              className="inline-block bg-darkyellow-500 text-white px-4 py-2 rounded-lg hover:bg-darkyellow-600 transition-colors duration-200"
            >
              <TranslatedText text="View Today Overview" />
            </a>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg">
              <TranslatedText text="Analytics" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              <TranslatedText text="View your business performance and insights" />
            </p>
            <a 
              href="/dashboard" 
              className="inline-block bg-darkblue-500 text-white px-4 py-2 rounded-lg hover:bg-darkblue-600 transition-colors duration-200"
            >
              <TranslatedText text="Open Dashboard" />
            </a>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg">
              <TranslatedText text="Management" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              <TranslatedText text="Manage customers, projects, and invoices" />
            </p>
            <a 
              href="/customers" 
              className="inline-block bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <TranslatedText text="Manage Customers" />
            </a>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>
              <TranslatedText text="System Status" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">
                <TranslatedText text="All systems operational" />
              </span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600 font-medium">Online</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Index;
