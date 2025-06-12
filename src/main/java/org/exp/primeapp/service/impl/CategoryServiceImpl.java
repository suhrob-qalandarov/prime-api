package org.exp.primeapp.service.impl;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.dto.request.CategoryReq;
import org.exp.primeapp.dto.responce.CategoryRes;
import org.exp.primeapp.dto.responce.ProductRes;
import org.exp.primeapp.models.entities.Attachment;
import org.exp.primeapp.models.entities.Category;
import org.exp.primeapp.models.entities.Product;
import org.exp.primeapp.models.repo.AttachmentRepository;
import org.exp.primeapp.models.repo.CategoryRepository;
import org.exp.primeapp.models.repo.ProductRepository;
import org.exp.primeapp.service.interfaces.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final AttachmentRepository attachmentRepository;

    @Transactional
    @Override
    public CategoryRes saveCategory(CategoryReq categoryReq) {
        Long attachmentId = categoryReq.getAttachmentId();
        Attachment attachment = attachmentRepository.findById(attachmentId).get();

        Category category=Category.
                builder()
                .name(categoryReq.getName())
                .attachment(attachment)
                ._active(categoryReq.getActive())
                .build();

        Category saved = categoryRepository.save(category);

        return CategoryRes.builder()
                .id(saved.getId())
                .name(saved.getName())
                ._active(saved.get_active())
                .attachmentId(saved.getAttachment().getId())
                .build();
    }

    @Override
    public CategoryRes updateCategoryById(Long categoryId, CategoryReq categoryReq) {
        Category category=categoryRepository.findById(categoryId).orElseThrow(RuntimeException::new);
        category.setName(categoryReq.getName());
        category.set_active(categoryReq.getActive());
        Category saved = categoryRepository.save(category);
        return CategoryRes.builder()
                .id(saved.getId())
                .name(saved.getName())
                ._active(saved.get_active())
                .attachmentId(saved.getAttachment().getId())
                .build();
    }

    @Transactional
    @Override
    public CategoryRes updateCategoryActive(Long categoryId) {
        Category category=categoryRepository.findById(categoryId).orElseThrow(RuntimeException::new);
        category.set_active(false);
        categoryRepository.save(category);
        List<Product> products=productRepository.findByCategory(category);
        products.forEach(product->product.set_active(false));
        productRepository.saveAll(products);

        return CategoryRes.builder()
                .id(categoryId)
                .name(category.getName())
                ._active(false)
                .build();
    }

    @Override
    public Category getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId).orElseThrow(RuntimeException::new);
    }

    @Override
    public List<CategoryRes> getCategoriesByActive() {
        return categoryRepository.findBy_active(true)
                .stream()
                .map(this::convertToCategoryRes)
                .collect(Collectors.toList());
    }

    @Override
    public List<Category> getCategoriesByInactive() {
        return categoryRepository.findBy_active(false);
    }

    private CategoryRes convertToCategoryRes(Category category) {
        return new CategoryRes(
                category.getId(),
                category.getName(),
                category.get_active(),
                category.getAttachment().getId()
        );
    }
}
