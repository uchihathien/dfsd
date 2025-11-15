package getabec.backend.product.controller;

import getabec.backend.product.dto.BrandDto;
import getabec.backend.product.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
public class BrandController {
    private final BrandService brandService;

    @GetMapping
    public List<BrandDto> list() {
        return brandService.getAll();
    }
}
