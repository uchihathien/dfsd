package getabec.backend.product.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity @Table(name = "product_variant")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductVariant {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name="product_id", nullable=false)
    private Product product;

    @Column(nullable=false, unique=true, length = 120)
    private String sku;

    private String material;     // ví dụ: thép C45, inox 304
    private String sizeText;

    // ví dụ: 6204, M6x1.0, 16x5
    @Column(name = "weight_kg", precision = 18, scale = 3)
    private BigDecimal weightKg;


    @Column(nullable=false, precision = 18, scale = 2)
    private BigDecimal price;

    @Column(nullable=false)
    private Integer stockQty;

    @Column(nullable=false)
    private boolean isDefault = false;
}
