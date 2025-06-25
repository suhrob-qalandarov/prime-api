package org.exp.primeapp.service.impl.user;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.CategoryReq;
import org.exp.primeapp.models.dto.responce.ApiResponse;
import org.exp.primeapp.models.dto.responce.CategoryRes;
import org.exp.primeapp.models.entities.Category;
import org.exp.primeapp.models.entities.Product;
import org.exp.primeapp.models.entities.Spotlight;
import org.exp.primeapp.repository.CategoryRepository;
import org.exp.primeapp.repository.ProductRepository;
import org.exp.primeapp.repository.SpotlightRepository;
import org.exp.primeapp.service.interfaces.user.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final SpotlightRepository spotlightRepository;

    @Transactional
    @Override
    public ApiResponse saveCategory(CategoryReq categoryReq) {
        Category category;
        Optional<Spotlight> optionalSpotlight = spotlightRepository.findById(categoryReq.spotlightId());

        if (optionalSpotlight.isEmpty()) {
            category = Category.builder()
                    .name(categoryReq.name())
                    .spotlight(null)
                    .active(true)
                    .build();
        } else {
            Spotlight spotlight = optionalSpotlight.get();
            category = Category.builder()
                    .name(categoryReq.name())
                    .spotlight(spotlight)
                    .active(true)
                    .build();
        }
        categoryRepository.save(category);
        return new ApiResponse(true, "Category saved successfully");
    }

    @Override
    public ApiResponse updateCategoryById(Long categoryId, CategoryReq categoryReq) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(RuntimeException::new);
        category.setName(categoryReq.name());
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
    public List<CategoryRes> getCategories() {
        return categoryRepository.findByActive(true).stream()
                .map(category -> new CategoryRes(
                        category.getId(),
                        category.getName()
                ))
                .toList();
    }

    @Override
    public Category getCategoryByIdForAdmin(Long categoryId) {
        return categoryRepository.findById(categoryId).orElseThrow(RuntimeException::new);
    }

    @Override
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    @Override
    public List<CategoryRes> getInactiveCategories() {
        return categoryRepository.findByActive(false).stream()
                .map(category -> new CategoryRes(
                        category.getId(),
                        category.getName()
                )).toList();
    }

    @Override
    public List<CategoryRes> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(category -> new CategoryRes(
                        category.getId(),
                        category.getName()
                )).toList();
    }

    public CategoryRes convertToCategoryRes(Category category) {
        return new CategoryRes(
                category.getId(),
                category.getName()
        );
    }
}
