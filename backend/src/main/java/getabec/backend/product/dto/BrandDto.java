package getabec.backend.product.dto;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BrandDto {
    private Long id;
    private String name;
    private String slug;
}
