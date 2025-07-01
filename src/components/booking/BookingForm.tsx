
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Clock, User, Phone } from "lucide-react";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import TableSelector from './TableSelector';

interface FormData {
  name: string;
  phone: string;
  date: Date | undefined;
  timeSlot: string;
  tableNumber: string;
  duration: string;
  notificationMethod: string;
}

interface BookingFormProps {
  formData: FormData;
  availableTables: number[];
  loading: boolean;
  isHighContrast: boolean;
  onInputChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  calculatePrice: () => number;
}

const BookingForm = ({ 
  formData, 
  availableTables, 
  loading, 
  isHighContrast, 
  onInputChange, 
  onSubmit,
  calculatePrice
}: BookingFormProps) => {
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  return (
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
            <form onSubmit={onSubmit} className="space-y-6">
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
                      onChange={(e) => onInputChange('name', e.target.value)}
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
                      onChange={(e) => onInputChange('phone', e.target.value)}
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
                      onSelect={(date) => onInputChange('date', date)}
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
                  <Select onValueChange={(value) => onInputChange('timeSlot', value)}>
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
                  <Select onValueChange={(value) => onInputChange('duration', value)} defaultValue="1">
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
                <TableSelector
                  availableTables={availableTables}
                  selectedTable={formData.tableNumber}
                  loading={loading}
                  isHighContrast={isHighContrast}
                  onSelectTable={(tableNumber) => onInputChange('tableNumber', tableNumber)}
                />
              )}

              {/* Notification Method */}
              <div className="space-y-2">
                <Label className={`${isHighContrast ? 'text-white' : 'text-white'} text-lg font-medium`}>
                  Nhận thông báo qua
                </Label>
                <Select onValueChange={(value) => onInputChange('notificationMethod', value)} defaultValue="sms">
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
  );
};

export default BookingForm;
