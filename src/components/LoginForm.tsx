import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import SocialLoginButtons from './SocialLoginButtons';

const loginSchema = z.object({
  emailOrPhone: z.string().min(1, 'Vui lòng nhập email hoặc số điện thoại'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      // ...removed console.log('Login attempt with:', data.emailOrPhone)

      const { error } = await signIn(data.emailOrPhone, data.password);

      if (error) {
        console.error('Login error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        toast({
          title: 'Lỗi đăng nhập',
          description: errorMessage,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Đăng nhập thành công!',
          description: 'Chào mừng bạn trở lại SABO POOL ARENA',
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: 'Lỗi đăng nhập',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='emailOrPhone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email hoặc số điện thoại *</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                    <Input
                      {...field}
                      type='text'
                      placeholder='VD: user@email.com hoặc 0987654321'
                      className='pl-10'
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu *</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                    <Input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Nhập mật khẩu'
                      className='pl-10 pr-10'
                    />
                    <button
                      type='button'
                      className='absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors'
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex items-center justify-between'>
            <FormField
              control={form.control}
              name='rememberMe'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel className='text-sm font-normal'>
                      Ghi nhớ đăng nhập
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Link
              to='/forgot-password'
              className='text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors'
            >
              Quên mật khẩu?
            </Link>
          </div>

          <Button
            type='submit'
            className='w-full bg-blue-700 hover:bg-blue-800 transition-colors'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Đang đăng nhập...
              </>
            ) : (
              'Đăng nhập'
            )}
          </Button>
        </form>
      </Form>

      <SocialLoginButtons />

      <div className='text-center text-sm'>
        <span className='text-gray-600'>Chưa có tài khoản? </span>
        <Link
          to='/register'
          className='text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors'
        >
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
