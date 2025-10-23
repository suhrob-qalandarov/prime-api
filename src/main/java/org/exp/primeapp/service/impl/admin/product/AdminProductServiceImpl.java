package org.exp.primeapp.service.impl.admin.product;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.ProductReq;
import org.exp.primeapp.models.dto.responce.admin.AdminProductDashboardRes;
import org.exp.primeapp.models.dto.responce.admin.AdminProductRes;
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
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminProductServiceImpl implements AdminProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final AttachmentRepository attachmentRepository;
    private final ProductIncomeRepository productIncomeRepository;

    @Transactional
    public AdminProductDashboardRes getProductDashboardRes() {
        List<AdminProductRes> productResList = productRepository.findAll()
                .stream()
                .map(this::convertToAdminProductRes)
                .toList();

        long totalCount = productResList.size();
        long activeCount = productResList.stream().filter(AdminProductRes::active).count();
        long inactiveCount = productResList.stream().filter(p -> !p.active()).count();

        long newCount = getCountByStatus(productResList, ProductStatus.NEW);
        long hotCount = getCountByStatus(productResList, ProductStatus.HOT);
        long saleCount = getCountByStatus(productResList, ProductStatus.SALE);

        return AdminProductDashboardRes.builder()
                .totalCount(totalCount)
                .activeCount(activeCount)
                .inactiveCount(inactiveCount)
                .newCount(newCount)
                .hotCount(hotCount)
                .saleCount(saleCount)
                .productResList(productResList)
                .build();
    }

    private long getCountByStatus(List<AdminProductRes> productResList, ProductStatus status) {
        Map<String, Long> countByStatus = productResList.stream()
                .collect(Collectors.groupingBy(AdminProductRes::status, Collectors.counting()));
        return countByStatus.getOrDefault(status.name(), 0L);
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
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");
        List<ProductSizeRes> productSizeReslist = product.getSizes().stream()
                .map(size -> ProductSizeRes.builder()
                        .id(size.getId())
                        .size(size.getSize())
                        .amount(size.getAmount())
                        .build())
                .toList();
        List<String> picturesKeyList = product.getAttachments().stream().map(Attachment::getKey).toList();
        return AdminProductRes.builder()
                .id(product.getId())
                .name(product.getName())
                .brand(product.getBrand())
                .description(product.getDescription())
                .categoryName(product.getCategory().getName())
                .price(product.getPrice())
                .status(product.getStatus().name())
                .active(product.getActive())
                .discount(product.getDiscount())
                .createdAt(product.getCreatedAt().format(formatter))
                .picturesKeys(picturesKeyList)
                .productSizeRes(productSizeReslist)
                .build();
    }

    @Transactional
    @Override
    public AdminProductRes getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with telegramId: " + productId));
        return convertToAdminProductRes(product);
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
    //@Override
    public ApiResponse deactivateProduct(Long productId) {
        int affected = productRepository.updateActive(false, productId);
        if (affected > 0) {
            return new ApiResponse(true, "Product deactivated successfully");
        } else {
            return new ApiResponse(false, "Product not found or already inactive");
        }
    }


    //@Override
    public List<Product> getActiveProductsForAdmin() {
        return productRepository.findAllByActive(true);
    }

    //@Override
    public List<Product> getInactiveProductsForAdmin() {
        return productRepository.findAllByActive(false);
    }
}