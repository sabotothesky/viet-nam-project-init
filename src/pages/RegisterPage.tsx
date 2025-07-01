
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target } from "lucide-react";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <>
      <Helmet>
        <title>Đăng ký - SABO Pool Arena Hub</title>
        <meta name="description" content="Tạo tài khoản SABO Pool Arena miễn phí" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800 border-slate-700">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Target className="h-12 w-12 text-yellow-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Đăng ký</CardTitle>
            <CardDescription className="text-gray-300">
              Tạo tài khoản miễn phí và tham gia cộng đồng billiards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white">Họ</Label>
                <Input 
                  id="firstName" 
                  placeholder="Nguyễn"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white">Tên</Label>
                <Input 
                  id="lastName" 
                  placeholder="Văn A"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="email@example.com"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">Số điện thoại</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="0901234567"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Mật khẩu</Label>
              <Input 
                id="password" 
                type="password" 
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Xác nhận mật khẩu</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Button className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500">
              Tạo tài khoản
            </Button>
            <div className="text-center">
              <div className="text-gray-300 text-sm">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-yellow-400 hover:underline">
                  Đăng nhập
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default RegisterPage;
