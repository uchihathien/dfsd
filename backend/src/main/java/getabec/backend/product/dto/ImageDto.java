package getabec.backend.product.dto;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ImageDto {
    private Long id;
    private String url;
    private Integer sortOrder;
}
