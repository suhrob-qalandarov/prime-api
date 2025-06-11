package org.exp.primeapp.service.impl;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.dto.request.CategoryReq;
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

    @Override
    public List<Category> getCategoriesByActive() {
        return categoryRepository.findBy_active(true);
    }

    @Transactional
    @Override
    public Category saveCategory(CategoryReq categoryReq) {
        Long attachmentId = categoryReq.getAttachmentId();
        Attachment attachment = attachmentRepository.findById(attachmentId).get();

        Category category=Category.
                builder()
                .name(categoryReq.getName())
                //.attachment(attachment)
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

    @Transactional
    @Override
    public void updateCategoryActive(Long categoryId) {
        Category category=categoryRepository.findById(categoryId).orElseThrow(RuntimeException::new);
        category.set_active(false);
        categoryRepository.save(category);
        List<Product> products=productRepository.findByCategory(category);
        products.forEach(product->product.set_active(false));
        productRepository.saveAll(products);
    }

    @Override
    public Category getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId).orElseThrow(RuntimeException::new);
    }
}
