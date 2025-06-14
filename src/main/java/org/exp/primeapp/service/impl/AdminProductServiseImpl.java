package org.exp.primeapp.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.dto.request.ProductReq;
import org.exp.primeapp.dto.responce.ApiResponse;
import org.exp.primeapp.models.entities.*;
import org.exp.primeapp.models.repo.AttachmentRepository;
import org.exp.primeapp.models.repo.CategoryRepository;
import org.exp.primeapp.models.repo.ProductIncomeRepository;
import org.exp.primeapp.models.repo.ProductRepository;
import org.exp.primeapp.service.interfaces.AdminProductService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service

@RequiredArgsConstructor
public class AdminProductServiseImpl implements AdminProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final AttachmentRepository attachmentRepository;
    private final ProductIncomeRepository productIncomeRepository;

    @Override
    public Product getProductById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
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

        // ProductIncome uchun umumiy amount hisoblaymiz
        Integer totalAmount = product.getSizes().stream()
                .mapToInt(ProductSize::getAmount)
                .sum();
        ProductIncome income = createIncome(product, totalAmount);
        productIncomeRepository.save(income);

        return new ApiResponse(true, "Product saved successfully with ID: " + savedProduct.getId());
    }

    private Product createProductFromReq(ProductReq req, Category category, List<Attachment> attachments) {
        Product product = Product.builder()
                .name(req.getName())
                .description(req.getDescription())
                .price(req.getPrice())
                ._active(req.getActive())
                .status(req.getStatus())
                .category(category)
                .attachments(attachments)
                .sizes(new ArrayList<>()) // aniq boshlang‘ich qiymat
                .build();

        // ProductSize'larni qo‘shamiz
        if (req.getProductSizes() != null) {
            req.getProductSizes().forEach(sizeReq -> {
                ProductSize productSize = new ProductSize();
                productSize.setSize(sizeReq.getSizes());
                productSize.setAmount(sizeReq.getAmount());
                product.addSize(productSize);
            });
        }

        return product;
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
        if (req.getCategoryId() != null) {
            Category category = categoryRepository.findById(req.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + req.getCategoryId()));
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

        if (req.getPrice() != null) {
            product.setPrice(req.getPrice());
        }

        if (req.getStatus() != null) {
            product.setStatus(req.getStatus());
        }

        // ProductSize'larni yangilaymiz
        if (req.getProductSizes() != null) {
            product.getSizes().clear();
            req.getProductSizes().forEach(sizeReq -> {
                ProductSize productSize = new ProductSize();
                productSize.setSize(sizeReq.getSizes());
                productSize.setAmount(sizeReq.getAmount());
                product.addSize(productSize);
            });
        }
    }

    private boolean hasText(String str) {
        return str != null && !str.isBlank();
    }

    @Transactional
    @Override
    public ApiResponse deactivateProduct(Long productId) {
        int affected = productRepository.updateActive(false, productId);
        if (affected > 0) {
            return new ApiResponse(true, "Product deactivated successfully");
        } else {
            return new ApiResponse(false, "Product not found or already inactive");
        }
    }

    @Transactional
    @Override
    public ApiResponse activateProduct(Long productId) {
        int affected = productRepository.updateActive(true, productId);
        if (affected > 0) {
            return new ApiResponse(true, "Product activated successfully");
        } else {
            return new ApiResponse(false, "Product not found with id or already active");
        }
    }


    @Override
    public List<Product> getActiveProductsForAdmin() {
        return productRepository.findAllBy_active(true);
    }

    @Override
    public List<Product> getInactiveProductsForAdmin() {
        return productRepository.findAllBy_active(false);
    }
}