CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE raw_material (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    stock_quantity INTEGER NOT NULL
);