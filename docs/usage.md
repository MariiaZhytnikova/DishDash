# Usage Guide

This document explains how to use Dish Dash from a user’s perspective.

## 1. Search Recipes by Ingredients

1. Open the Dish Dash application.
2. Manage your available ingredients.
3. Search for recipes.
4. The app displays a list of matching recipes.

The results prioritize recipes that use the highest number of provided ingredients.

## 2. View Recipe Details

1. Select a recipe from the results list.
2. View:
   - Required ingredients
   - Step-by-step cooking instructions
   - **Cook** button automaticaly decrease availible ingridients

## 3. Save Recipes

1. Open a recipe.
2. Click the **Like** icon in top left corner of image.
3. The recipe is added to your favorite recipes list.

Saved recipes can be accessed later for quick reference.

## 4. Generate a Shopping List

1. Select one or more recipes.
2. Click **Generate Shopping List**.
3. The app identifies missing ingredients and creates a consolidated list.

## 5. Manage the Shopping List

- Check off items as they are purchased.
- The list updates in real time.

This feature helps users organize grocery shopping efficiently.

## 6. Using the App with a Deployed Backend

By default, the frontend communicates with the backend API using the URL defined in the environment configuration:

```env
VITE_API_URL=https://backend-ancient-waterfall-8399.fly.dev
```

Ensure the backend is running and accessible before using the app.

Notes

- No account is required for the current version.
- All data is stored in .json files.
- Additional features such as user accounts, family sharing, and nutrition tracking are planned for future releases.

Troubleshooting

- If no recipes appear, verify that the backend API is running.
- If changes to environment variables do not apply, restart the frontend development server.