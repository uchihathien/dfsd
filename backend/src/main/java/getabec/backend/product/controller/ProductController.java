package getabec.backend.product.controller;

import getabec.backend.product.dto.ProductDetailDto;
import getabec.backend.product.dto.ProductListItemDto;
import getabec.backend.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public Page<ProductListItemDto> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return productService.search(q, brandId, categoryId, page, size);
    }

    @GetMapping("/{slug}")
    public ProductDetailDto bySlug(@PathVariable String slug) {
        return productService.getBySlug(slug);
    }
}
