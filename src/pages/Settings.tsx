
import React from 'react';
import { useForm } from 'react-hook-form';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Form schema for general settings
const generalSettingsSchema = z.object({
  currencySymbol: z.string().min(1, { message: "Currency symbol is required" }),
  currencyCode: z.string().min(1, { message: "Currency code is required" }),
});

// Form schema for tax settings
const taxSettingsSchema = z.object({
  enabled: z.boolean(),
  rate: z.coerce.number().min(0).max(100),
  name: z.string().min(1, { message: "Tax name is required" }),
});

// Available currencies
const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'TND', symbol: 'DT', name: 'Tunisian Dinar' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

const Settings = () => {
  const { 
    currencySymbol, 
    setCurrencySymbol, 
    currencyCode, 
    setCurrencyCode,
    taxConfig,
    setTaxConfig 
  } = useAppSettings();
  
  const { toast } = useToast();
  
  // Form for general settings
  const generalForm = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      currencySymbol,
      currencyCode,
    }
  });
  
  // Form for tax settings
  const taxForm = useForm<z.infer<typeof taxSettingsSchema>>({
    resolver: zodResolver(taxSettingsSchema),
    defaultValues: {
      enabled: taxConfig.enabled,
      rate: taxConfig.rate,
      name: taxConfig.name,
    }
  });
  
  const onSubmitGeneralSettings = (values: z.infer<typeof generalSettingsSchema>) => {
    setCurrencySymbol(values.currencySymbol);
    setCurrencyCode(values.currencyCode);
    
    toast({
      title: "Settings updated",
      description: "Your general settings have been saved.",
    });
  };
  
  const onSubmitTaxSettings = (values: z.infer<typeof taxSettingsSchema>) => {
    setTaxConfig({
      enabled: values.enabled,
      rate: values.rate,
      name: values.name,
    });
    
    toast({
      title: "Tax settings updated",
      description: "Your tax configuration has been saved.",
    });
  };
  
  const handleCurrencyChange = (currencyCode: string) => {
    const selectedCurrency = currencies.find(c => c.code === currencyCode);
    if (selectedCurrency) {
      generalForm.setValue('currencySymbol', selectedCurrency.symbol);
      generalForm.setValue('currencyCode', selectedCurrency.code);
    }
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Settings" 
        description="Manage your application settings"
      />
      
      <div className="grid grid-cols-1 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure global application settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...generalForm}>
              <form onSubmit={generalForm.handleSubmit(onSubmitGeneralSettings)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={generalForm.control}
                    name="currencyCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select
                          onValueChange={(value) => handleCurrencyChange(value)}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currencies.map(currency => (
                              <SelectItem key={currency.code} value={currency.code}>
                                {currency.symbol} - {currency.name} ({currency.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the currency you want to use for all transactions.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalForm.control}
                    name="currencySymbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency Symbol</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          This symbol will be displayed before amounts.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">Save General Settings</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {/* Tax Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Tax Configuration</CardTitle>
            <CardDescription>
              Set up how tax is calculated on invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...taxForm}>
              <form onSubmit={taxForm.handleSubmit(onSubmitTaxSettings)} className="space-y-4">
                <FormField
                  control={taxForm.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Tax Calculation</FormLabel>
                        <FormDescription>
                          When enabled, tax will be calculated and displayed on invoices.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={taxForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="VAT, GST, etc." />
                        </FormControl>
                        <FormDescription>
                          The name of the tax that will appear on invoices.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={taxForm.control}
                    name="rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Rate (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          The percentage rate used for tax calculation.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">Save Tax Settings</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Settings;
