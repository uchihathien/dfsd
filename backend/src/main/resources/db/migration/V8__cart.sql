-- Cart chính (dùng cho cả guest và user)
CREATE TABLE cart (
                      id UUID PRIMARY KEY,
                      user_id BIGINT, -- có thể NULL cho guest
                      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mục trong cart
CREATE TABLE cart_item (
                           id BIGSERIAL PRIMARY KEY,
                           cart_id UUID NOT NULL REFERENCES cart(id) ON DELETE CASCADE,
                           variant_id BIGINT NOT NULL REFERENCES product_variant(id) ON DELETE RESTRICT,
                           quantity INT NOT NULL CHECK (quantity > 0),
                           UNIQUE (cart_id, variant_id)
);

CREATE INDEX idx_cart_item_cart ON cart_item(cart_id);
