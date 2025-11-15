package getabec.backend.cart.dto;

import getabec.backend.cart.dto.CartItemDto;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDto {
    private UUID id;
    @Builder.Default
    private List<CartItemDto> items = new ArrayList<>();
    private BigDecimal subtotal;
    private Integer totalQty;
}