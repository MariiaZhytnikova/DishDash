CREATE TABLE IF NOT EXISTS fridge (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    section VARCHAR(50), -- 'fresh', 'pantry', 'rare'
    ingredient_name VARCHAR(255),
    quantity FLOAT,
    unit VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
