package org.exp.primeapp.service.impl.user;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.CategoryReq;
import org.exp.primeapp.models.dto.responce.admin.AdminCategoryDashboardRes;
import org.exp.primeapp.models.dto.responce.user.CategoryRes;
import org.exp.primeapp.models.dto.responce.admin.AdminCategoryRes;
import org.exp.primeapp.models.entities.Category;
import org.exp.primeapp.models.entities.Product;
import org.exp.primeapp.repository.CategoryRepository;
import org.exp.primeapp.repository.ProductRepository;
import org.exp.primeapp.service.face.user.CategoryService;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    @Value("${app.categories.update-offset-minutes}")
    private long updateOffsetMinutes;

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");

    @Override
    public List<CategoryRes> getResCategoriesBySpotlightName(String spotlightName) {
        return categoryRepository.findBySpotlightNameAndActive(spotlightName, true)
                .stream()
                .map(category -> new CategoryRes(
                        category.getId(),
                        category.getName(),
                        category.getSpotlightName()
                ))
                .toList();
    }

    public List<CategoryRes> getResCategories() {
        return categoryRepository.findByActive(true).stream()
                .map(category -> new CategoryRes(
                        category.getId(),
                        category.getName(),
                        category.getSpotlightName()
                ))
                .toList();
    }

    @Override
    public AdminCategoryRes getAdminCategoryResById(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with telegramId: " + categoryId));
        return convertToAdminCategoryRes(category);
    }

    public AdminCategoryDashboardRes getCategoryDashboardRes() {
        List<AdminCategoryRes> categoryResList = categoryRepository.findAllByOrderByOrderNumberAsc().stream()
                .map(this::convertToAdminCategoryRes)
                .toList();

        long totalCount = categoryResList.size();
        long activeCount = categoryResList.stream().filter(AdminCategoryRes::active).count();
        long inactiveCount = categoryResList.stream().filter(p -> !p.active()).count();

        return AdminCategoryDashboardRes.builder()
                .totalCount(totalCount)
                .activeCount(activeCount)
                .inactiveCount(inactiveCount)
                .responseDate(LocalDateTime.now().plusMinutes(updateOffsetMinutes))
                .categoryResList(categoryResList)
                .build();
    }

    @Override
    public AdminCategoryRes saveCategory(@NonNull CategoryReq categoryReq) {
        Category saved = categoryRepository.save(
                Category.builder()
                        .name(categoryReq.name())
                        .spotlightName(
                                categoryReq.spotlightName() != null && !categoryReq.spotlightName().isBlank()
                                        ? categoryReq.spotlightName()
                                        : null
                        )
                        .active(false)
                        .build()
        );
        System.out.println("Category saved successfully");
        return convertToAdminCategoryRes(saved);
    }

    @Transactional
    @Override
    public AdminCategoryRes updateCategoryById(Long categoryId, @NonNull CategoryReq categoryReq) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(RuntimeException::new);
        category.setName(categoryReq.name());
        category.setSpotlightName(categoryReq.spotlightName());
        Category saved = categoryRepository.save(category);
        System.out.println("Category updated successfully");
        return convertToAdminCategoryRes(saved);
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

    @Transactional
    @Override
    public List<AdminCategoryRes> updateCategoryOrder(@NonNull Map<Long, Long> categoryOrderMap) {
        List<Category> categories = categoryRepository.findAllById(categoryOrderMap.keySet());

        for (Category category : categories) {
            Long newOrder = categoryOrderMap.get(category.getId());
            category.setOrderNumber(newOrder);
        }

        return categoryRepository.saveAll(categories).stream().map(this::convertToAdminCategoryRes).toList();
    }

    public CategoryRes convertToCategoryRes(@NonNull Category category) {
        return new CategoryRes(
                category.getId(),
                category.getName(),
                category.getSpotlightName()
        );
    }

    public AdminCategoryRes convertToAdminCategoryRes(@NonNull Category category) {
        long countByCategory = productRepository.countByCategoryId(category.getId());
        return new AdminCategoryRes(
                category.getId(),
                category.getName(),
                category.getSpotlightName(),
                category.getOrderNumber(),
                category.getActive(),
                countByCategory,
                category.getCreatedAt() != null ? category.getCreatedAt().format(formatter) : null
        );
    }

}
