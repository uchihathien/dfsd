package getabec.backend.product.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity @Table(name = "product")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, unique=true)
    private String slug;

    @Column(nullable=false)
    private String name;

    @Column(columnDefinition = "text")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name="brand_id")
    private Brand brand;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name="category_id")
    private Category category;

    private String thumbnailUrl;
    private String datasheetUrl;
    private boolean active = true;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<ProductImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariant> variants = new ArrayList<>();
}
