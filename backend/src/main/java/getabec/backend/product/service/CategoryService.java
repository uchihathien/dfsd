package getabec.backend.product.service;

import getabec.backend.product.dto.CategoryNodeDto;
import getabec.backend.product.model.Category;
import getabec.backend.product.repo.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepo;

    public List<CategoryNodeDto> getTree() {
        List<Category> all = categoryRepo.findAll();
        Map<Long, CategoryNodeDto> map = new HashMap<>();
        all.forEach(c -> map.put(c.getId(), CategoryNodeDto.builder()
                .id(c.getId()).name(c.getName()).slug(c.getSlug()).children(new ArrayList<>()).build()));

        List<CategoryNodeDto> roots = new ArrayList<>();
        for (Category c : all) {
            CategoryNodeDto node = map.get(c.getId());
            if (c.getParent() != null) {
                map.get(c.getParent().getId()).getChildren().add(node);
            } else {
                roots.add(node);
            }
        }
        // sắp xếp tên cho dễ nhìn
        Comparator<CategoryNodeDto> byName = Comparator.comparing(CategoryNodeDto::getName, String.CASE_INSENSITIVE_ORDER);
        roots = roots.stream().sorted(byName).collect(Collectors.toList());
        roots.forEach(r -> r.getChildren().sort(byName));
        return roots;
    }
}
