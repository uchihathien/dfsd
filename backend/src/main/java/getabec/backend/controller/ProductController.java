package getabec.backend.controller;

import getabec.backend.entity.Product;
import getabec.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductRepository repo;

    @GetMapping
    public List<Product> all() {
        return repo.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    @PostMapping
    public ResponseEntity<Product> create(@Valid @RequestBody Product p) {
        return ResponseEntity.ok(repo.save(p));
    }
}
