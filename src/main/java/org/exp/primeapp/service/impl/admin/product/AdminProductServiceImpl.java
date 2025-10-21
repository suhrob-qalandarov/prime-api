package org.exp.primeapp.service.impl.admin.product;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.ProductReq;
import org.exp.primeapp.models.dto.responce.admin.AdminProductDashboardRes;
import org.exp.primeapp.models.dto.responce.admin.AdminProductRes;
import org.exp.primeapp.models.dto.responce.admin.AdminProductViewRes;
import org.exp.primeapp.models.dto.responce.global.ApiResponse;
import org.exp.primeapp.models.dto.responce.user.ProductSizeRes;
import org.exp.primeapp.models.entities.*;
import org.exp.primeapp.models.enums.ProductStatus;
import org.exp.primeapp.repository.AttachmentRepository;
import org.exp.primeapp.repository.CategoryRepository;
import org.exp.primeapp.repository.ProductIncomeRepository;
import org.exp.primeapp.repository.ProductRepository;
import org.exp.primeapp.service.interfaces.admin.product.AdminProductService;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
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

    @Override
    public List<AdminProductRes> getAdminDashboardProducts() {
        return productRepository.findAll().stream().map(this::convertToAdminProductRes).toList();
    }

    @Transactional
    public AdminProductRes convertToAdminProductRes(Product product) {
        return new AdminProductRes(
                product.getId(),
                product.getName(),
                product.getBrand(),
                product.getDescription(),
                product.getAttachments().stream().map(Attachment::getKey).toList(),
                product.getCategory().getName(),
                product.getPrice(),
                product.getStatus().name(),
                product.getActive(),
                product.getDiscount(),
                product.getCreatedAt(),
                product.getSizes().size()
        );
    }

    @Override
    public AdminProductViewRes getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with telegramId: " + productId));
        List<ProductSizeRes> productSizeReslist = product.getSizes().stream().map(size -> new ProductSizeRes(size.getId(), size.getSize(), size.getAmount())).toList();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");

        return AdminProductViewRes.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .active(product.getActive())
                .status(product.getStatus().name())
                .discount(product.getDiscount())
                .categoryName(product.getCategory().getName())
                .attachmentKeys(product.getAttachments().stream().map(Attachment::getKey).toList())
                .productSizeRes(productSizeReslist)
                .createdAt(product.getCreatedAt().format(formatter))
                .build();
    }

    @Transactional
    @Override
    public AdminProductRes saveProduct(ProductReq productReq) {
        Category category = categoryRepository.findById(productReq.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with categoryId: " + productReq.categoryId()));

        List<String> attachmentIds = productReq.attachmentKeys();
        if (attachmentIds == null || attachmentIds.isEmpty()) {
            throw new RuntimeException("Attachments empty");
        }

        List<Attachment> attachments = attachmentRepository.findAllByKeyIn(attachmentIds);

        Product product = createProductFromReq(productReq, category, attachments);
        product.setDiscount(0);
        Product savedProduct = productRepository.save(product);

        // ProductIncome uchun umumiy amount hisoblaymiz
        Integer totalAmount = product.getSizes().stream()
                .mapToInt(ProductSize::getAmount)
                .sum();
        ProductIncome income = createIncome(product, totalAmount);
        productIncomeRepository.save(income);

        return convertToAdminProductRes(savedProduct);

        //return new ApiResponse(true, "Product saved successfully with ID: " + savedProduct.getId());
    }

    private Product createProductFromReq(ProductReq req, Category category, List<Attachment> attachments) {
        Product product = Product.builder()
                .name(req.name())
                .brand(req.brand())
                .description(req.description())
                .price(req.price())
                .active(true)
                .status(ProductStatus.NEW)
                .category(category)
                //.collection(null)
                .attachments(attachments)
                .sizes(new HashSet<>())
                .build();

        // ProductSize'larni qo‘shamiz
        if (req.productSizes() != null) {
            req.productSizes().forEach(sizeReq -> {
                ProductSize productSize = new ProductSize();
                productSize.setSize(sizeReq.size());
                productSize.setAmount(sizeReq.amount());
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
                .orElseThrow(() -> new RuntimeException("Product not found with productId: " + productId));

        updateProductFields(product, productReq);
        productRepository.save(product);

        return new ApiResponse(true, "Product updated successfully with id: " + productId);
    }

    private void updateProductFields(Product product, ProductReq req) {
        if (req.categoryId() != null) {
            Category category = categoryRepository.findById(req.categoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with categoryId: " + req.categoryId()));
            product.setCategory(category);
        }

        /*if (req.getAttachmentIds() != null && !req.getAttachmentIds().isEmpty()) {
            Set<Attachment> attachments = new HashSet<>(attachmentRepository.findAllById(req.getAttachmentIds()));
            product.setAttachments(attachments);
        }*/

        if (hasText(req.name())) {
            product.setName(req.name());
        }

        if (hasText(req.description())) {
            product.setDescription(req.description());
        }

        if (req.price() != null) {
            product.setPrice(req.price());
        }

        /*if (req.getDiscount() != null) {
            product.setDiscount(req.getDiscount());
        }

        if (req.getStatus() != null) {
            product.setStatus(req.getStatus());
        }*/

        // ProductSize'larni yangilaymiz
        if (req.productSizes() != null) {
            product.getSizes().clear();
            req.productSizes().forEach(sizeReq -> {
                ProductSize productSize = new ProductSize();
                productSize.setSize(sizeReq.size());
                productSize.setAmount(sizeReq.amount());
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