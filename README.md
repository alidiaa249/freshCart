# 🛒 FreshCart - E-Commerce Web Application

A full-featured e-commerce web application built with **Angular**, featuring Server-Side Rendering (SSR), RESTful API integration, and a seamless shopping experience.

🔗 **Live Demo:** [fresh-cart-flame-eight.vercel.app](https://fresh-cart-flame-eight.vercel.app)

---

## 📸 Preview

<img width="1900" height="1027" alt="image" src="https://github.com/user-attachments/assets/324468ac-f678-4071-bf6e-290bcd879c65" />


---

## ✨ Features

- 🔐 **User Authentication** — Register, Login & protected routes
- 🛍️ **Product Browsing** — Dynamic product listings with categories
- 🛒 **Cart Management** — Add, remove & update quantities in real-time
- 💳 **Checkout Flow** — Complete order placement experience
- 🌐 **Server-Side Rendering (SSR)** — Faster load & better SEO via Angular Universal
- 📱 **Fully Responsive** — Works seamlessly across all screen sizes
- ✅ **Form Validation** — Real-time validation using Angular Reactive Forms

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| **Angular** | Frontend Framework |
| **TypeScript** | Type-safe development |
| **RxJS** | Reactive programming & state management |
| **Angular Universal** | Server-Side Rendering (SSR) |
| **Tailwind** | Responsive UI styling |
| **RESTful APIs** | Dynamic data fetching |
| **Angular Router** | Multi-page navigation |
| **Reactive Forms** | Form handling & validation |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+)
- [Angular CLI](https://angular.io/cli)

```bash
npm install -g @angular/cli
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/alidiaa249/freshCart.git
cd freshCart
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
ng serve
```

4. **Open your browser and navigate to**
```
http://localhost:4200
```

### Run with SSR

```bash
npm run build
npm run serve:ssr
```

---

## 📁 Project Structure

```
freshCart/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── auth/             # Authentication logic
│   │   │   ├── guards/           # Route protection
│   │   │   ├── interceptor/      # HTTP interceptors
│   │   │   ├── models/           # TypeScript interfaces & types
│   │   │   └── services/         # Core API services
│   │   ├── features/             # Feature modules & pages
│   │   └── shared/
│   │       ├── components/       # Reusable UI components
│   │       ├── services/         # Shared services
│   │       ├── percentge-pipe.ts # Custom percentage pipe
│   │       └── stars-pipe.ts     # Custom star rating pipe
│   ├── environments/             # Environment configs
│   ├── app.routes.ts             # Application routing
│   ├── app.config.ts             # App configuration
│   ├── app.config.server.ts      # SSR configuration
│   └── main.server.ts            # SSR entry point
```
---

## 🎓 About This Project

FreshCart is my **graduation project** from the **Route Academy Frontend Diploma**.

It was built to apply real-world Angular concepts including:
- Component-based architecture
- Dependency Injection & Services
- RxJS Observables & Operators
- Angular Router with Guards
- Reactive Forms
- RESTful API Integration
- Server-Side Rendering (SSR)

---

## 👨‍💻 Author

**Ali Diaa Ali**
- 📧 alidiaa249@gmail.com
- 💼 [LinkedIn](www.linkedin.com/in/ali-diaa-91a062304)
- 🐙 [GitHub](https://github.com/alidiaa249)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
