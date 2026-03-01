CREATE TABLE IF NOT EXISTS ingredients (
    id SERIAL PRIMARY KEY,
    recipe_id INT REFERENCES recipes(id),
    name VARCHAR(255),
    quantity FLOAT,
    unit VARCHAR(50)
);
