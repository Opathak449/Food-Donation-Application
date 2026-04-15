# 🌱 FoodShare — Food Donation Platform

> **Reduce Food Waste. Feed Hope. Build Community.**

A full-stack web application that connects food donors, recipients, volunteers, and admins to reduce food waste and fight hunger. Built as a portfolio-ready project with React, Node.js, Express, and SQLite.

---

## ✨ Features

### 🤝 Donors
- Post food donations with photos, quantities, and expiry details
- Choose delivery mode: Pickup / Self-Deliver / Request Volunteer
- Track donation status in real time
- Edit or cancel donations that haven't been claimed

### 🙏 Recipients
- Browse and search available food donations
- Filter by category, city, delivery type, perishability
- Claim donations with one click
- Submit specific food requests
- Leave feedback and ratings after receiving food

### 🚴 Volunteers
- Browse pending delivery tasks
- Accept tasks and track progress step by step
- Mark food as collected then delivered
- View full donor and recipient contact details

### 🛡️ Admin
- Full analytics dashboard with charts (Recharts)
- Manage all users (activate/deactivate)
- Monitor and update all donations and requests
- Platform-wide stats and donation trends

### 🔔 Notifications
- Real-time in-app notification system
- Events: donation claimed, volunteer assigned, delivery complete, expiry warnings
- Unread badge in sidebar and header

---

## 🛠️ Tech Stack

| Layer      | Technology                              |
|------------|----------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS           |
| Animations | Framer Motion                          |
| Charts     | Recharts                               |
| Icons      | Lucide React                           |
| HTTP       | Axios                                  |
| Routing    | React Router DOM v6                    |
| Backend    | Node.js, Express.js                    |
| Database   | SQLite via better-sqlite3              |
| Auth       | JWT + bcryptjs                         |
| Uploads    | Multer                                 |
| Security   | Helmet, CORS, dotenv                   |

---

## 📁 Folder Structure

```
food-donation-platform/
├── client/                     # React frontend
│   ├── src/
│   │   ├── api/               # Axios instance
│   │   ├── components/
│   │   │   ├── layout/        # PublicLayout, DashboardLayout
│   │   │   └── ui/            # Shared UI components
│   │   ├── features/
│   │   │   └── auth/          # AuthContext
│   │   ├── hooks/             # useNotifications
│   │   ├── pages/
│   │   │   ├── admin/         # Admin dashboard, manage pages
│   │   │   ├── donor/         # Donor dashboard, forms
│   │   │   ├── recipient/     # Recipient dashboard, claims
│   │   │   └── volunteer/     # Volunteer dashboard, tasks
│   │   └── App.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                     # Express backend
│   ├── src/
│   │   ├── controllers/       # Business logic per resource
│   │   ├── database/          # db.js (init) + seed.js
│   │   ├── middleware/        # auth, error, upload
│   │   ├── routes/            # index.js (all routes)
│   │   └── services/          # notificationService
│   ├── uploads/               # Uploaded food images
│   ├── data/                  # SQLite database file (auto-created)
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher

---

### 1. Clone / Download the Project

```bash
cd food-donation-platform
```

---

### 2. Setup the Backend

```bash
cd server
npm install
```

Copy the environment file:
```bash
cp .env.example .env
```

The `.env` file is already configured for local development. You can leave it as-is.

Start the backend server:
```bash
npm run dev
```

The API will be running at: `http://localhost:5000`

---

### 3. Seed the Database

In a new terminal (while the server is running, or before starting):

```bash
cd server
npm run seed
```

This creates all sample data including demo accounts.

---

### 4. Setup the Frontend

```bash
cd ../client
npm install
npm run dev
```

The frontend will be running at: `http://localhost:5173`

---

## 🔐 Demo Credentials

All accounts use the password: **`password123`**

| Role      | Email                     | Password    |
|-----------|---------------------------|-------------|
| Admin     | admin@foodshare.org       | password123 |
| Donor     | sarah@donor.com           | password123 |
| Donor     | carlos@donor.com          | password123 |
| Donor     | emily@donor.com           | password123 |
| Recipient | marcus@recipient.com      | password123 |
| Recipient | aisha@recipient.com       | password123 |
| Volunteer | jenny@volunteer.com       | password123 |
| Volunteer | tom@volunteer.com         | password123 |

---

## 🌐 API Routes

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/profile
```

### Donations
```
GET    /api/donations              (public, filterable)
GET    /api/donations/my           (donor only)
GET    /api/donations/claims       (recipient only)
GET    /api/donations/:id          (public)
POST   /api/donations              (donor)
PUT    /api/donations/:id          (donor)
DELETE /api/donations/:id          (donor)
PATCH  /api/donations/:id/claim    (recipient)
PATCH  /api/donations/:id/status   (authenticated)
```

### Food Requests
```
GET    /api/requests
GET    /api/requests/my
GET    /api/requests/:id
POST   /api/requests               (recipient)
PUT    /api/requests/:id
DELETE /api/requests/:id
```

### Volunteer Tasks
```
GET    /api/tasks
GET    /api/tasks/my               (volunteer)
PATCH  /api/tasks/:id/accept       (volunteer)
PATCH  /api/tasks/:id/status       (volunteer)
```

### Notifications
```
GET    /api/notifications
PATCH  /api/notifications/:id/read
PATCH  /api/notifications/read-all
```

### Admin
```
GET    /api/admin/analytics
GET    /api/admin/users
PATCH  /api/admin/users/:id/toggle
```

### Feedback & Contact
```
GET    /api/feedback
POST   /api/feedback               (recipient)
POST   /api/contact                (public)
```

---

## 🖼️ Pages

| Route                    | Access       | Description                       |
|--------------------------|--------------|-----------------------------------|
| `/`                      | Public       | Landing page                      |
| `/about`                 | Public       | Mission and story                 |
| `/how-it-works`          | Public       | Step-by-step guide                |
| `/donations`             | Public       | Browse all donations              |
| `/donations/:id`         | Public       | Donation detail + claim           |
| `/faq`                   | Public       | Frequently asked questions        |
| `/contact`               | Public       | Contact form                      |
| `/login`                 | Public       | Login page                        |
| `/register`              | Public       | Registration page                 |
| `/profile`               | Auth         | Edit profile                      |
| `/notifications`         | Auth         | In-app notifications              |
| `/donor/dashboard`       | Donor        | Donor overview                    |
| `/donor/new-donation`    | Donor        | Post a donation                   |
| `/donor/my-donations`    | Donor        | Manage my donations               |
| `/donor/edit/:id`        | Donor        | Edit a donation                   |
| `/recipient/dashboard`   | Recipient    | Recipient overview                |
| `/recipient/my-claims`   | Recipient    | Track claimed donations           |
| `/recipient/my-requests` | Recipient    | View food requests                |
| `/recipient/request-food`| Recipient    | Submit a food request             |
| `/volunteer/dashboard`   | Volunteer    | Volunteer overview                |
| `/volunteer/tasks`       | Volunteer    | Browse available tasks            |
| `/volunteer/my-tasks`    | Volunteer    | My accepted tasks                 |
| `/admin/dashboard`       | Admin        | Analytics + charts                |
| `/admin/users`           | Admin        | Manage all users                  |
| `/admin/donations`       | Admin        | Manage all donations              |
| `/admin/requests`        | Admin        | View all food requests            |

---

## 🎨 Design System

- **Colors:** Green primary (`#22c55e`) + Orange accent (`#f97316`)
- **Fonts:** Playfair Display (headings) + DM Sans (body)
- **Style:** Clean NGO/startup aesthetic — soft shadows, rounded cards, status badges
- **Animations:** Framer Motion — page load staggered reveals, hover lifts
- **Responsive:** Mobile-first, fully responsive across all breakpoints

---

## 🔮 Future Improvements

- [ ] AI food freshness detection from uploaded images
- [ ] Real-time chat between donor and recipient
- [ ] SMS alerts via Twilio
- [ ] Push notifications (PWA)
- [ ] Interactive Leaflet map on donation browse page
- [ ] Smart donor-recipient matching by location
- [ ] NGO verified badge system
- [ ] Emergency donation mode for disaster relief
- [ ] Mobile app (React Native)
- [ ] Donation recurring schedules for restaurants
- [ ] Food safety ratings and certifications
- [ ] Multi-language support

---

## 🤝 Contributing

Pull requests and feature ideas are welcome. This project was built as a portfolio piece demonstrating full-stack development skills.

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

**Built with ❤️ to reduce waste and feed hope.**
