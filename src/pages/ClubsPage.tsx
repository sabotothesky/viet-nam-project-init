
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, Users, Star, DollarSign } from 'lucide-react';
import { useClubs } from '@/hooks/useClubs';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const ClubsPage = () => {
  const { data: clubs, isLoading } = useClubs();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Câu Lạc Bộ Bida</h1>
          <p className="text-xl text-gray-600">Khám phá các câu lạc bộ bida chất lượng cao trên toàn quốc</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clubs?.map((club) => (
            <Card key={club.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl">{club.name}</CardTitle>
                  {club.is_sabo_owned && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black">
                      SABO Official
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  {club.address}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {club.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {club.phone}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {club.available_tables} bàn
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 mr-1" />
                    {club.priority_score} điểm
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Giá giờ:</span>
                  <div className="flex items-center text-green-600 font-semibold">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {formatPrice(club.hourly_rate || 0)}/giờ
                  </div>
                </div>
                
                {club.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{club.description}</p>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold" size="sm">
                    Đặt Bàn
                  </Button>
                  <Button variant="outline" size="sm">
                    Chi Tiết
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold">
            Xem Thêm CLB
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ClubsPage;
