import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Mail, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: 'Lỗi',
          description:
            'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.',
          variant: 'destructive',
        });
      } else {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast({
        title: 'Lỗi',
        description: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          {/* Logo */}
          <div className='flex items-center justify-center space-x-2 mb-6'>
            <div className='w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center'>
              <Target className='w-6 h-6 text-white' />
            </div>
            <span className='text-xl font-bold text-blue-700'>
              SABO POOL ARENA
            </span>
          </div>

          <h2 className='text-3xl font-bold text-gray-900'>Quên mật khẩu?</h2>
          <p className='mt-2 text-gray-600'>
            Nhập email của bạn, chúng tôi sẽ gửi link đặt lại mật khẩu
          </p>
        </div>

        {!isSuccess ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Mail className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                        <Input
                          {...field}
                          type='email'
                          placeholder='Nhập email đăng ký'
                          className='pl-10'
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                className='w-full bg-blue-700 hover:bg-blue-800'
                disabled={isLoading}
              >
                {isLoading ? 'Đang gửi...' : 'Gửi link đặt lại'}
              </Button>
            </form>
          </Form>
        ) : (
          <div className='text-center space-y-4'>
            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto'>
              <Check className='w-8 h-8 text-green-600' />
            </div>
            <h3 className='text-lg font-medium text-gray-900'>Đã gửi email!</h3>
            <p className='text-gray-600'>
              Kiểm tra hộp thư và spam folder của bạn
            </p>
          </div>
        )}

        <div className='text-center'>
          <Link
            to='/login'
            className='text-blue-600 hover:text-blue-800 font-medium'
          >
            ← Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
