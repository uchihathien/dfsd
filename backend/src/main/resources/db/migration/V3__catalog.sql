-- Brand
CREATE TABLE brand (
                       id BIGSERIAL PRIMARY KEY,
                       name        VARCHAR(255) NOT NULL,
                       slug        VARCHAR(255) NOT NULL UNIQUE,
                       description TEXT,
                       created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Category (cây danh mục)
CREATE TABLE category (
                          id BIGSERIAL PRIMARY KEY,
                          name        VARCHAR(255) NOT NULL,
                          slug        VARCHAR(255) NOT NULL UNIQUE,
                          description TEXT,
                          parent_id   BIGINT REFERENCES category(id) ON DELETE SET NULL,
                          created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Product
CREATE TABLE product (
                         id BIGSERIAL PRIMARY KEY,
                         name         VARCHAR(255) NOT NULL,
                         slug         VARCHAR(255) NOT NULL UNIQUE,
                         description  TEXT,
                         brand_id     BIGINT REFERENCES brand(id) ON DELETE SET NULL,
                         category_id  BIGINT REFERENCES category(id) ON DELETE SET NULL,
                         thumbnail_url TEXT,
                         datasheet_url TEXT,
                         active       BOOLEAN NOT NULL DEFAULT TRUE,
                         created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Product images
CREATE TABLE product_image (
                               id BIGSERIAL PRIMARY KEY,
                               product_id BIGINT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
                               image_url  TEXT NOT NULL,
                               sort_order INT NOT NULL DEFAULT 0
);

-- Product variants (SKU)
CREATE TABLE product_variant (
                                 id BIGSERIAL PRIMARY KEY,
                                 product_id BIGINT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
                                 sku        VARCHAR(120) NOT NULL UNIQUE,
                                 material   VARCHAR(120),
                                 size_text  VARCHAR(120),      -- ví dụ: "6204", "M6x1.0", "16x5"
                                 weight_kg  NUMERIC(10,3),
                                 price      NUMERIC(18,2) NOT NULL,
                                 stock_qty  INT NOT NULL DEFAULT 0,
                                 is_default BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_product_variant_product ON product_variant(product_id);
CREATE INDEX idx_product_brand ON product(brand_id);
CREATE INDEX idx_product_category ON product(category_id);
