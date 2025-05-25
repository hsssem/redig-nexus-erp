
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type FormData = z.infer<typeof formSchema>;

// Animated floating shapes for digital transformation theme
const FloatingShapes = () => {
  return (
    <>
      <div className="absolute top-10 left-10 w-16 h-16 bg-darkyellow-400/20 rounded-full floating-shape"></div>
      <div className="absolute top-32 right-16 w-12 h-12 bg-darkyellow-300/15 rounded-lg rotate-45 floating-shape-fast"></div>
      <div className="absolute bottom-40 left-20 w-20 h-20 bg-darkyellow-500/10 rounded-full floating-shape-slow"></div>
      <div className="absolute bottom-20 right-12 w-14 h-14 bg-darkyellow-400/20 rounded-lg floating-shape"></div>
      <div className="absolute top-1/2 left-8 w-8 h-8 bg-darkyellow-300/25 rounded-full floating-shape-fast"></div>
      <div className="absolute top-1/4 right-1/4 w-10 h-10 bg-darkyellow-400/15 rounded-md rotate-12 floating-shape"></div>
    </>
  );
};

const Login = () => {
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmitLogin = async (data: FormData) => {
    setLoading(true);
    setAuthError(null);

    try {
      const success = await login(data.email, data.password);
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      setAuthError('An error occurred during login');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitSignup = async (data: FormData) => {
    setLoading(true);
    setAuthError(null);

    try {
      const success = await signup(data.email, data.password);
      if (success) {
        // Don't navigate immediately, user needs to verify email
        reset();
      }
    } catch (error) {
      setAuthError('An error occurred during signup');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setAuthError(null);
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      <FloatingShapes />
      
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md space-y-6">
          {/* Logo and branding */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="bg-white p-4 rounded-2xl shadow-lg mb-4">
              <img 
                src="https://redig-apps.com/assets/img/logos/logo_w.png" 
                alt="Redig" 
                className="h-12 w-auto" 
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
              Enterprise Resource Planning
            </h1>
            <p className="text-gray-600 text-sm mt-2 text-center">
              Digital Transformation Solutions
            </p>
          </div>

          {/* Auth card with tabs */}
          <Card className="w-full bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center text-gray-800">
                {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                {activeTab === 'login' 
                  ? 'Sign in to access your dashboard' 
                  : 'Sign up to get started'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-6">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {authError && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50 mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-700">{authError}</AlertDescription>
                  </Alert>
                )}

                <TabsContent value="login">
                  <form onSubmit={handleSubmit(onSubmitLogin)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="h-12 border-gray-200 focus:border-darkyellow-400 focus:ring-darkyellow-400/20"
                        {...register('email')}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="h-12 border-gray-200 focus:border-darkyellow-400 focus:ring-darkyellow-400/20 pr-12"
                          {...register('password')}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-12 w-12 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-500">{errors.password.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-darkyellow-500 to-darkyellow-600 hover:from-darkyellow-600 hover:to-darkyellow-700 text-gray-900 font-semibold shadow-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-gray-900/20 border-t-gray-900 rounded-full animate-spin"></div>
                          Signing in...
                        </div>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSubmit(onSubmitSignup)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-gray-700 font-medium">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        className="h-12 border-gray-200 focus:border-darkyellow-400 focus:ring-darkyellow-400/20"
                        {...register('email')}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-gray-700 font-medium">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password (min 6 characters)"
                          className="h-12 border-gray-200 focus:border-darkyellow-400 focus:ring-darkyellow-400/20 pr-12"
                          {...register('password')}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-12 w-12 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-500">{errors.password.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-darkyellow-500 to-darkyellow-600 hover:from-darkyellow-600 hover:to-darkyellow-700 text-gray-900 font-semibold shadow-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-gray-900/20 border-t-gray-900 rounded-full animate-spin"></div>
                          Creating account...
                        </div>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 Redig Apps. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
