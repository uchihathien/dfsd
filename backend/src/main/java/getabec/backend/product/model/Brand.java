package getabec.backend.product.model;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "brand")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Brand {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, unique=true)
    private String slug;

    @Column(nullable=false)
    private String name;

    @Column(columnDefinition = "text")
    private String description;
}
