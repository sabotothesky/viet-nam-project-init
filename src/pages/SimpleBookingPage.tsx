
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SimpleBookingPage = () => {
  return (
    <>
      <Helmet>
        <title>Đặt bàn - CLB Bi-a Sài Gòn</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900">
        <header className="bg-green-800 border-b border-green-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎱</span>
                  </div>
                  <h1 className="text-xl font-bold text-yellow-400">CLB Bi-a Sài Gòn</h1>
                </div>
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">Đặt Bàn Bi-a</h1>
          <p className="text-xl text-green-200 mb-8">
            Tính năng đặt bàn đang được phát triển
          </p>
          
          <div className="bg-green-800 border border-green-700 rounded-lg p-8 max-w-md mx-auto">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Sắp ra mắt!</h2>
            <p className="text-green-200 mb-6">
              Hệ thống đặt bàn trực tuyến sẽ sớm được hoàn thiện
            </p>
            
            <div className="space-y-4">
              <p className="text-yellow-400 font-semibold">Liên hệ đặt bàn:</p>
              <p className="text-white">📞 Hotline: 0901 234 567</p>
              <p className="text-white">⏰ Giờ mở cửa: 8:00 - 24:00</p>
            </div>
          </div>

          <div className="mt-8">
            <Link to="/">
              <Button className="bg-yellow-400 text-green-900 hover:bg-yellow-500">
                Về trang chủ
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
};

export default SimpleBookingPage;
