
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';

const SimpleDashboard = () => {
  const { user, profile } = useAuth();

  return (
    <>
      <Helmet>
        <title>Trang chủ - SABO Pool Arena</title>
        <meta name="description" content="Đặt bàn bi-a dễ dàng tại SABO Pool Arena" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <header className="bg-slate-800 border-b border-slate-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-yellow-400">🎱 SABO Pool Arena</h1>
              <div className="flex items-center space-x-4">
                {user ? (
                  <span className="text-white">Xin chào, {profile?.full_name || user.email}</span>
                ) : (
                  <Link to="/login">
                    <Button variant="outline" className="text-yellow-400 border-yellow-400">
                      Đăng nhập
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Câu lạc bộ Bi-a SABO
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Đặt bàn bi-a dễ dàng, chơi thoải mái
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="text-center">
                  <Calendar className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <CardTitle className="text-white">Đặt bàn</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link to="/booking">
                    <Button className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500">
                      Đặt ngay
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="text-center">
                  <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <CardTitle className="text-white">Giờ mở cửa</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-300 text-sm">
                    Thứ 2 - CN<br />
                    8:00 - 23:00
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="text-center">
                  <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <CardTitle className="text-white">Bàn trống</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-2xl font-bold text-green-400">8/12</p>
                  <p className="text-gray-300 text-sm">bàn có sẵn</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="text-center">
                  <Phone className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <CardTitle className="text-white">Liên hệ</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-300 text-sm">
                    📞 0901 234 567<br />
                    🏠 123 Đường ABC, HCM
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Price Information */}
            <Card className="bg-slate-800 border-slate-700 mb-8">
              <CardHeader>
                <CardTitle className="text-white text-center">💰 Bảng giá</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <h3 className="text-yellow-400 font-semibold mb-2">Giờ vàng (8h-17h)</h3>
                    <p className="text-2xl font-bold text-white">25.000đ</p>
                    <p className="text-gray-300 text-sm">mỗi giờ</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-yellow-400 font-semibold mb-2">Giờ cao điểm (17h-23h)</h3>
                    <p className="text-2xl font-bold text-white">35.000đ</p>
                    <p className="text-gray-300 text-sm">mỗi giờ</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <div className="text-center mb-8">
              <Link to="/booking">
                <Button size="lg" className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 px-8 py-3 text-lg">
                  🎯 Đặt bàn ngay bây giờ
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SimpleDashboard;
