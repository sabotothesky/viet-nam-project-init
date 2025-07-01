
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
import { Mail, Check, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { emailService } from '@/services/emailService';
import { toast } from 'sonner';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      // Send password reset email through Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error('Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.');
      } else {
        // Also send a custom email notification
        try {
          await emailService.sendPasswordResetEmail(
            data.email,
            `${window.location.origin}/reset-password`
          );
        } catch (emailError) {
          console.log('Custom email failed, but Supabase email should work');
        }
        
        setIsSuccess(true);
        toast.success('📧 Email đặt lại mật khẩu đã được gửi!');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          {/* Logo */}
          <div className='flex items-center justify-center space-x-2 mb-6'>
            <div className='w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center'>
              <Target className='w-8 h-8 text-slate-900' />
            </div>
            <span className='text-xl font-bold text-yellow-400'>
              SABO POOL ARENA
            </span>
          </div>

          <h2 className='text-3xl font-bold text-white'>🔐 Quên mật khẩu?</h2>
          <p className='mt-2 text-gray-300'>
            Nhập email của bạn, chúng tôi sẽ gửi link đặt lại mật khẩu
          </p>
        </div>

        <div className='bg-slate-800 rounded-lg p-8 border border-slate-700'>
          {!isSuccess ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-white'>Email *</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Mail className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                          <Input
                            {...field}
                            type='email'
                            placeholder='Nhập email đăng ký'
                            className='pl-10 bg-slate-700 border-slate-600 text-white'
                          />
                        </div>
                      </FormControl>
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />

                <Button
                  type='submit'
                  className='w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-semibold'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900 mr-2'></div>
                      Đang gửi...
                    </>
                  ) : (
                    '📧 Gửi link đặt lại'
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className='text-center space-y-4'>
              <div className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto'>
                <Check className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-lg font-medium text-white'>📧 Email đã được gửi!</h3>
              <p className='text-gray-300'>
                Kiểm tra hộp thư và thư mục spam của bạn.<br/>
                Link đặt lại mật khẩu có hiệu lực trong 1 giờ.
              </p>
              <div className='bg-blue-900/50 border border-blue-600/30 rounded-lg p-4 mt-4'>
                <p className='text-blue-200 text-sm'>
                  💡 <strong>Mẹo:</strong> Nếu không thấy email, hãy kiểm tra thư mục spam hoặc thử gửi lại sau 5 phút.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className='text-center'>
          <Link
            to='/login'
            className='text-yellow-400 hover:text-yellow-300 font-medium'
          >
            ← Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
