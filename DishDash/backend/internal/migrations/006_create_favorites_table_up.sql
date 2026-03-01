CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    recipe_id INT REFERENCES recipes(id),
    created_at TIMESTAMP DEFAULT NOW()
);
