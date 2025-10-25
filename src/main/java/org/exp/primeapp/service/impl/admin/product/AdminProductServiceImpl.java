package org.exp.primeapp.service.impl.admin.product;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.ProductReq;
import org.exp.primeapp.models.dto.responce.admin.AdminProductDashboardRes;
import org.exp.primeapp.models.dto.responce.admin.AdminProductRes;
import org.exp.primeapp.models.dto.responce.user.ProductSizeRes;
import org.exp.primeapp.models.entities.*;
import org.exp.primeapp.models.enums.ProductStatus;
import org.exp.primeapp.repository.AttachmentRepository;
import org.exp.primeapp.repository.CategoryRepository;
import org.exp.primeapp.repository.ProductIncomeRepository;
import org.exp.primeapp.repository.ProductRepository;
import org.exp.primeapp.service.interfaces.admin.product.AdminProductService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminProductServiceImpl implements AdminProductService {

    @Value("${app.products.update-offset-minutes}")
    private long updateOffsetMinutes;

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final AttachmentRepository attachmentRepository;
    private final ProductIncomeRepository productIncomeRepository;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");

    @Override
    @Transactional
    public AdminProductDashboardRes getProductDashboardRes() {
        List<AdminProductRes> productResList = productRepository.findAll()
                .stream()
                .map(this::convertToAdminProductRes)
                .toList();

        long totalCount = productResList.size();
        long activeCount = productResList.stream().filter(AdminProductRes::active).count();
        long inactiveCount = productResList.stream().filter(p -> !p.active()).count();

        Map<String, Long> countMap = mapCountByStatus(productResList);

        long newCount = getCountByStatus(countMap, ProductStatus.NEW.name());
        long hotCount = getCountByStatus(countMap, ProductStatus.HOT.name());
        long saleCount = getCountByStatus(countMap, ProductStatus.SALE.name());

        return AdminProductDashboardRes.builder()
                .totalCount(totalCount)
                .activeCount(activeCount)
                .inactiveCount(inactiveCount)
                .newCount(newCount)
                .hotCount(hotCount)
                .saleCount(saleCount)
                .responseDate(LocalDateTime.now().plusMinutes(updateOffsetMinutes))
                .productResList(productResList)
                .build();
    }

    private Map<String, Long> mapCountByStatus(List<AdminProductRes> productResList) {
        return productResList.stream()
                .collect(Collectors.groupingBy(AdminProductRes::status, Collectors.counting()));
    }

    private long getCountByStatus(Map<String, Long> countMap, String status) {
        return countMap.getOrDefault(status, 0L);
    }

    @Override
    @Transactional
    public AdminProductRes toggleProductUpdate(Long productId) {
        productRepository.toggleProductUpdateStatus(productId);
        Product product = productRepository.findById(productId)
                .orElseThrow();
        return convertToAdminProductRes(product);
    }

    @Transactional
    public AdminProductRes convertToAdminProductRes(Product product) {
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
        /*if (req.productSizes() != null) {
            req.productSizes().forEach(sizeReq -> {
                ProductSize productSize = new ProductSize();
                productSize.setSize(sizeReq.size());
                productSize.setAmount(sizeReq.amount());
                product.addSize(productSize);
            });
        }*/

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
    public AdminProductRes  updateProduct(Long productId, ProductReq productReq) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with productId: " + productId));
        updateProductFields(product, productReq);
        Product updatedProduct = productRepository.save(product);
        return convertToAdminProductRes(updatedProduct);
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
        /*if (req.productSizes() != null) {
            product.getSizes().clear();
            req.productSizes().forEach(sizeReq -> {
                ProductSize productSize = new ProductSize();
                productSize.setSize(sizeReq.size());
                productSize.setAmount(sizeReq.amount());
                product.addSize(productSize);
            });
        }*/
    }

    private boolean hasText(String str) {
        return str != null && !str.isBlank();
    }
}