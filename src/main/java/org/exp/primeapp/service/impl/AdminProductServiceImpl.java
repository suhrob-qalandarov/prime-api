package org.exp.primeapp.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.dto.request.ProductReq;
import org.exp.primeapp.dto.responce.ApiResponse;
import org.exp.primeapp.models.entities.Attachment;
import org.exp.primeapp.models.entities.Category;
import org.exp.primeapp.models.entities.Product;
import org.exp.primeapp.models.entities.ProductIncome;
import org.exp.primeapp.models.repo.AttachmentRepository;
import org.exp.primeapp.models.repo.CategoryRepository;
import org.exp.primeapp.models.repo.ProductIncomeRepository;
import org.exp.primeapp.models.repo.ProductRepository;
import org.exp.primeapp.service.interfaces.AdminProductService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminProductServiceImpl implements AdminProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final AttachmentRepository attachmentRepository;
    private final ProductIncomeRepository productIncomeRepository;

    @Override
    public Product getProductById(Long productId) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isEmpty()) {
            throw new RuntimeException("Product not found with id: " + productId);
        }
        return optionalProduct.orElse(null);
    }

    @Transactional
    @Override
    public ApiResponse saveProduct(ProductReq productReq) {
        Category category = categoryRepository.findById(productReq.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + productReq.getCategoryId()));

        List<Long> attachmentIds = productReq.getAttachmentIds();
        if (attachmentIds == null || attachmentIds.isEmpty()) {
            attachmentIds = List.of(1L); // fallback
        }

        List<Attachment> attachments = attachmentRepository.findAllById(attachmentIds);

        Product product = createProductFromReq(productReq, category, attachments);
        Product savedProduct = productRepository.save(product);

        ProductIncome income = createIncome(product, product.getAmount());
        ProductIncome savedIncome = productIncomeRepository.save(income);
        return new ApiResponse(true, "Product saved successfully with ID: " + savedProduct.getId());
    }

    private Product createProductFromReq(ProductReq req, Category category, List<Attachment> attachments) {
        return Product.builder()
                .name(req.getName())
                .description(req.getDescription())
                .price(req.getPrice())
                .amount(req.getAmount())
                ._active(req.getActive())
                .category(category)
                .attachments(attachments)
                .build();
    }

    private ProductIncome createIncome(Product product, Integer amount) {
        return ProductIncome.builder()
                .amount(amount)
                .product(product)
                .build();
    }

    @Transactional
    @Override
    public ApiResponse updateProduct(Long productId, ProductReq productReq) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        updateProductFields(product, productReq);
        productRepository.save(product);

        return new ApiResponse(true, "Product updated successfully with ID: " + productId);
    }

    private void updateProductFields(Product product, ProductReq req) {
        Long categoryId = req.getCategoryId();
        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
            product.setCategory(category);
        }

        if (req.getAttachmentIds() != null && !req.getAttachmentIds().isEmpty()) {
            List<Attachment> attachments = attachmentRepository.findAllById(req.getAttachmentIds());
            product.setAttachments(attachments);
        }

        if (hasText(req.getName())) {
            product.setName(req.getName());
        }

        if (hasText(req.getDescription())) {
            product.setDescription(req.getDescription());
        }

        if (req.getAmount() != null) {
            product.setAmount(req.getAmount());
        }

        if (req.getPrice() != null) {
            product.setPrice(req.getPrice());
        }

        /*if (req.getStatus() != null) {
            product.setStatus(req.getStatus());
        }*/
    }

    private boolean hasText(String str) {
        return str != null && !str.isBlank();
    }

    @Override
    public ApiResponse deleteProduct(Long productId) {
        int affected = productRepository.updateActive(false, productId);
        if (affected > 0) {
            return new ApiResponse(true, "Product deactivated successfully");
        } else {
            return new ApiResponse(false, "Product not found or already inactive");
        }
    }


}
