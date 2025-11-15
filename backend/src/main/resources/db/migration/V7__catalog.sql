-- =============================================
-- V7 – Seed thêm 100 sản phẩm công nghiệp
-- Lò hơi – Cơ khí – Máy móc – Thiết bị phụ trợ
-- =============================================

------------------------
-- 1. Brands (an toàn)
------------------------
INSERT INTO brand (name, slug)
SELECT 'FASUCO', 'fasuco'
    WHERE NOT EXISTS (SELECT 1 FROM brand WHERE slug='fasuco');

INSERT INTO brand (name, slug)
SELECT 'MIURA', 'miura'
    WHERE NOT EXISTS (SELECT 1 FROM brand WHERE slug='miura');

INSERT INTO brand (name, slug)
SELECT 'HANA', 'hana'
    WHERE NOT EXISTS (SELECT 1 FROM brand WHERE slug='hana');

INSERT INTO brand (name, slug)
SELECT 'INOXPRO', 'inoxpro'
    WHERE NOT EXISTS (SELECT 1 FROM brand WHERE slug='inoxpro');

------------------------
-- 2. Categories (safe)
------------------------
INSERT INTO category (name, slug)
SELECT 'Lò hơi công nghiệp', 'lo-hoi'
    WHERE NOT EXISTS (SELECT 1 FROM category WHERE slug='lo-hoi');

INSERT INTO category (name, slug)
SELECT 'Thiết bị áp lực', 'thiet-bi-ap-luc'
    WHERE NOT EXISTS (SELECT 1 FROM category WHERE slug='thiet-bi-ap-luc');

INSERT INTO category (name, slug)
SELECT 'Đường ống – Van – Phụ kiện', 'duong-ong-van'
    WHERE NOT EXISTS (SELECT 1 FROM category WHERE slug='duong-ong-van');

INSERT INTO category (name, slug)
SELECT 'Cơ khí – Chế tạo máy', 'co-khi'
    WHERE NOT EXISTS (SELECT 1 FROM category WHERE slug='co-khi');


-----------------------------------------
-- 3. Insert 100 sản phẩm (no duplicate)
-----------------------------------------

-- Lò hơi nhóm 1 (20 sản phẩm) ---------------------------------
INSERT INTO product(name, slug, description, brand_id, category_id, thumbnail_url)
SELECT 'Lò hơi đốt than 300kg/h', 'lo-hoi-dot-than-300kg-h',
       'Lò hơi công nghiệp đốt than công suất 300kg/h.',
       1, 1, 'https://placehold.co/600x400?text=300kg/h'
    WHERE NOT EXISTS (SELECT 1 FROM product WHERE slug='lo-hoi-dot-than-300kg-h');

INSERT INTO product(name, slug, description, brand_id, category_id, thumbnail_url)
SELECT 'Lò hơi đốt than 400kg/h', 'lo-hoi-dot-than-400kg-h',
       'Lò hơi công nghiệp đốt than công suất 400kg/h.',
       1, 1, 'https://placehold.co/600x400?text=400kg/h'
    WHERE NOT EXISTS (SELECT 1 FROM product WHERE slug='lo-hoi-dot-than-400kg-h');

INSERT INTO product(name, slug, description, brand_id, category_id, thumbnail_url)
SELECT 'Lò hơi đốt than 500kg/h', 'lo-hoi-dot-than-500kg-h',
       'Lò hơi công nghiệp đốt than công suất 500kg/h.',
       1, 1, 'https://placehold.co/600x400?text=500kg/h'
    WHERE NOT EXISTS (SELECT 1 FROM product WHERE slug='lo-hoi-dot-than-500kg-h');

INSERT INTO product(name, slug, description, brand_id, category_id, thumbnail_url)
SELECT 'Lò hơi đốt than 600kg/h', 'lo-hoi-dot-than-600kg-h',
       'Lò hơi công nghiệp đốt than công suất 600kg/h.',
       1, 1, 'https://placehold.co/600x400?text=600kg/h'
    WHERE NOT EXISTS (SELECT 1 FROM product WHERE slug='lo-hoi-dot-than-600kg-h');

INSERT INTO product(name, slug, description, brand_id, category_id, thumbnail_url)
SELECT 'Lò hơi đốt than 800kg/h', 'lo-hoi-dot-than-800kg-h',
       'Lò hơi công nghiệp công suất 800kg/h.',
       1, 1, 'https://placehold.co/600x400?text=800kg/h'
    WHERE NOT EXISTS (SELECT 1 FROM product WHERE slug='lo-hoi-dot-than-800kg-h');

-- (tương tự lò hơi lên đến 20 sản phẩm)
DO $$
DECLARE
i INTEGER;
BEGIN
FOR i IN 1..15 LOOP
     INSERT INTO product(name, slug, description, brand_id, category_id, thumbnail_url)
SELECT
    'Lò hơi công nghiệp model ' || i,
    'lo-hoi-model-' || i,
    'Lò hơi công nghiệp đa nhiên liệu model ' || i,
    2, 1,
    'https://placehold.co/600x400?text=Lo+Hoi+' || i
    WHERE NOT EXISTS (SELECT 1 FROM product WHERE slug='lo-hoi-model-' || i);
END LOOP;
END$$;


-- Van & đường ống (30 sản phẩm) -------------------------------
DO $$
DECLARE
i INTEGER;
BEGIN
FOR i IN 1..30 LOOP
     INSERT INTO product(name, slug, description, brand_id, category_id, thumbnail_url)
SELECT
    'Van cầu thép DN' || (i+40),
    'van-cau-thep-dn' || (i+40),
    'Van cầu thép tiêu chuẩn PN16, DN' || (i+40),
    3, 3,
    'https://placehold.co/600x400?text=Valve+' || (i+40)
    WHERE NOT EXISTS (SELECT 1 FROM product WHERE slug='van-cau-thep-dn' || (i+40));
END LOOP;
END$$;


-- Bồn áp lực – Bình chứa khí (20 sản phẩm) --------------------
DO $$
DECLARE
i INTEGER;
BEGIN
FOR i IN 1..20 LOOP
     INSERT INTO product(name, slug, description, brand_id, category_id, thumbnail_url)
SELECT
    'Bồn áp lực 500L model ' || i,
    'bon-ap-luc-500l-' || i,
    'Bồn áp lực 500L tiêu chuẩn ASME model ' || i,
    4, 2,
    'https://placehold.co/600x400?text=Tank+' || i
    WHERE NOT EXISTS (SELECT 1 FROM product WHERE slug='bon-ap-luc-500l-' || i);
END LOOP;
END$$;


-- Cơ khí – Chế tạo máy (30 sản phẩm) --------------------------
DO $$
DECLARE
i INTEGER;
BEGIN
FOR i IN 1..30 LOOP
     INSERT INTO product(name, slug, description, brand_id, category_id, thumbnail_url)
SELECT
    'Băng tải công nghiệp model ' || i,
    'bang-tai-model-' || i,
    'Băng tải PVC khung thép model ' || i,
    4, 4,
    'https://placehold.co/600x400?text=Belt+' || i
    WHERE NOT EXISTS (SELECT 1 FROM product WHERE slug='bang-tai-model-' || i);
END LOOP;
END$$;


--------------------------------------------
-- 4. Sinh 2 biến thể cho MỌI sản phẩm mới
--------------------------------------------
DO $$
DECLARE
r RECORD;
BEGIN
FOR r IN (SELECT id FROM product ORDER BY id) LOOP
     INSERT INTO product_variant(product_id, sku, material, size_text, price, stock_qty, is_default)
SELECT r.id,
       'SKU-' || r.id || '-A',
       'Thép C45',
       'Option A',
       100000 + (r.id * 10),
       50,
       TRUE
    WHERE NOT EXISTS (SELECT 1 FROM product_variant WHERE sku='SKU-' || r.id || '-A');

INSERT INTO product_variant(product_id, sku, material, size_text, price, stock_qty, is_default)
SELECT r.id,
       'SKU-' || r.id || '-B',
       'Inox 304',
       'Option B',
       120000 + (r.id * 10),
       30,
       FALSE
    WHERE NOT EXISTS (SELECT 1 FROM product_variant WHERE sku='SKU-' || r.id || '-B');
END LOOP;
END$$;
