
import React, { useState } from 'react';
import { Save, DollarSign, Euro, PoundSterling, JapaneseYen, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import Sidebar from '@/components/layout/Sidebar';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';

interface CurrencyOption {
  id: string;
  name: string;
  symbol: React.ReactNode;
  code: string;
}

interface AppSettings {
  currency: string;
  dateFormat: string;
  timezone: string;
}

const Settings = () => {
  const [settings, setSettings] = useState<AppSettings>({
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timezone: 'UTC'
  });

  const currencyOptions: CurrencyOption[] = [
    {
      id: 'USD',
      name: 'US Dollar',
      symbol: <DollarSign className="h-4 w-4" />,
      code: 'USD'
    },
    {
      id: 'EUR',
      name: 'Euro',
      symbol: <Euro className="h-4 w-4" />,
      code: 'EUR'
    },
    {
      id: 'GBP',
      name: 'British Pound',
      symbol: <PoundSterling className="h-4 w-4" />,
      code: 'GBP'
    },
    {
      id: 'JPY',
      name: 'Japanese Yen',
      symbol: <JapaneseYen className="h-4 w-4" />,
      code: 'JPY'
    },
    {
      id: 'INR',
      name: 'Indian Rupee',
      symbol: <IndianRupee className="h-4 w-4" />,
      code: 'INR'
    }
  ];

  const dateFormatOptions = [
    { id: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)', example: '05/22/2025' },
    { id: 'DD/MM/YYYY', label: 'DD/MM/YYYY (Europe)', example: '22/05/2025' },
    { id: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)', example: '2025-05-22' }
  ];

  const timezoneOptions = [
    { id: 'UTC', name: 'UTC (Coordinated Universal Time)' },
    { id: 'America/New_York', name: 'EST (Eastern Standard Time)' },
    { id: 'America/Los_Angeles', name: 'PST (Pacific Standard Time)' },
    { id: 'Europe/London', name: 'GMT (Greenwich Mean Time)' },
    { id: 'Europe/Paris', name: 'CET (Central European Time)' },
    { id: 'Asia/Tokyo', name: 'JST (Japan Standard Time)' }
  ];

  const handleSaveSettings = () => {
    // In a real application, this would save to a database
    localStorage.setItem('appSettings', JSON.stringify(settings));
    toast.success("Settings saved successfully");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <PageContainer className="flex-1">
        <PageHeader
          title="Settings"
          description="Configure your application preferences"
        />

        <div className="grid gap-6">
          <Card className="shadow-md backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Currency Settings</CardTitle>
              <CardDescription>
                Choose the default currency for invoices, projects, and financial reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={settings.currency}
                onValueChange={(value) => setSettings({...settings, currency: value})}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {currencyOptions.map((currency) => (
                  <div key={currency.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={currency.id} id={`currency-${currency.id}`} />
                    <Label 
                      htmlFor={`currency-${currency.id}`}
                      className="flex items-center gap-2 text-base cursor-pointer"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                        {currency.symbol}
                      </div>
                      <div>
                        <p className="font-medium">{currency.name}</p>
                        <p className="text-sm text-muted-foreground">{currency.code}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              <div className="mt-8 bg-muted/50 p-4 rounded-md border">
                <p className="text-sm text-muted-foreground mb-2">Currency Preview</p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-card p-3 rounded border shadow-sm">
                    <p className="text-xs text-muted-foreground mb-1">Invoice total</p>
                    <p className="font-medium">
                      {settings.currency === 'USD' && '$'}
                      {settings.currency === 'EUR' && '€'}
                      {settings.currency === 'GBP' && '£'}
                      {settings.currency === 'JPY' && '¥'}
                      {settings.currency === 'INR' && '₹'}
                      1,250.00
                    </p>
                  </div>
                  <div className="bg-card p-3 rounded border shadow-sm">
                    <p className="text-xs text-muted-foreground mb-1">Project budget</p>
                    <p className="font-medium">
                      {settings.currency === 'USD' && '$'}
                      {settings.currency === 'EUR' && '€'}
                      {settings.currency === 'GBP' && '£'}
                      {settings.currency === 'JPY' && '¥'}
                      {settings.currency === 'INR' && '₹'}
                      25,000.00
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Date & Time Settings</CardTitle>
              <CardDescription>
                Configure how dates and times are displayed across the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-3">Date Format</h3>
                  <RadioGroup
                    value={settings.dateFormat}
                    onValueChange={(value) => setSettings({...settings, dateFormat: value})}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {dateFormatOptions.map((format) => (
                      <div key={format.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={format.id} id={`format-${format.id}`} />
                        <Label 
                          htmlFor={`format-${format.id}`}
                          className="cursor-pointer"
                        >
                          <p className="font-medium">{format.label}</p>
                          <p className="text-sm text-muted-foreground">Example: {format.example}</p>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-3">Timezone</h3>
                  <RadioGroup
                    value={settings.timezone}
                    onValueChange={(value) => setSettings({...settings, timezone: value})}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {timezoneOptions.map((tz) => (
                      <div key={tz.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={tz.id} id={`tz-${tz.id}`} />
                        <Label 
                          htmlFor={`tz-${tz.id}`}
                          className="cursor-pointer"
                        >
                          {tz.name}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} className="bg-gradient-primary">
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default Settings;
