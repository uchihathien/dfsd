package getabec.backend.cart.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDto {
    private Long id;              // cart item id
    private Long variantId;
    private String sku;
    private String productName;
    private String thumbnailUrl;
    private BigDecimal price;
    private Integer quantity;
    private Integer stockQty;
}