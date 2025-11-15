package getabec.backend.product.dto;

import lombok.*;
import java.util.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductDetailDto {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String brandName;
    private String categoryName;
    private String thumbnailUrl;
    private String datasheetUrl;
    @Builder.Default
    private List<ImageDto> images = new ArrayList<>();
    @Builder.Default
    private List<VariantDto> variants = new ArrayList<>();
}
