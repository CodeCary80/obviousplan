# Obvious Plan 🎯

**Eliminate decision fatigue and get the perfect evening plan in seconds.**

Obvious Plan is a full-stack web application that generates personalized evening itineraries for Toronto residents. Instead of spending 30 minutes researching restaurants and activities, users get curated recommendations in under 10 seconds.


## 🚀 Features

### Core Functionality
- **Instant Plan Generation** - Get restaurant + activity recommendations in seconds
- **Smart Matching** - Algorithm matches venues to your energy level, budget, and group type
- **Budget Estimation** - Accurate total cost calculation from real venue pricing
- **Location Intelligence** - Recommendations within practical distances using GPS

### Advanced Features
- **Shuffle Options** - Don't like a recommendation? Shuffle for alternatives
- **Responsive Design** - Perfect experience on desktop and mobile
- **User Accounts** - Save favorite plans and view history
- **Admin Panel** - Content management for venues and activities

## 🛠️ Technology Stack

### Frontend
- **React 18** with modern hooks and functional components
- **Tailwind CSS** for responsive, mobile-first design
- **Axios** for API communication
- **Vite** for fast development and building

### Backend
- **Laravel 12** (PHP) - robust API development
- **PostgreSQL** database with complex relationships
- **RESTful API** design with proper HTTP methods
- **Eloquent ORM** for database management

### Development Tools
- **Git/GitHub** for version control
- **Composer** for PHP dependency management
- **Laravel Artisan** for CLI operations

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- PHP (v8.4 or higher)
- PostgreSQL (v13 or higher)
- Composer

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/obvious-plan.git
   cd obvious-plan/backend
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Configure database in `.env`**
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=obvious_plan_db
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

5. **Run migrations**
   ```bash
   php artisan migrate
   ```

6. **Start development server**
   ```bash
   php artisan serve
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint in `.env`**
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🎮 Usage

### For Users

1. **Visit the homepage** at `http://localhost:5173`
2. **Select your preferences:**
   - Energy Level: Low, Medium, or High
   - Budget: $, $$, $$$, $$$$, or $$$$$
   - Company: Solo, Date, Small Group, or Large Group
3. **Click "Generate Plan"** and get instant recommendations
4. **Shuffle options** if you want alternatives
5. **Save favorites** by creating an account

### For Administrators

1. **Login** with admin credentials
2. **Access admin panel** at `/admin`
3. **Manage content:**
   - Add/edit restaurants
   - Add/edit activities
   - Manage tips and users
   - View analytics

## 🗄️ Database Schema

The application uses 11 interconnected tables:

- **activities** - Entertainment venues and experiences
- **restaurants** - Dining establishments
- **users** - User accounts and authentication
- **plan_requests** - User preference submissions
- **generated_schedules** - Complete evening plans
- **tips** - Contextual recommendations
- **user_favorites** - Saved plans
- **user_plan_history** - Plan rating and feedback
- And more...

## 🔧 API Endpoints

### Plan Generation
- `POST /api/evening-plans` - Generate new plan
- `GET /api/evening-plans/{hash}` - Get specific plan
- `POST /api/evening-plans/{hash}/shuffle-restaurant` - Alternative restaurant
- `POST /api/evening-plans/{hash}/shuffle-activity` - Alternative activity

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout

### User Features
- `GET /api/user/favorites` - Get saved plans
- `POST /api/user/favorites` - Save plan
- `GET /api/user/history` - Plan history

## 🧪 Testing

### Backend Testing
```bash
cd backend
php artisan test
```

### Frontend Testing
```bash
cd frontend
npm run test
```

## 📱 Responsive Design

Obvious Plan is fully responsive and works perfectly on:
- **Desktop** - Full-featured experience
- **Tablet** - Optimized layout
- **Mobile** - Touch-friendly interface

## 🌟 Key Algorithms

### Location-Based Filtering
Uses the **Haversine formula** for precise distance calculations:
```php
$distance = $this->calculateDistance($userLat, $userLng, $venueLat, $venueLng);
```

### Smart Matching
Sophisticated filtering system that considers:
- Energy level compatibility
- Budget range matching
- Group size appropriateness
- Geographic proximity

## 🚧 Known Issues

- **Deployment** - CORS configuration needs refinement for production
- **Shuffle Restaurant** - Occasionally returns same venue
- **Mobile Safari** - Minor CSS adjustments needed

## 🔮 Future Enhancements

### Short Term
- **Social Features** - Share plans with friends
- **Enhanced Authentication** - OAuth integration
- **Performance** - Caching and optimization

### Long Term
- **Multi-city Expansion** - Vancouver, Montreal, nationwide
- **AI Integration** - Machine learning from user preferences
- **Business Partnerships** - Direct booking integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: Your Name
- **Project Type**: Academic Capstone Project
- **Institution**: Your University
- **Course**: Web Development / Software Engineering

## 📞 Contact

- **Email**: your.email@example.com
- **LinkedIn**: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- **Portfolio**: [Your Portfolio](https://yourportfolio.com)

## 🙏 Acknowledgments

- **Laravel Community** for excellent documentation
- **React Team** for the amazing framework
- **Toronto Open Data** for venue information
- **Course Instructors** for guidance and support

---

**Built with ❤️ in Toronto** 🍁