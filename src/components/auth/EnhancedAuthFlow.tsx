import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Phone, Mail, Lock, User, MapPin } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserLocation } from '@/hooks/useUserLocation';
import { toast } from 'sonner';

interface EnhancedAuthFlowProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const EnhancedAuthFlow: React.FC<EnhancedAuthFlowProps> = ({
  onSuccess,
  onClose,
}) => {
  const { signIn, signUp, loading } = useAuth();
  const { requestLocationPermission } = useUserLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'auth' | 'profile' | 'location'>('auth');
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = (isSignUp: boolean) => {
    const newErrors: Record<string, string> = {};

    if (!authData.email) {
      newErrors.email = 'Email không được để trống';
    } else if (!validateEmail(authData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!authData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (authData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (isSignUp) {
      if (!authData.fullName) {
        newErrors.fullName = 'Họ tên không được để trống';
      }

      if (!authData.phone) {
        newErrors.phone = 'Số điện thoại không được để trống';
      } else if (!validatePhone(authData.phone)) {
        newErrors.phone = 'Số điện thoại không hợp lệ (VD: 0901234567)';
      }

      if (authData.password !== authData.confirmPassword) {
        newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(false)) return;

    try {
      await signIn(authData.email, authData.password);
      toast.success('Đăng nhập thành công!');
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Đăng nhập thất bại');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(true)) return;

    try {
      // Fix: Use correct number of parameters for signUp
      await signUp(
        authData.email,
        authData.password,
        authData.fullName,
        authData.phone
      );

      setStep('location');
      toast.success('Đăng ký thành công!');
    } catch (error: any) {
      toast.error(error.message || 'Đăng ký thất bại');
    }
  };

  const handleLocationSetup = async () => {
    try {
      await requestLocationPermission();
      onSuccess?.();
    } catch (error) {
      // Có thể bỏ qua lỗi location và tiếp tục
      onSuccess?.();
    }
  };

  const skipLocationSetup = () => {
    onSuccess?.();
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className='w-full max-w-md'
      >
        <Card className='bg-white shadow-xl'>
          <CardHeader className='text-center pb-4'>
            <CardTitle className='text-2xl font-bold text-gray-900'>
              {step === 'auth'
                ? 'Chào mừng đến SABO'
                : step === 'location'
                  ? 'Cài đặt vị trí'
                  : 'Hoàn tất đăng ký'}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode='wait'>
              {step === 'auth' && (
                <motion.div
                  key='auth'
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Tabs defaultValue='signin' className='w-full'>
                    <TabsList className='grid w-full grid-cols-2 mb-6'>
                      <TabsTrigger value='signin'>Đăng nhập</TabsTrigger>
                      <TabsTrigger value='signup'>Đăng ký</TabsTrigger>
                    </TabsList>

                    <TabsContent value='signin' className='space-y-4'>
                      <form onSubmit={handleSignIn} className='space-y-4'>
                        <div>
                          <Label htmlFor='email'>Email</Label>
                          <div className='relative'>
                            <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                            <Input
                              id='email'
                              type='email'
                              placeholder='your@email.com'
                              value={authData.email}
                              onChange={e =>
                                setAuthData(prev => ({
                                  ...prev,
                                  email: e.target.value,
                                }))
                              }
                              className='pl-10'
                            />
                          </div>
                          {errors.email && (
                            <p className='text-sm text-red-500 mt-1'>
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor='password'>Mật khẩu</Label>
                          <div className='relative'>
                            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                            <Input
                              id='password'
                              type={showPassword ? 'text' : 'password'}
                              placeholder='••••••••'
                              value={authData.password}
                              onChange={e =>
                                setAuthData(prev => ({
                                  ...prev,
                                  password: e.target.value,
                                }))
                              }
                              className='pl-10 pr-10'
                            />
                            <button
                              type='button'
                              onClick={() => setShowPassword(!showPassword)}
                              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                            >
                              {showPassword ? (
                                <EyeOff className='w-4 h-4' />
                              ) : (
                                <Eye className='w-4 h-4' />
                              )}
                            </button>
                          </div>
                          {errors.password && (
                            <p className='text-sm text-red-500 mt-1'>
                              {errors.password}
                            </p>
                          )}
                        </div>

                        <Button
                          type='submit'
                          className='w-full'
                          disabled={loading}
                        >
                          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </Button>
                      </form>
                    </TabsContent>

                    <TabsContent value='signup' className='space-y-4'>
                      <form onSubmit={handleSignUp} className='space-y-4'>
                        <div>
                          <Label htmlFor='fullName'>Họ và tên</Label>
                          <div className='relative'>
                            <User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                            <Input
                              id='fullName'
                              placeholder='Nguyễn Văn A'
                              value={authData.fullName}
                              onChange={e =>
                                setAuthData(prev => ({
                                  ...prev,
                                  fullName: e.target.value,
                                }))
                              }
                              className='pl-10'
                            />
                          </div>
                          {errors.fullName && (
                            <p className='text-sm text-red-500 mt-1'>
                              {errors.fullName}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor='phone'>Số điện thoại</Label>
                          <div className='relative'>
                            <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                            <Input
                              id='phone'
                              placeholder='0901234567'
                              value={authData.phone}
                              onChange={e =>
                                setAuthData(prev => ({
                                  ...prev,
                                  phone: e.target.value,
                                }))
                              }
                              className='pl-10'
                            />
                          </div>
                          {errors.phone && (
                            <p className='text-sm text-red-500 mt-1'>
                              {errors.phone}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor='signupEmail'>Email</Label>
                          <div className='relative'>
                            <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                            <Input
                              id='signupEmail'
                              type='email'
                              placeholder='your@email.com'
                              value={authData.email}
                              onChange={e =>
                                setAuthData(prev => ({
                                  ...prev,
                                  email: e.target.value,
                                }))
                              }
                              className='pl-10'
                            />
                          </div>
                          {errors.email && (
                            <p className='text-sm text-red-500 mt-1'>
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor='signupPassword'>Mật khẩu</Label>
                          <div className='relative'>
                            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                            <Input
                              id='signupPassword'
                              type={showPassword ? 'text' : 'password'}
                              placeholder='••••••••'
                              value={authData.password}
                              onChange={e =>
                                setAuthData(prev => ({
                                  ...prev,
                                  password: e.target.value,
                                }))
                              }
                              className='pl-10 pr-10'
                            />
                            <button
                              type='button'
                              onClick={() => setShowPassword(!showPassword)}
                              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                            >
                              {showPassword ? (
                                <EyeOff className='w-4 h-4' />
                              ) : (
                                <Eye className='w-4 h-4' />
                              )}
                            </button>
                          </div>
                          {errors.password && (
                            <p className='text-sm text-red-500 mt-1'>
                              {errors.password}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor='confirmPassword'>
                            Xác nhận mật khẩu
                          </Label>
                          <div className='relative'>
                            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                            <Input
                              id='confirmPassword'
                              type='password'
                              placeholder='••••••••'
                              value={authData.confirmPassword}
                              onChange={e =>
                                setAuthData(prev => ({
                                  ...prev,
                                  confirmPassword: e.target.value,
                                }))
                              }
                              className='pl-10'
                            />
                          </div>
                          {errors.confirmPassword && (
                            <p className='text-sm text-red-500 mt-1'>
                              {errors.confirmPassword}
                            </p>
                          )}
                        </div>

                        <Button
                          type='submit'
                          className='w-full'
                          disabled={loading}
                        >
                          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}

              {step === 'location' && (
                <motion.div
                  key='location'
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className='text-center space-y-6'
                >
                  <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto'>
                    <MapPin className='w-8 h-8 text-blue-500' />
                  </div>
                  <div>
                    <h3 className='text-lg font-semibold mb-2'>
                      Cho phép truy cập vị trí
                    </h3>
                    <p className='text-gray-600 text-sm'>
                      Chúng tôi sử dụng vị trí của bạn để đề xuất các giải đấu
                      và câu lạc bộ gần nhất.
                    </p>
                  </div>
                  <Alert>
                    <AlertDescription>
                      Thông tin vị trí của bạn sẽ được bảo mật và chỉ dùng để
                      cải thiện trải nghiệm.
                    </AlertDescription>
                  </Alert>
                  <div className='space-y-3'>
                    <Button onClick={handleLocationSetup} className='w-full'>
                      Cho phép truy cập vị trí
                    </Button>
                    <Button
                      onClick={skipLocationSetup}
                      variant='outline'
                      className='w-full'
                    >
                      Bỏ qua (có thể cài đặt sau)
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {step === 'auth' && onClose && (
              <div className='mt-4 text-center'>
                <button
                  onClick={onClose}
                  className='text-sm text-gray-500 hover:text-gray-700'
                >
                  Đóng
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
