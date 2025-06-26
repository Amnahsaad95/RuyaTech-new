
# Rüya Tech

## About Rüya Tech

**Rüya Tech** is more than just a platform — it’s a **movement** uniting **students**, **experts**, **professionals**, and **tech companies** across Syria. Born from a vision to empower the tech community, Rüya Tech is where **innovation meets connection**, and where **knowledge transforms into opportunity**.

We believe that **everyone deserves a space to grow**, share their voice, and shape the future of technology — whether you're just starting out or you're already shaping the industry. Rüya Tech bridges the gap between ambition and achievement by providing a vibrant digital hub for collaboration, learning, and career growth.

Our mission is to **ignite possibilities** by connecting tech minds from all walks of life — enabling them to share experiences, post insights, showcase their skills, and discover life-changing opportunities.

With Rüya Tech, you’re not just joining a platform — you’re stepping into a **powerful ecosystem** built to support **your journey**, inspire your **growth**, and elevate **the entire Syrian tech scene**.

---

## Main Features

- 🌐 **Dynamic Profiles** for students, experts, and companies  
- 🔍 **Advanced Job Search** with filters tailored to the tech sector  
- 📝 **Tech-focused Post Sharing** to spread knowledge & spark discussion  
- 💼 **Freelance & Full-time Opportunities** in a trusted space  
- 🤝 **Direct Messaging & Networking** with industry professionals  
- 🧠 **Expert Content Feed** to stay updated on the latest tech trends  
- 🔐 **Secure Login & Role-based Access Control**  
- 📱 **Fully Responsive UI** for a seamless experience on mobile, tablet, and desktop  
- ⚙️ **Modern Stack Built With:**  
  - Laravel API (backend)  
  - Next.js 15 (frontend)  
  - Tailwind CSS  

---

## How to Run the Project Locally

### Clone the Project
```bash
git clone https://github.com/Amnahsaad95/RuyaTech.git
cd RuyaTech
````

### Environment Configuration

1. Copy environment file for backend:

```bash
cp backend/.env.example backend/.env
```

2. Update the `backend/.env` file with your database information.

---

### Install Backend Dependencies

```bash
cd backend
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan storage:link
```

---

### Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

### Run Backend Server

```bash
cd ../backend
php artisan serve
```

API will be available at:
`http://localhost:8000`

---

### Run Frontend Server

```bash
cd ../frontend
npm run dev
```

Website will be available at:
`http://localhost:3000`

---

## For Login as Admin

* Email: `admin@ruyatech.com`
* Password: `password123`

---

## Technologies Used

* Laravel (Backend API)
* Next.js 15 (Frontend)
* Tailwind CSS
* MySQL Database

---

## Copyright

© 2025 Amnah SaadElden. All rights reserved.
