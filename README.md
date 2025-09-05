# Media Library Backend

Media file management system built with NestJS, MongoDB and JWT authentication.

## 🚀 Features

- JWT Authentication (Access token 24h, Refresh token 7d)
- JPEG file upload, download, delete
- User-based permission system
- Pagination support
- Winston logging
- Swagger API documentation
- Jest unit tests
- ESLint + Prettier

## 🛠️ Technologies

- NestJS 10.x
- MongoDB + Mongoose
- JWT
- Joi validation
- Multer (file upload)
- Winston (logging)
- Jest (testing)

## 📋 Requirements

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- MongoDB >= 5.0

## ⚡ Installation

```bash
# Install dependencies
pnpm install

# Setup environment file
cp .env.dist .env
```

Edit `.env` file:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/media-library
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads/
```

```bash
# Start MongoDB
brew services start mongodb/brew/mongodb-community  # macOS
sudo systemctl start mongod                         # Linux

# Run application
pnpm run start:dev
```

Application: http://localhost:3000
Swagger: http://localhost:3000/api

## 📦 pnpm Commands

```bash
# Development
pnpm install                    # Install dependencies
pnpm run start:dev              # Dev server (watch mode)
pnpm run build                  # Production build
pnpm run start:prod             # Production server

# Code Quality
pnpm run lint                   # ESLint check
pnpm run lint:fix               # ESLint auto fix
pnpm run format                 # Prettier formatting

# Testing
pnpm run test                   # Unit tests
pnpm run test:watch             # Watch mode test
pnpm run test:cov               # Coverage report

# Package Management
pnpm add <package>              # Add new package
pnpm add -D <package>           # Add dev dependency
pnpm remove <package>           # Remove package
pnpm update                     # Update packages
pnpm list                       # List packages
pnpm outdated                   # Check outdated packages
pnpm store prune                # Clear cache
```

## 📖 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Token refresh

### Media
- `POST /media/upload` - File upload
- `GET /media` - File list
- `GET /media/:id` - File details
- `GET /media/:id/download` - File download
- `DELETE /media/:id` - File delete
- `POST /media/:id/permissions` - Add permission
- `DELETE /media/:id/permissions/:userId` - Remove permission

### User
- `GET /user/profile` - User profile

### Health
- `GET /health` - System status

## 📁 Project Structure

```
├── controllers/        # API controllers
├── services/          # Business logic
├── models/           # Database schemas
├── middlewares/      # Custom middlewares
├── validators/       # Input validation
├── config/          # Configuration
├── utils/           # Utilities
├── test/           # Test files
├── logs/           # Log files
├── uploads/        # Uploaded files
└── dist/          # Built files
```

## 🧪 Tests

- `test/unit.test.ts` - Comprehensive business logic tests
- `test/basic.test.ts` - Basic functionality tests

Test coverage:
- Authentication flow
- File validation
- Permission management
- API response validation
- Pagination logic

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection | `mongodb://localhost:27017/media-library` |
| `JWT_ACCESS_SECRET` | Access token secret | - |
| `JWT_REFRESH_SECRET` | Refresh token secret | - |
| `JWT_ACCESS_EXPIRES_IN` | Access token expiry | `24h` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `7d` |
| `MAX_FILE_SIZE` | Max file size (bytes) | `10485760` (10MB) |
| `UPLOAD_PATH` | Upload folder | `uploads/` |

## 🆘 Troubleshooting

**MongoDB connection error:**
```bash
brew services list | grep mongodb  # macOS
sudo systemctl status mongod       # Linux
```

**Port in use:**
```bash
lsof -i :3000
kill -9 <PID>
```

**pnpm not found:**
```bash
npm install -g pnpm
```

## 📞 Contact

- GitHub: [@YavuzYilmazz](https://github.com/YavuzYilmazz)

## 📁 Proje Yapısı

```
├── controllers/        # API controllers
├── services/          # Business logic
├── models/           # Database schemas
├── middlewares/      # Custom middlewares
├── validators/       # Input validation
├── config/          # Configuration
├── utils/           # Utilities
├── test/           # Test files
├── logs/           # Log files
├── uploads/        # Uploaded files
└── dist/          # Built files
```

## 🧪 Tests

- `test/unit.test.ts` - Kapsamlı business logic testleri
- `test/basic.test.ts` - Temel functionality testleri

Test kapsamı:
- Authentication flow
- File validation
- Permission management
- API response validation
- Pagination logic

## 🔧 Environment Variables

| Variable | Açıklama | Default |
|----------|----------|---------|
| `PORT` | Server portu | `3000` |
| `MONGODB_URI` | MongoDB bağlantısı | `mongodb://localhost:27017/media-library` |
| `JWT_ACCESS_SECRET` | Access token secret | - |
| `JWT_REFRESH_SECRET` | Refresh token secret | - |
| `JWT_ACCESS_EXPIRES_IN` | Access token süresi | `24h` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token süresi | `7d` |
| `MAX_FILE_SIZE` | Max dosya boyutu (bytes) | `10485760` (10MB) |
| `UPLOAD_PATH` | Upload klasörü | `uploads/` |

## 🆘 Sorun Giderme

**MongoDB bağlantı hatası:**
```bash
brew services list | grep mongodb  # macOS
sudo systemctl status mongod       # Linux
```

**Port kullanımda:**
```bash
lsof -i :3000
kill -9 <PID>
```

**pnpm bulunamadı:**
```bash
npm install -g pnpm
```