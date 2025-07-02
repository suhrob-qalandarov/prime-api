package org.exp.primeapp.service.impl.user;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.CategoryReq;
import org.exp.primeapp.models.dto.responce.user.CategoryRes;
import org.exp.primeapp.models.dto.responce.admin.AdminCategoryRes;
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
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final SpotlightRepository spotlightRepository;

    public List<CategoryRes> getResCategories() {
        return categoryRepository.findByActive(true).stream()
                .map(category -> new CategoryRes(
                        category.getId(),
                        category.getName()
                ))
                .toList();
    }

    @Override
    public CategoryRes getCategoryResById(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
        return convertToCategoryRes(category);
    }

    @Override
    public List<Category> getCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId).orElseThrow(RuntimeException::new);
    }

    @Transactional
    @Override
    public void saveCategory(CategoryReq categoryReq) {
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
        System.out.println("Category saved successfully");
    }

    @Override
    public void updateCategoryById(Long categoryId, CategoryReq categoryReq) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(RuntimeException::new);
        category.setName(categoryReq.name());
        categoryRepository.save(category);

        System.out.println("Category updated successfully");
    }

    public void toggleCategoryActiveStatus(Long categoryId) {
        categoryRepository.toggleCategoryActiveStatus(categoryId);
    }

    @Transactional
    @Override
    public void toggleCategoryActiveStatusWithProductActiveStatus(Long categoryId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow();
        Boolean active = category.getActive();

        if (active) {
            deactivateCategoryWithProducts(categoryId);

        } else {
            activateCategoryWithProducts(categoryId);
        }
    }

    @Transactional
    public void deactivateCategoryWithProducts(Long categoryId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(RuntimeException::new);
        category.setActive(false);
        categoryRepository.save(category);

        List<Product> products = productRepository.findAllByCategory(category);
        products.forEach(product -> product.setActive(false));
        productRepository.saveAll(products);

        System.out.println("Category active updated successfully");
    }

    @Transactional
    public void activateCategoryWithProducts(Long categoryId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(RuntimeException::new);
        category.setActive(true);
        categoryRepository.save(category);

        List<Product> products = productRepository.findAllByCategory(category);
        products.forEach(product -> product.setActive(true));
        productRepository.saveAll(products);

        System.out.println("Category and category products activated successfully");
    }

    @Override
    public List<CategoryRes> getSpotlightCategories(Long spotlightId) {
        return categoryRepository.findAllBySpotlightId(spotlightId).stream()
                .map(category -> new CategoryRes(
                        category.getId(),
                        category.getName()))
                .toList();
    }

    @Override
    public List<AdminCategoryRes> updateCategoryOrder(Map<Long, Integer> categoryOrderMap) {
        List<Category> categories = categoryRepository.findAllById(categoryOrderMap.keySet());

        for (Category category : categories) {
            Integer newOrder = categoryOrderMap.get(category.getId());
            category.setOrderNumber(newOrder);
        }

        return categoryRepository.saveAll(categories).stream().map(this::convertToAdminCategoryRes).toList();
    }

    public CategoryRes convertToCategoryRes(Category category) {
        return new CategoryRes(
                category.getId(),
                category.getName()
        );
    }

    public AdminCategoryRes convertToAdminCategoryRes(Category category) {
        return new AdminCategoryRes(
                category.getId(),
                category.getName(),
                category.getActive()
        );
    }

}
