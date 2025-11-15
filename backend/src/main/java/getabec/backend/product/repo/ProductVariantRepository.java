package getabec.backend.product.repo;

import getabec.backend.product.model.ProductVariant;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.*;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    interface MinPriceView {
        Long getProductId();
        BigDecimal getMinPrice();
    }

    @Query("select v.product.id as productId, min(v.price) as minPrice " +
            "from ProductVariant v where v.product.id in :ids group by v.product.id")
    List<MinPriceView> findMinPriceByProductIds(@Param("ids") Collection<Long> ids);

    List<ProductVariant> findByProductIdOrderByIsDefaultDescIdAsc(Long productId);
}
