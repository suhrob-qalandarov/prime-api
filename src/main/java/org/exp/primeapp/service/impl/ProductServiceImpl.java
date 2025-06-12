package org.exp.primeapp.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.dto.request.ProductReq;
import org.exp.primeapp.dto.responce.ApiResponse;
import org.exp.primeapp.dto.responce.ProductRes;
import org.exp.primeapp.models.entities.*;
import org.exp.primeapp.models.repo.AttachmentRepository;
import org.exp.primeapp.models.repo.CategoryRepository;
import org.exp.primeapp.models.repo.ProductIncomeRepository;
import org.exp.primeapp.models.repo.ProductRepository;
import org.exp.primeapp.service.interfaces.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final AttachmentRepository attachmentRepository;
    private final ProductIncomeRepository productIncomeRepository;

    @Override
    public List<ProductRes> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::convertToProductRes)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductRes> getActiveProducts() {
        return productRepository.findAllBy_active(true)
                .stream()
                .map(this::convertToProductRes)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductRes> getInactiveProducts() {
        return productRepository.findAllBy_active(false)
                .stream()
                .map(this::convertToProductRes)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductRes> getActiveProductsByCategoryId(Long categoryId) {
        return productRepository.findAllBy_activeAndCategory_Id(true, categoryId)
                .stream()
                .map(this::convertToProductRes)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductRes> getInactiveProductsByCategoryId(Long categoryId) {
        return productRepository.findAllBy_activeAndCategory_Id(false, categoryId)
                .stream()
                .map(this::convertToProductRes)
                .collect(Collectors.toList());
    }

    @Override
    public ProductRes getProductById(Long id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isEmpty()) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        return convertToProductRes(optionalProduct.orElse(null));
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
    public Product updateProduct(Long productId, ProductReq productReq) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        updateProductFields(product, productReq);

        return productRepository.save(product);
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

        if (req.getStatus() != null) {
            product.setStatus(req.getStatus());
        }
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


    private ProductRes convertToProductRes(Product product) {
        return new ProductRes(
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getAmount(),
                product.getCategory().getId()
        );
    }
}
