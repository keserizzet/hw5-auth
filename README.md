# Contact Management API with Authentication

Bu proje, kullanıcı kimlik doğrulama ve yetkilendirme özellikleri ile birlikte iletişim yönetimi API'si sağlar.

## Özellikler

- Kullanıcı kayıt ve giriş sistemi
- JWT token tabanlı kimlik doğrulama
- Refresh token ile oturum yenileme
- Güvenli şifre hashleme (bcrypt)
- Kullanıcıya özel iletişim yönetimi
- RESTful API tasarımı

## Teknolojiler

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcrypt
- cookie-parser

## Kurulum

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd hw5-auth
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Environment variables dosyasını oluşturun:
```bash
cp .env.example .env
```

4. .env dosyasını düzenleyin:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/contact-manager
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production
```

5. MongoDB'yi başlatın

6. Uygulamayı çalıştırın:
```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /auth/register` - Kullanıcı kaydı
- `POST /auth/login` - Kullanıcı girişi
- `POST /auth/refresh` - Token yenileme
- `POST /auth/logout` - Çıkış

### Contacts (Authentication Required)

- `GET /contacts` - Tüm iletişimleri getir
- `GET /contacts/:id` - Belirli iletişimi getir
- `POST /contacts` - Yeni iletişim oluştur
- `PUT /contacts/:id` - İletişim güncelle
- `DELETE /contacts/:id` - İletişim sil

## Kullanım Örnekleri

### Kullanıcı Kaydı
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Kullanıcı Girişi
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### İletişim Oluşturma
```bash
curl -X POST http://localhost:3000/contacts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1234567890"
  }'
```

## Güvenlik

- Şifreler bcrypt ile hashlenir
- JWT tokenlar kullanılır
- HTTP-only cookie'ler refresh token için kullanılır
- CORS yapılandırması
- Input validation

## Lisans

ISC 