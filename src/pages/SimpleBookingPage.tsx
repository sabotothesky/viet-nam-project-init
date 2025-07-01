
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Phone, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from 'sonner';

const SimpleBookingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    timeSlot: '',
    tableNumber: '',
    duration: '1'
  });
  const [loading, setLoading] = useState(false);

  // Available time slots
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  // Available tables
  const tables = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập họ tên');
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error('Vui lòng nhập số điện thoại');
      return false;
    }
    if (!/^0\d{9}$/.test(formData.phone)) {
      toast.error('Số điện thoại không hợp lệ (VD: 0901234567)');
      return false;
    }
    if (!formData.date) {
      toast.error('Vui lòng chọn ngày');
      return false;
    }
    if (!formData.timeSlot) {
      toast.error('Vui lòng chọn giờ');
      return false;
    }
    if (!formData.tableNumber) {
      toast.error('Vui lòng chọn bàn');
      return false;
    }
    return true;
  };

  const calculatePrice = () => {
    if (!formData.timeSlot || !formData.duration) return 0;
    
    const hour = parseInt(formData.timeSlot.split(':')[0]);
    const duration = parseInt(formData.duration);
    const pricePerHour = hour < 17 ? 25000 : 35000;
    
    return pricePerHour * duration;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Simulate booking API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`🎉 Đặt bàn thành công! Bàn ${formData.tableNumber} - ${formData.date} lúc ${formData.timeSlot}`);
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        date: '',
        timeSlot: '',
        tableNumber: '',
        duration: '1'
      });
      
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đặt bàn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Đặt bàn - SABO Pool Arena</title>
        <meta name="description" content="Đặt bàn bi-a tại SABO Pool Arena" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <header className="bg-slate-800 border-b border-slate-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-yellow-400">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Về trang chủ
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-yellow-400">🎱 Đặt bàn bi-a</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-center text-2xl">
                  📅 Đặt bàn bi-a
                </CardTitle>
                <p className="text-gray-300 text-center">
                  Điền thông tin để đặt bàn nhanh chóng
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Customer Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Họ tên *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Nguyễn Văn A"
                          className="bg-slate-700 border-slate-600 text-white pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white">Số điện thoại *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="0901234567"
                          className="bg-slate-700 border-slate-600 text-white pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-white">Ngày *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => handleInputChange('date', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="bg-slate-700 border-slate-600 text-white pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Giờ bắt đầu *</Label>
                      <Select onValueChange={(value) => handleInputChange('timeSlot', value)}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          <SelectValue placeholder="Chọn giờ" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time} {parseInt(time.split(':')[0]) < 17 ? '(25k/h)' : '(35k/h)'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Table and Duration */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Số bàn *</Label>
                      <Select onValueChange={(value) => handleInputChange('tableNumber', value)}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Chọn bàn" />
                        </SelectTrigger>
                        <SelectContent>
                          {tables.map((table) => (
                            <SelectItem key={table} value={table.toString()}>
                              Bàn {table}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Thời gian (giờ) *</Label>
                      <Select onValueChange={(value) => handleInputChange('duration', value)} defaultValue="1">
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Chọn thời gian" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((hour) => (
                            <SelectItem key={hour} value={hour.toString()}>
                              {hour} giờ
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Price Display */}
                  {formData.timeSlot && formData.duration && (
                    <div className="bg-slate-700 rounded-lg p-4">
                      <div className="flex justify-between items-center text-white">
                        <span>Tổng tiền:</span>
                        <span className="text-2xl font-bold text-yellow-400">
                          {calculatePrice().toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mt-1">
                        {formData.duration} giờ × {parseInt(formData.timeSlot?.split(':')[0] || '0') < 17 ? '25.000đ' : '35.000đ'}
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-semibold py-3 text-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900 mr-2"></div>
                        Đang đặt bàn...
                      </>
                    ) : (
                      '🎯 Xác nhận đặt bàn'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
};

export default SimpleBookingPage;
