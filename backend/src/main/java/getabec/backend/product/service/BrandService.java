package getabec.backend.product.service;

import getabec.backend.product.dto.BrandDto;
import getabec.backend.product.model.Brand;
import getabec.backend.product.repo.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service @RequiredArgsConstructor
public class BrandService {
    private final BrandRepository brandRepo;

    public List<BrandDto> getAll() {
        return brandRepo.findAll().stream()
                .map(b -> BrandDto.builder().id(b.getId()).name(b.getName()).slug(b.getSlug()).build())
                .toList();
    }
}
