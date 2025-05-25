
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

const formSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(4, { message: 'Password must be at least 4 characters' }),
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
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setLoginError(null);

    try {
      const success = await login(data.username, data.password);
      if (success) {
        navigate('/dashboard');
      } else {
        setLoginError('Invalid username or password');
      }
    } catch (error) {
      setLoginError('An error occurred during login');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Floating animated shapes */}
      <FloatingShapes />
      
      {/* Main content */}
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

          {/* Login card */}
          <Card className="w-full bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center text-gray-800">Welcome Back</CardTitle>
              <CardDescription className="text-center text-gray-600">
                Sign in to access your dashboard
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4 px-6">
                {loginError && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-700">{loginError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-700 font-medium">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    className="h-12 border-gray-200 focus:border-darkyellow-400 focus:ring-darkyellow-400/20"
                    {...register('username')}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500">{errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                    <Button variant="link" className="p-0 h-auto text-xs text-darkyellow-600 hover:text-darkyellow-700">
                      Forgot password?
                    </Button>
                  </div>
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
              </CardContent>

              <CardFooter className="px-6 pb-6">
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
              </CardFooter>
            </form>
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
