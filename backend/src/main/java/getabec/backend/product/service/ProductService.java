package getabec.backend.product.service;

import getabec.backend.product.dto.*;
import getabec.backend.product.model.Product;
import getabec.backend.product.model.ProductImage;
import getabec.backend.product.model.ProductVariant;
import getabec.backend.product.repo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepo;
    private final ProductVariantRepository variantRepo;

    public Page<ProductListItemDto> search(String q, Long brandId, Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<Product> res = productRepo.search(emptyToNull(q), brandId, categoryId, pageable);

        List<Long> ids = res.stream().map(Product::getId).toList();
        Map<Long, BigDecimal> minPrice = variantRepo.findMinPriceByProductIds(ids).stream()
                .collect(Collectors.toMap(ProductVariantRepository.MinPriceView::getProductId,
                        ProductVariantRepository.MinPriceView::getMinPrice));

        return res.map(p -> ProductListItemDto.builder()
                .id(p.getId())
                .name(p.getName())
                .slug(p.getSlug())
                .thumbnailUrl(p.getThumbnailUrl())
                .brandName(p.getBrand() != null ? p.getBrand().getName() : null)
                .priceFrom(minPrice.getOrDefault(p.getId(), BigDecimal.ZERO))
                .build());
    }

    public ProductDetailDto getBySlug(String slug) {
        Product p = productRepo.findBySlug(slug)
                .orElseThrow(() -> new NoSuchElementException("Product not found"));
        List<ProductVariant> variants = variantRepo.findByProductIdOrderByIsDefaultDescIdAsc(p.getId());

        List<ImageDto> imgs = p.getImages().stream()
                .map(this::toImageDto).toList();
        List<VariantDto> vars = variants.stream().map(this::toVariantDto).toList();

        return ProductDetailDto.builder()
                .id(p.getId()).name(p.getName()).slug(p.getSlug())
                .description(p.getDescription())
                .brandName(p.getBrand() != null ? p.getBrand().getName() : null)
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                .thumbnailUrl(p.getThumbnailUrl())
                .datasheetUrl(p.getDatasheetUrl())
                .images(imgs).variants(vars)
                .build();
    }

    private ImageDto toImageDto(ProductImage i) {
        return ImageDto.builder().id(i.getId()).url(i.getImageUrl()).sortOrder(i.getSortOrder()).build();
    }
    private VariantDto toVariantDto(ProductVariant v) {
        return VariantDto.builder()
                .id(v.getId()).sku(v.getSku())
                .material(v.getMaterial()).sizeText(v.getSizeText())
                .weightKg(v.getWeightKg()).price(v.getPrice())
                .stockQty(v.getStockQty()).isDefault(v.isDefault()).build();
    }

    private String emptyToNull(String s) {
        return (s == null || s.isBlank()) ? null : s;
    }
}
