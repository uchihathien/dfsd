

INSERT INTO brand(name, slug) VALUES
                                  ('SKF', 'skf'), ('NSK', 'nsk'), ('YAMAWA', 'yamawa');

INSERT INTO category(name, slug) VALUES
                                     ('Vòng bi', 'vong-bi'), ('Vít me bi', 'vit-me-bi'), ('Đai ốc', 'dai-oc');

-- Products
INSERT INTO product(name, slug, description, brand_id, category_id, thumbnail_url, datasheet_url)
VALUES
    ('Vòng bi 6204', 'vong-bi-6204', 'Vòng bi rãnh sâu 6204', 1, 1,
     'https://placehold.co/600x400?text=6204', null),
    ('Vít me SFU1605', 'vit-me-sfu1605', 'Vít me bi SFU1605', 2, 2,
     'https://placehold.co/600x400?text=SFU1605', null);

-- Variants for 6204
INSERT INTO product_variant(product_id, sku, material, size_text, price, stock_qty, is_default)
VALUES
    (1, '6204-2RS', 'Thép', '6204-2RS', 69000, 50, true),
    (1, '6204-ZZ', 'Thép', '6204-ZZ', 65000, 30, false);

-- Variants for SFU1605
INSERT INTO product_variant(product_id, sku, material, size_text, price, stock_qty, is_default)
VALUES
    (2, 'SFU1605-600', 'Thép C45', 'L=600mm', 450000, 10, true),
    (2, 'SFU1605-1000', 'Thép C45', 'L=1000mm', 690000, 5, false);
