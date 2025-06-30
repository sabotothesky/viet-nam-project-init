import Navigation from '@/components/Navigation';
import AuthLayout from '@/components/AuthLayout';
import RegisterForm from '@/components/RegisterForm';

const RegisterPage = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Navigation />
      <div className='pt-16'>
        <AuthLayout
          title='Đăng ký tài khoản'
          subtitle='Tham gia cộng đồng bida chuyên nghiệp Việt Nam'
        >
          <RegisterForm />
        </AuthLayout>
      </div>
    </div>
  );
};

export default RegisterPage;
