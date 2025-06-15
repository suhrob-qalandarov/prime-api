package org.exp.primeapp.service.impl;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.CategoryReq;
import org.exp.primeapp.models.dto.responce.ApiResponse;
import org.exp.primeapp.models.dto.responce.CategoryRes;
import org.exp.primeapp.models.entities.Attachment;
import org.exp.primeapp.models.entities.Category;
import org.exp.primeapp.models.entities.Product;
import org.exp.primeapp.models.repo.AttachmentRepository;
import org.exp.primeapp.models.repo.CategoryRepository;
import org.exp.primeapp.models.repo.ProductRepository;
import org.exp.primeapp.service.interfaces.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final AttachmentRepository attachmentRepository;

    @Transactional
    @Override
    public ApiResponse saveCategory(CategoryReq categoryReq) {
        Attachment attachment = attachmentRepository.findById(categoryReq.getAttachmentId())
                .orElseThrow(() -> new RuntimeException("Attachment not found with id: " + categoryReq.getAttachmentId()));

        Category category = Category.builder()
                .name(categoryReq.getName())
                .attachment(attachment)
                .active(categoryReq.getActive())
                .build();

        categoryRepository.save(category);

        return new ApiResponse(true, "Category saved successfully");
    }

    @Override
    public ApiResponse updateCategoryById(Long categoryId, CategoryReq categoryReq) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(RuntimeException::new);
        category.setName(categoryReq.getName());
        category.setActive(categoryReq.getActive());
        categoryRepository.save(category);

        return new ApiResponse(true, "Category updated successfully");
    }

    @Transactional
    @Override
    public ApiResponse deactivateCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(RuntimeException::new);
        category.setActive(false);
        categoryRepository.save(category);

        List<Product> products = productRepository.findAllByCategory(category);
        products.forEach(product -> product.setActive(false));
        productRepository.saveAll(products);

        return new ApiResponse(true, "Category active updated successfully");
    }

    @Transactional
    @Override
    public ApiResponse activateCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(RuntimeException::new);
        category.setActive(true);
        categoryRepository.save(category);

        return new ApiResponse(true, "Category activated successfully");
    }

    @Transactional
    @Override
    public ApiResponse activateCategoryWithProducts(Long categoryId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(RuntimeException::new);
        category.setActive(true);
        categoryRepository.save(category);

        List<Product> products = productRepository.findAllByCategory(category);
        products.forEach(product -> product.setActive(true));
        productRepository.saveAll(products);

        return new ApiResponse(true, "Category and category products activated successfully");
    }

    @Override
    public CategoryRes getCategoryById(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
        return convertToCategoryRes(category);
    }

    @Override
    public List<CategoryRes> getActiveCategories() {
        return categoryRepository.findByActive(true).stream()
                .map(category -> new CategoryRes(
                        category.getId(),
                        category.getName(),
                        category.getActive(),
                        category.getAttachment() != null ? category.getAttachment().getId() : null
                ))
                .toList();
    }

    @Override
    public Category getCategoryByIdForAdmin(Long categoryId) {
        return categoryRepository.findById(categoryId).orElseThrow(RuntimeException::new);
    }

    @Override
    public List<CategoryRes> getInactiveCategories() {
        return categoryRepository.findByActive(false).stream()
                .map(category -> new CategoryRes(
                        category.getId(),
                        category.getName(),
                        category.getActive(),
                        category.getAttachment() != null ? category.getAttachment().getId() : null
                )).toList();
    }

    @Override
    public List<CategoryRes> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(category -> new CategoryRes(
                        category.getId(),
                        category.getName(),
                        category.getActive(),
                        category.getAttachment() != null ? category.getAttachment().getId() : null
                )).toList();
    }

    private CategoryRes convertToCategoryRes(Category category) {
        return new CategoryRes(
                category.getId(),
                category.getName(),
                category.getActive(),
                category.getAttachment().getId()
        );
    }
}
