package getabec.backend.product.repo;

import getabec.backend.product.model.Product;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySlug(String slug);

    @Query("""
       select p from Product p
       where (:q is null or lower(p.name) like lower(concat('%', cast(:q as string), '%')))
         and (:brandId is null or p.brand.id = :brandId)
         and (:categoryId is null or p.category.id = :categoryId)
         and p.active = true
""")
    Page<Product> search(@Param("q") String q,
                         @Param("brandId") Long brandId,
                         @Param("categoryId") Long categoryId,
                         Pageable pageable);
}
