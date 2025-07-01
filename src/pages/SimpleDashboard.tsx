
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const SimpleDashboard = () => {
  console.log("SimpleDashboard: Component is rendering");

  return (
    <>
      <Helmet>
        <title>CLB Bi-a Sài Gòn - Trang chủ</title>
        <meta name="description" content="Hệ thống đặt bàn bi-a trực tuyến" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900">
        {/* Header */}
        <header className="bg-green-800 border-b border-green-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎱</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-yellow-400">CLB Bi-a Sài Gòn</h1>
                  <p className="text-green-200 text-sm">Hệ thống quản lý</p>
                </div>
              </div>
              <nav className="hidden md:flex space-x-6">
                <Link to="/" className="text-green-200 hover:text-yellow-400 transition-colors">
                  Trang chủ
                </Link>
                <Link to="/simple-club" className="text-green-200 hover:text-yellow-400 transition-colors">
                  Website CLB
                </Link>
                <Link to="/login" className="text-green-200 hover:text-yellow-400 transition-colors">
                  Đăng nhập
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Hệ Thống Quản Lý Bi-a
            </h2>
            <p className="text-xl text-green-200 mb-8 max-w-2xl mx-auto">
              Quản lý đặt bàn, thành viên và hoạt động câu lạc bộ bi-a
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Simple Club Website */}
              <div className="bg-green-800 border border-green-700 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-yellow-400 mb-4">Website CLB</h3>
                <p className="text-green-200 mb-6">
                  Website đơn giản cho khách hàng đặt bàn và xem thông tin câu lạc bộ
                </p>
                <Link 
                  to="/simple-club"
                  className="inline-block bg-yellow-400 text-green-900 hover:bg-yellow-500 font-bold px-6 py-3 rounded transition-colors"
                >
                  Xem Website CLB
                </Link>
              </div>

              {/* Management System */}
              <div className="bg-green-800 border border-green-700 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-yellow-400 mb-4">Hệ Thống Quản Lý</h3>
                <p className="text-green-200 mb-6">
                  Hệ thống quản lý nâng cao cho quản trị viên và nhân viên
                </p>
                <Link 
                  to="/login"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded transition-colors"
                >
                  Đăng nhập quản lý
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link 
                to="/simple-booking"
                className="bg-yellow-400 text-green-900 hover:bg-yellow-500 font-bold px-6 py-3 rounded transition-colors"
              >
                📅 Đặt bàn nhanh
              </Link>
              <Link 
                to="/register"
                className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-green-900 font-bold px-6 py-3 rounded transition-colors"
              >
                📝 Đăng ký tài khoản
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-green-900 border-t border-green-700 py-8 px-4 mt-16">
          <div className="container mx-auto text-center">
            <p className="text-green-300 text-sm">© 2024 CLB Bi-a Sài Gòn. Website đang hoạt động bình thường.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SimpleDashboard;
