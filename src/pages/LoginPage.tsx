
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target } from "lucide-react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>Đăng nhập - SABO Pool Arena Hub</title>
        <meta name="description" content="Đăng nhập vào tài khoản SABO Pool Arena của bạn" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800 border-slate-700">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Target className="h-12 w-12 text-yellow-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Đăng nhập</CardTitle>
            <CardDescription className="text-gray-300">
              Truy cập vào tài khoản SABO Pool Arena của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Label htmlFor="password" className="text-white">Mật khẩu</Label>
              <Input 
                id="password" 
                type="password" 
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Button className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500">
              Đăng nhập
            </Button>
            <div className="text-center space-y-2">
              <Link to="/forgot-password" className="text-yellow-400 hover:underline text-sm">
                Quên mật khẩu?
              </Link>
              <div className="text-gray-300 text-sm">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-yellow-400 hover:underline">
                  Đăng ký ngay
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
