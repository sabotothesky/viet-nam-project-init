# 🏊‍♂️ Sabo Pool Arena Hub

A comprehensive pool arena management system with VNPAY payment integration, tournament management, and social features.

## 🚀 Features

### 🎯 Core Features
- **User Management** - Registration, authentication, profiles
- **Tournament System** - Create, manage, and participate in tournaments
- **ELO Rating System** - Advanced player ranking and matchmaking
- **Challenge System** - Player challenges and match scheduling
- **Payment Integration** - VNPAY payment gateway for memberships and tournaments
- **Social Features** - Posts, comments, messaging, notifications
- **Club Management** - Club creation, membership, leaderboards
- **Live Streaming** - Real-time match streaming capabilities
- **Analytics Dashboard** - Comprehensive statistics and insights

### 💳 Payment Features
- **VNPAY Integration** - Complete payment gateway integration
- **Multiple Payment Methods** - Credit cards, bank transfers
- **Membership Plans** - Premium subscriptions and upgrades
- **Tournament Entry Fees** - Secure payment processing
- **Refund System** - Automated refund processing

### 📱 Mobile-First Design
- **Responsive UI** - Works perfectly on all devices
- **PWA Support** - Progressive Web App capabilities
- **Offline Mode** - Basic functionality without internet
- **Push Notifications** - Real-time updates and alerts

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful component library
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Framer Motion** - Smooth animations

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **Supabase** - Database and authentication
- **VNPAY API** - Payment processing
- **Socket.io** - Real-time communication

### Database
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions
- **Supabase** - Real-time subscriptions

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/sabo-pool-arena-hub.git
cd sabo-pool-arena-hub
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# VNPAY Configuration
VNP_TMN_CODE=your_tmn_code
VNP_HASH_SECRET=your_hash_secret
VNP_RETURN_URL=https://your-domain.com/api/webhooks/vnpay-return
VNP_PAYMENT_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_IPN_URL=https://your-domain.com/api/webhooks/vnpay-ipn

# Database
DATABASE_URL=your_supabase_url
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Server
PORT=3000
NODE_ENV=development
```

4. **Start development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:3000
```

## 🧪 Testing

### Run VNPAY Payment Tests
```bash
node test-vnpay.js
```

### Start Demo Server
```bash
node demo-server.js
```

### Test Card Details (VCB Bank)
- **Card Number:** `4524 0418 7644 5035`
- **Name:** `VÕ LONG SANG`
- **Expiry:** `10/27`
- **OTP:** `160922`

## 📁 Project Structure

```
sabo-pool-arena-hub/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # UI components
│   │   ├── auth/           # Authentication components
│   │   ├── tournament/     # Tournament components
│   │   ├── payment/        # Payment components
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript types
│   └── integrations/       # Third-party integrations
│       └── vnpay/          # VNPAY payment gateway
├── supabase/               # Database migrations
├── public/                 # Static assets
├── scripts/                # Build and deployment scripts
└── docs/                   # Documentation
```

## 🔧 Configuration

### VNPAY Payment Gateway
The project includes a complete VNPAY payment integration:

- **Payment Creation** - Generate payment URLs
- **Return Handling** - Process payment returns
- **IPN Processing** - Server-to-server notifications
- **Hash Verification** - Secure payment validation
- **Error Handling** - Comprehensive error management

### Environment Variables
Key environment variables for production:

```env
# Production VNPAY
VNP_TMN_CODE=your_production_tmn_code
VNP_HASH_SECRET=your_production_hash_secret
VNP_PAYMENT_URL=https://pay.vnpay.vn/vpcpay.html

# Production URLs
VNP_RETURN_URL=https://your-domain.com/api/webhooks/vnpay-return
VNP_IPN_URL=https://your-domain.com/api/webhooks/vnpay-ipn
```

## 🚀 Deployment

### Deploy to Loveable

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Loveable**
- Go to [Loveable.dev](https://loveable.dev)
- Connect your GitHub repository
- Configure environment variables
- Deploy

### Manual Deployment

1. **Build the project**
```bash
npm run build
```

2. **Start production server**
```bash
npm start
```

## 📊 API Endpoints

### VNPAY Payment API
- `POST /api/payments/create-vnpay` - Create payment
- `GET /api/webhooks/vnpay-return` - Payment return
- `GET /api/webhooks/vnpay-ipn` - IPN notification
- `GET /api/payments/vnpay-status/:orderId` - Check status

### User API
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

### Tournament API
- `GET /api/tournaments` - List tournaments
- `POST /api/tournaments` - Create tournament
- `GET /api/tournaments/:id` - Get tournament details
- `POST /api/tournaments/:id/join` - Join tournament

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation:** [Wiki](https://github.com/yourusername/sabo-pool-arena-hub/wiki)
- **Issues:** [GitHub Issues](https://github.com/yourusername/sabo-pool-arena-hub/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/sabo-pool-arena-hub/discussions)

## 🙏 Acknowledgments

- VNPAY for payment gateway integration
- Supabase for backend services
- Shadcn/ui for beautiful components
- React community for amazing tools

---

**Made with ❤️ for the pool community**
