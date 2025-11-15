package getabec.backend.product.controller;

import getabec.backend.product.dto.CategoryNodeDto;
import getabec.backend.product.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping
    public List<CategoryNodeDto> tree() {
        return categoryService.getTree();
    }
}
