
import Navigation from '@/components/Navigation';
import AuthLayout from '@/components/AuthLayout';
import LoginForm from '@/components/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-16">
        <AuthLayout
          title="Đăng nhập"
          subtitle="Chào mừng bạn trở lại SABO POOL ARENA"
        >
          <LoginForm />
        </AuthLayout>
      </div>
    </div>
  );
};

export default LoginPage;
