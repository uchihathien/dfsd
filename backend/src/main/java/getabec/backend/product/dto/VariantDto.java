package getabec.backend.product.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VariantDto {
    private Long id;
    private String sku;
    private String material;
    private String sizeText;
    private BigDecimal weightKg;
    private BigDecimal price;
    private Integer stockQty;
    private boolean isDefault;
}
