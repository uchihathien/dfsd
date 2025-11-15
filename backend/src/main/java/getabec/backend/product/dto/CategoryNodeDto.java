package getabec.backend.product.dto;
import lombok.*;
import java.util.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CategoryNodeDto {
    private Long id;
    private String name;
    private String slug;
    @Builder.Default
    private List<CategoryNodeDto> children = new ArrayList<>();
}
