package org.exp.primeapp.service.impl.admin.product;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.ProductReq;
import org.exp.primeapp.models.dto.responce.admin.AdminProductDashboardRes;
import org.exp.primeapp.models.dto.responce.admin.AdminProductRes;
import org.exp.primeapp.models.dto.responce.global.ApiResponse;
import org.exp.primeapp.models.entities.*;
import org.exp.primeapp.repository.AttachmentRepository;
import org.exp.primeapp.repository.CategoryRepository;
import org.exp.primeapp.repository.ProductIncomeRepository;
import org.exp.primeapp.repository.ProductRepository;
import org.exp.primeapp.service.interfaces.admin.product.AdminProductService;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminProductServiceImpl implements AdminProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final AttachmentRepository attachmentRepository;
    private final ProductIncomeRepository productIncomeRepository;


    @Override
    @Transactional
    public AdminProductDashboardRes getProductDashboarRes() {
        List<AdminProductRes> productResList = productRepository.findAll().stream().map(this::convertToAdminProductRes).toList();
        List<AdminProductRes> productResByActive = productRepository.findAllByActive(true).stream().map(this::convertToAdminProductRes).toList();
        List<AdminProductRes> productResByInactive = productRepository.findAllByActive(false).stream().map(this::convertToAdminProductRes).toList();

        long count = productRepository.count();
        long countedByActive = productRepository.countByActive(true);
        long countedByInactive = productRepository.countByActive(false);

        return AdminProductDashboardRes.builder()
                .count(count)
                .activeCount(countedByActive)
                .inactiveCount(countedByInactive)
                .productResList(productResList)
                .ActiveProductResList(productResByActive)
                .InactiveProductResList(productResByInactive)
                .build();
    }

    @Override
    public void toggleProductUpdate(Long productId) {
        productRepository.toggleProductUpdateStatus(productId);
    }

    @Transactional
    public AdminProductRes convertToAdminProductRes(Product product) {
        return new AdminProductRes(
                product.getId(),
                product.getName(),
                product.getDiscount(),
                product.getActive(),
                product.getStatus().name(),
                product.getCategory().getName(),
                product.getAttachments().size(),
                //product.getCollection().getName(),
                product.getSizes().size()
        );
    }

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

        Set<Attachment> attachments = new HashSet<>(attachmentRepository.findAllById(attachmentIds));

        Product product = createProductFromReq(productReq, category, attachments);
        product.setDiscount(0);
        Product savedProduct = productRepository.save(product);

        // ProductIncome uchun umumiy amount hisoblaymiz
        Integer totalAmount = product.getSizes().stream()
                .mapToInt(ProductSize::getAmount)
                .sum();
        ProductIncome income = createIncome(product, totalAmount);
        productIncomeRepository.save(income);

        return new ApiResponse(true, "Product saved successfully with ID: " + savedProduct.getId());
    }

    private Product createProductFromReq(ProductReq req, Category category, Set<Attachment> attachments) {
        Product product = Product.builder()
                .name(req.getName())
                .description(req.getDescription())
                .price(req.getPrice())
                .discount(req.getDiscount())
                .active(req.getActive())
                .status(req.getStatus())
                .category(category)
                .collection(null)
                .attachments(attachments)
                .sizes(new HashSet<>())
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
            Set<Attachment> attachments = new HashSet<>(attachmentRepository.findAllById(req.getAttachmentIds()));
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

        if (req.getDiscount() != null) {
            product.setDiscount(req.getDiscount());
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


    @Override
    public List<Product> getActiveProductsForAdmin() {
        return productRepository.findAllByActive(true);
    }

    @Override
    public List<Product> getInactiveProductsForAdmin() {
        return productRepository.findAllByActive(false);
    }
}