
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Clock, User, Phone, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from 'sonner';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const SimpleClubBookingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: undefined as Date | undefined,
    timeSlot: '',
    tableNumber: '',
    duration: '1',
    notificationMethod: 'sms'
  });
  const [loading, setLoading] = useState(false);
  const [availableTables, setAvailableTables] = useState<number[]>([]);
  const [bookingStep, setBookingStep] = useState(1);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [connectionSpeed, setConnectionSpeed] = useState<'fast' | 'slow'>('fast');

  // Available time slots
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  // Simulate connection speed detection
  useEffect(() => {
    const connection = (navigator as any).connection;
    if (connection) {
      setConnectionSpeed(connection.effectiveType === '3g' || connection.effectiveType === '2g' ? 'slow' : 'fast');
    }
  }, []);

  // Real-time table availability simulation
  useEffect(() => {
    if (formData.date && formData.timeSlot) {
      setLoading(true);
      // Simulate API call delay for slow connections
      const delay = connectionSpeed === 'slow' ? 2000 : 500;
      
      setTimeout(() => {
        const totalTables = 12;
        const occupiedTables = Math.floor(Math.random() * 6) + 1; // 1-6 tables occupied
        const available = Array.from({ length: totalTables - occupiedTables }, (_, i) => i + 1);
        setAvailableTables(available);
        setLoading(false);
      }, delay);
    }
  }, [formData.date, formData.timeSlot, connectionSpeed]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập họ tên đầy đủ');
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error('Vui lòng nhập số điện thoại');
      return false;
    }
    if (!/^0\d{9}$/.test(formData.phone)) {
      toast.error('Số điện thoại không đúng định dạng (VD: 0901234567)');
      return false;
    }
    if (!formData.date) {
      toast.error('Vui lòng chọn ngày chơi');
      return false;
    }
    if (!formData.timeSlot) {
      toast.error('Vui lòng chọn giờ bắt đầu');
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
      const delay = connectionSpeed === 'slow' ? 3000 : 1500;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      toast.success(`🎉 Đặt bàn thành công! Bàn ${formData.tableNumber} - ${format(formData.date!, 'dd/MM/yyyy')} lúc ${formData.timeSlot}`);
      
      // Move to confirmation step
      setBookingStep(3);
      
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại hoặc gọi hotline: 0901 234 567');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = () => {
    if (confirm('Bạn có chắc muốn hủy đặt bàn này không?')) {
      setFormData({
        name: '',
        phone: '',
        date: undefined,
        timeSlot: '',
        tableNumber: '',
        duration: '1',
        notificationMethod: 'sms'
      });
      setBookingStep(1);
      toast.success('Đã hủy đặt bàn thành công');
    }
  };

  const themeClasses = isHighContrast ? 
    'bg-black text-white' : 
    'bg-gradient-to-br from-green-900 via-green-800 to-green-900';

  if (bookingStep === 3) {
    return (
      <div className={`min-h-screen ${themeClasses}`}>
        <div className="container mx-auto px-4 py-16 text-center">
          <CheckCircle className="h-20 w-20 text-green-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Đặt Bàn Thành Công!</h1>
          <div className="bg-green-800 rounded-xl p-6 max-w-md mx-auto mb-8">
            <p className="text-white text-lg mb-2">Thông tin đặt bàn:</p>
            <p className="text-green-200">Tên: {formData.name}</p>
            <p className="text-green-200">SĐT: {formData.phone}</p>
            <p className="text-green-200">Bàn: {formData.tableNumber}</p>
            <p className="text-green-200">Ngày: {formData.date ? format(formData.date, 'dd/MM/yyyy', { locale: vi }) : ''}</p>
            <p className="text-green-200">Giờ: {formData.timeSlot}</p>
            <p className="text-yellow-400 font-bold text-xl mt-4">
              Tổng: {calculatePrice().toLocaleString('vi-VN')}đ
            </p>
          </div>
          <div className="space-y-4">
            <Button onClick={handleCancelBooking} variant="outline" className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white min-h-[44px]">
              Hủy đặt bàn
            </Button>
            <br />
            <Link to="/simple-club">
              <Button className="bg-yellow-400 text-green-900 hover:bg-yellow-500 min-h-[44px]">
                Về trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Đặt bàn bi-a - CLB Bi-a Sài Gòn</title>
        <meta name="description" content="Đặt bàn bi-a online nhanh chóng, dễ dàng tại CLB Bi-a Sài Gòn" />
      </Helmet>

      <div className={`min-h-screen ${themeClasses}`}>
        {/* Header */}
        <header className="bg-green-800 border-b border-green-700 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/simple-club">
                <Button variant="ghost" size="sm" className="text-yellow-400 hover:bg-green-700 min-h-[44px]">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Về trang chủ
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-yellow-400">🎱 Đặt bàn bi-a</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsHighContrast(!isHighContrast)}
                className="text-green-200 hover:bg-green-700 min-h-[44px]"
              >
                {isHighContrast ? '🌞' : '🌙'}
              </Button>
            </div>
          </div>
        </header>

        {/* Loading indicator for slow connections */}
        {connectionSpeed === 'slow' && loading && (
          <div className="bg-yellow-400 text-green-900 text-center py-2 px-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-900"></div>
              <span className="font-medium">Đang tải dữ liệu...</span>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className={`${isHighContrast ? 'bg-gray-900 border-white' : 'bg-green-800 border-green-700'}`}>
              <CardHeader>
                <CardTitle className={`${isHighContrast ? 'text-white' : 'text-white'} text-center text-2xl`}>
                  📅 Đặt bàn bi-a
                </CardTitle>
                <p className={`${isHighContrast ? 'text-gray-300' : 'text-green-200'} text-center`}>
                  Điền thông tin để đặt bàn nhanh chóng
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Customer Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className={`${isHighContrast ? 'text-white' : 'text-white'} text-lg font-medium`}>
                        Họ tên đầy đủ *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Nguyễn Văn An"
                          className={`${isHighContrast ? 'bg-black border-white text-white' : 'bg-green-700 border-green-600 text-white'} pl-12 text-lg min-h-[44px]`}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className={`${isHighContrast ? 'text-white' : 'text-white'} text-lg font-medium`}>
                        Số điện thoại *
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="0901234567"
                          type="tel"
                          className={`${isHighContrast ? 'bg-black border-white text-white' : 'bg-green-700 border-green-600 text-white'} pl-12 text-lg min-h-[44px]`}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label className={`${isHighContrast ? 'text-white' : 'text-white'} text-lg font-medium`}>
                      Chọn ngày *
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal min-h-[44px] text-lg ${
                            isHighContrast ? 'bg-black border-white text-white hover:bg-gray-900' : 'bg-green-700 border-green-600 text-white hover:bg-green-600'
                          } ${!formData.date && 'text-gray-400'}`}
                        >
                          <CalendarIcon className="mr-3 h-5 w-5" />
                          {formData.date ? format(formData.date, 'dd MMMM yyyy', { locale: vi }) : 'Chọn ngày chơi'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => handleInputChange('date', date)}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time and Duration */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className={`${isHighContrast ? 'text-white' : 'text-white'} text-lg font-medium`}>
                        Giờ bắt đầu *
                      </Label>
                      <Select onValueChange={(value) => handleInputChange('timeSlot', value)}>
                        <SelectTrigger className={`${isHighContrast ? 'bg-black border-white text-white' : 'bg-green-700 border-green-600 text-white'} min-h-[44px] text-lg`}>
                          <Clock className="h-5 w-5 mr-2 text-gray-400" />
                          <SelectValue placeholder="Chọn giờ" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time} className="text-lg">
                              {time} {parseInt(time.split(':')[0]) < 17 ? '(25k/h)' : '(35k/h)'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className={`${isHighContrast ? 'text-white' : 'text-white'} text-lg font-medium`}>
                        Thời gian chơi *
                      </Label>
                      <Select onValueChange={(value) => handleInputChange('duration', value)} defaultValue="1">
                        <SelectTrigger className={`${isHighContrast ? 'bg-black border-white text-white' : 'bg-green-700 border-green-600 text-white'} min-h-[44px] text-lg`}>
                          <SelectValue placeholder="Chọn thời gian" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((hour) => (
                            <SelectItem key={hour} value={hour.toString()} className="text-lg">
                              {hour} giờ
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Table Selection */}
                  {formData.date && formData.timeSlot && (
                    <div className="space-y-2">
                      <Label className={`${isHighContrast ? 'text-white' : 'text-white'} text-lg font-medium`}>
                        Chọn bàn *
                      </Label>
                      {loading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                          <span className="ml-3 text-white">Đang kiểm tra bàn trống...</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-4 gap-3">
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((table) => {
                            const isAvailable = availableTables.includes(table);
                            return (
                              <Button
                                key={table}
                                type="button"
                                variant={formData.tableNumber === table.toString() ? 'default' : 'outline'}
                                className={`min-h-[44px] text-lg font-medium ${
                                  isAvailable 
                                    ? formData.tableNumber === table.toString()
                                      ? 'bg-yellow-400 text-green-900 hover:bg-yellow-500'
                                      : isHighContrast
                                        ? 'border-white text-white hover:bg-white hover:text-black'
                                        : 'border-green-400 text-green-400 hover:bg-green-400 hover:text-green-900'
                                    : 'opacity-50 cursor-not-allowed bg-red-800 text-red-200'
                                }`}
                                onClick={() => isAvailable && handleInputChange('tableNumber', table.toString())}
                                disabled={!isAvailable}
                              >
                                Bàn {table}
                                {!isAvailable && <XCircle className="ml-1 h-4 w-4" />}
                              </Button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notification Method */}
                  <div className="space-y-2">
                    <Label className={`${isHighContrast ? 'text-white' : 'text-white'} text-lg font-medium`}>
                      Nhận thông báo qua
                    </Label>
                    <Select onValueChange={(value) => handleInputChange('notificationMethod', value)} defaultValue="sms">
                      <SelectTrigger className={`${isHighContrast ? 'bg-black border-white text-white' : 'bg-green-700 border-green-600 text-white'} min-h-[44px] text-lg`}>
                        <SelectValue placeholder="Chọn cách thông báo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sms" className="text-lg">📱 SMS</SelectItem>
                        <SelectItem value="zalo" className="text-lg">💬 Zalo</SelectItem>
                        <SelectItem value="call" className="text-lg">📞 Gọi điện</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Display */}
                  {formData.timeSlot && formData.duration && (
                    <div className={`${isHighContrast ? 'bg-gray-800 border-white' : 'bg-green-700'} rounded-lg p-6 border`}>
                      <div className="flex justify-between items-center text-white">
                        <span className="text-lg">Tổng tiền:</span>
                        <span className="text-3xl font-bold text-yellow-400">
                          {calculatePrice().toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                      <p className={`${isHighContrast ? 'text-gray-300' : 'text-green-200'} text-sm mt-2`}>
                        {formData.duration} giờ × {parseInt(formData.timeSlot?.split(':')[0] || '0') < 17 ? '25.000đ' : '35.000đ'}
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-yellow-400 text-green-900 hover:bg-yellow-500 font-bold py-4 text-xl min-h-[50px]"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-900 mr-3"></div>
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

export default SimpleClubBookingPage;
