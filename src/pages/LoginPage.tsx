
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email });
    
    if (!email || !password) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      toast.success('Đăng nhập thành công!');
      navigate('/');
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Đăng nhập - CLB Bi-a Sài Gòn</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center p-4">
        <div className="bg-green-800 border border-green-700 rounded-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-yellow-400 mb-2">🎱 Đăng nhập</h1>
            <p className="text-green-200">CLB Bi-a Sài Gòn</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Mật khẩu
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-green-900 hover:bg-yellow-500"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>

          <div className="text-center mt-6 space-y-4">
            <Link 
              to="/forgot-password" 
              className="text-green-200 hover:text-yellow-400 text-sm"
            >
              Quên mật khẩu?
            </Link>
            
            <div className="text-green-200 text-sm">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-yellow-400 hover:underline">
                Đăng ký ngay
              </Link>
            </div>

            <Link 
              to="/" 
              className="inline-block text-green-200 hover:text-yellow-400 text-sm"
            >
              ← Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
