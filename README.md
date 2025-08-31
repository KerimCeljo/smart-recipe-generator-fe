# 🍳 Smart Recipe Generator

A full-stack web application that generates personalized recipes using AI, built with Spring Boot backend and React frontend.

## 🚀 Features

- **AI-Powered Recipe Generation** - Create recipes based on available ingredients
- **Smart Filtering** - Filter by meal type, cuisine, cooking time, and complexity
- **Recipe History** - Save and manage your generated recipes
- **Email Integration** - Send recipes directly to your email
- **Responsive Design** - Works on desktop and mobile devices

## 🏗️ Architecture

```
smart-recipe-generator/
├── frontend/          # React + Vite application
├── backend/           # Spring Boot REST API
├── DB/               # Database scripts and schemas
└── docs/             # Project documentation
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

### Backend
- **Spring Boot 3** - Java framework
- **Spring Data JPA** - Database operations
- **MySQL** - Database (hosted on Aiven)
- **SendGrid** - Email service integration

## 📦 Quick Start

### Prerequisites
- **Java 17+** and **Maven 3.6+**
- **Node.js 18+** and **npm**
- **MySQL database** (Aiven cloud database)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/smart-recipe-generator.git
cd smart-recipe-generator
```

### 2. Backend Setup
```bash
cd backend
# Create .env file with your database credentials
# See backend/README.md for details
mvn spring-boot:run
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **API Docs**: http://localhost:8080/swagger-ui.html

## 🔧 Configuration

### Environment Variables
Create `.env` files in both `frontend/` and `backend/` directories:

**Backend (.env):**
```bash
# Database Configuration
DB_HOST=your-aiven-host
DB_PORT=your-aiven-port
DB_NAME=your-database-name
DB_USERNAME=your-username
DB_PASSWORD=your-password

# SendGrid Configuration
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=your-email@example.com
SENDGRID_FROM_NAME=YourAppName
```

**Frontend (.env):**
```bash
VITE_API_BASE_URL=http://localhost:8080
```

## 📚 API Documentation

Once the backend is running, access the interactive API documentation:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Endpoints**: See `backend/README.md` for detailed API reference

## 🗄️ Database

The application uses MySQL hosted on Aiven cloud platform:
- **Host**: Aiven MySQL service
- **Features**: SSL/TLS encryption, automated backups
- **Schema**: See `DB/smart_recipes.sql` for database structure

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
- **Build**: `mvn clean package`
- **Run**: `java -jar target/smart-recipe-generator-0.0.1-SNAPSHOT.jar`

### Frontend Deployment
- **Build**: `npm run build`
- **Deploy**: Upload `dist/` folder to your web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for AI recipe generation capabilities
- **Aiven** for cloud database hosting
- **SendGrid** for email service integration
- **Spring Boot** and **React** communities

---

**Happy Cooking! 🍽️**

For detailed setup instructions, see:
- [Backend Setup](backend/README.md)
- [Frontend Setup](frontend/README.md)

