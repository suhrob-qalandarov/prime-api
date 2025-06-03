package org.exp.primeapp.service.impl.AuthService;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.dto.request.CategoryReq;
import org.exp.primeapp.models.entities.Category;
import org.exp.primeapp.models.repo.CategoryRepository;
import org.exp.primeapp.service.interfaces.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> getCategoriesByActive() {
        return categoryRepository.findBy_active(true);
    }

    @Override
    public Category saveCategory(CategoryReq categoryReq) {
        Category category=Category.
                builder()
                .name(categoryReq.getName())
                ._active(categoryReq.getActive())
                .build();
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategoryById(Long categoryId, CategoryReq categoryReq) {
        Category category=categoryRepository.findById(categoryId).orElseThrow(RuntimeException::new);
        category.setName(categoryReq.getName());
        category.set_active(categoryReq.getActive());
        return categoryRepository.save(category);
    }
}
