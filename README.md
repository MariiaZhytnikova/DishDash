# Dish Dash 🍽️

DishDash helps you reduce food waste by recommending recipes based on the ingredients you already have at home.

Instead of buying more food, you use what’s available — and for anything missing, DishDash creates a precise shopping list so you buy only what you need.

## 👥 Team

This project was developed collaboratively by two developers:

- **Marina Zhivotova** — Frontend (Figma design, React, TypeScript, UI/UX)  
  GitHub: https://github.com/marinezh

- **[Mariia Zhitnikova]** — Backend (Go, API design, data modeling, deployment)  
  GitHub: https://github.com/MariiaZhytnikova

## ✨ Overview

Dish Dash focuses on simplicity and reducing food waste by encouraging users to cook with what they already have.  
The app is designed as a scalable product, with future plans for personalization, nutrition tracking, and family-oriented features.

## 🌐 Live Demo

- **Frontend:** [https://mariiazhytnikova.github.io/DishDash/](https://mariiazhytnikova.github.io/DishDash/)
- **Backend API:** https://backend-ancient-waterfall-8399.fly.dev  

## 🔑 Key Features

- **Ingredient-Based Search**  
  Enter the ingredients you have and get recipe suggestions instantly.

- **Recipe Recommendations**  
  Personalized suggestions based on available ingredients and dietary preferences.

- **Step-by-Step Instructions**  
  Clear and easy-to-follow cooking instructions for each recipe.

- **Save Recipes**  
  Save favorite recipes for quick access later.

- **Shopping List**  
  Automatically generate a shopping list for missing ingredients from selected recipes.  
  Items can be checked off while shopping.

## 🧩 Future Implementations

- **Accounts Management**  
- **Family Access**  
- **Smart Substitutions**  
- **AI-Powered Suggestions**  
- **Menu Generator (daily / weekly / monthly)**  
- **Random Theme Menu** (Italian, Vegetarian, Quick 20-min meals, etc.)  
- **Nutrition Tracking** (calories & macros)  
- **Delivery Option**  
- **Family Sharing**  
- **Share Recipes**

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript
- **Backend:** Go
- **Deployment:** Fly.io, GitHub pages

## ⚡ Quick Start

```
git clone https://github.com/yourusername/dish-dash.git
```

**Frontend:**
```
cd DishDash/frontend
npm install
npm run dev
```
The app will be available at:
```
http://localhost:5173
```

***Environment configuration***

The frontend requires a backend API URL to be defined via an environment variable.

Create a .env file in the frontend directory and set:

```
VITE_API_URL=http://localhost:8080
```

Restart the development server after updating the `.env` file.

**Backend:**
```
cd DishDash/backend
go build
./DishDash
```
The server will be available at:

http://localhost:8080

## 📂 Documentation

- docs/overview.md – Project concept and goals
- docs/features.md – Detailed feature descriptions and future improvements
- docs/architecture.md – Backend structure and API design
- docs/usage.md – How to use the app

## 🖼️ Assets & Credits

- ⚠️ All recipes are AI-generated and provided for demonstration purposes only. Do not use for cooking.
- Images are taken from  https://www.pexels.com/ and used for demonstration purposes only
- Country flags are fetched from [REST Countries API](https://restcountries.com/) — a free API providing country data including flags, languages, and more
