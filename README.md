# JobHook - Full Stack Job Portal

A modern job portal built with Next.js, Spring Boot, and PostgreSQL. JobHook connects job seekers with employers through an intuitive and feature-rich platform.

## 🚀 Features

### For Job Seekers
- **Job Search**: Advanced search with filters for location, job type, salary, and skills
- **Job Applications**: Easy application process with profile management
- **Profile Management**: Create and maintain professional profiles
- **Job Alerts**: Get notified about new opportunities
- **Skill Matching**: Find jobs that match your skills

### For Employers
- **Job Posting**: Create detailed job listings with rich descriptions
- **Candidate Search**: Find talented professionals by skills and experience
- **Application Management**: Review and manage job applications
- **Analytics**: Track job posting performance

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **Lucide React** - Beautiful icons
- **React Query** - Data fetching and caching

### Backend
- **Spring Boot 3.2** - Java framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Data persistence
- **PostgreSQL** - Relational database
- **JWT** - Token-based authentication

### Database
- **PostgreSQL** - Primary database
- **Hibernate** - ORM framework

## 📁 Project Structure

```
findy/
├── src/                          # Frontend (Next.js)
│   ├── components/               # Reusable UI components
│   ├── pages/                   # Application pages
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility functions
│   └── styles/                  # Global styles
├── backend/                     # Backend (Spring Boot)
│   ├── src/main/java/
│   │   └── com/example/findy/
│   │       ├── config/          # Configuration classes
│   │       ├── controller/      # REST controllers
│   │       ├── model/           # Entity classes
│   │       └── repository/      # Data access layer
│   └── src/main/resources/
│       └── application.yml      # Application configuration
├── database/                    # Database scripts
│   └── init.sql                # Database initialization
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and npm
- **Java 17+** and Maven
- **PostgreSQL 14+**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd findy
   ```

2. **Set up the database**
   ```bash
   # Start PostgreSQL
   # Create database and run initialization script
   psql -U postgres -f database/init.sql
   ```

3. **Configure the backend**
   ```bash
   cd backend
   # Update application.yml with your database credentials
   ```

4. **Start the backend**
   ```bash
   cd backend
   mvn spring-boot:run
   # Backend will be available at http://localhost:8080
   ```

5. **Start the frontend**
   ```bash
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   # Frontend will be available at http://localhost:3000
   ```

## 🔧 Configuration

### Backend Configuration

Update `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/findy_db
    username: your_username
    password: your_password
```

### Frontend Configuration

The frontend is configured to proxy API requests to the backend at `http://localhost:8080`. Update `next.config.js` if needed.

## 📚 API Documentation

### Jobs API

- `GET /api/jobs` - Get all jobs with optional filters
- `GET /api/jobs/{id}` - Get job by ID
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/{id}` - Update job
- `DELETE /api/jobs/{id}` - Delete job

### Users API

- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users/register` - Register new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

## 🎨 UI Components

The application uses a comprehensive set of UI components built with Radix UI and styled with Tailwind CSS:

- **Button** - Various button styles and sizes
- **Input** - Form inputs with validation
- **Card** - Content containers
- **Select** - Dropdown selections
- **Checkbox** - Form checkboxes
- **Badge** - Status indicators
- **Avatar** - User profile images
- **Toast** - Notification system

## 🔐 Authentication

The application uses JWT-based authentication:

1. Users register/login through the frontend
2. Backend validates credentials and issues JWT tokens
3. Frontend stores tokens and includes them in API requests
4. Backend validates tokens for protected endpoints

## 🚀 Deployment

### Frontend Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Backend Deployment

```bash
# Build the JAR file
mvn clean package

# Run the application
java -jar target/findy-0.0.1-SNAPSHOT.jar
```

### Database Deployment

1. Set up PostgreSQL on your server
2. Run the initialization script
3. Update application configuration
4. Start the backend application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Version History

- **v1.0.0** - Initial release with core job portal features
- **v1.1.0** - Added user profiles and skill matching
- **v1.2.0** - Enhanced search and filtering capabilities

---

Built with ❤️ using Next.js, Spring Boot, and PostgreSQL 