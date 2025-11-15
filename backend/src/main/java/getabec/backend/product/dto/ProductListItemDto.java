package getabec.backend.product.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductListItemDto {
    private Long id;
    private String name;
    private String slug;
    private String thumbnailUrl;
    private String brandName;
    private BigDecimal priceFrom; // min price among variants
}
