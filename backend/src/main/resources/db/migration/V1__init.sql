CREATE TABLE IF NOT EXISTS products (
                                        id BIGSERIAL PRIMARY KEY,
                                        name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    price NUMERIC(12,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT now()
    );

INSERT INTO products (name, slug, price, stock) VALUES
                                                    ('Máy khoan bàn 500W', 'may-khoan-ban-500w', 1500000, 10),
                                                    ('Mỏ lết thép 12"', 'mo-let-thep-12in', 120000, 50);
