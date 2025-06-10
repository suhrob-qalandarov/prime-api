package org.exp.primeapp.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.dto.request.ProductReq;
import org.exp.primeapp.dto.responce.ProductRes;
import org.exp.primeapp.models.entities.Attachment;
import org.exp.primeapp.models.entities.Category;
import org.exp.primeapp.models.entities.Product;
import org.exp.primeapp.models.repo.AttachmentRepository;
import org.exp.primeapp.models.repo.CategoryRepository;
import org.exp.primeapp.models.repo.ProductRepository;
import org.exp.primeapp.service.interfaces.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final AttachmentRepository attachmentRepository;

    @Override
    public List<ProductRes> getProducts() {
        return productRepository.findBy_active(true)
                .stream()
                .map(this::convertToProductRes)
                .collect(Collectors.toList());
    }

    @Override
    public ProductRes getProductById(Long id) {
        Product activeProduct = productRepository.findBy_activeTrueAndId(id);
        if (activeProduct == null) {
            throw new RuntimeException("Mahsulot topilmadi: ID = " + id);
        }
        return convertToProductRes(activeProduct);
    }

    @Override
    public List<Product> getAdminProducts() {
        return productRepository.findAll();
    }

    @Transactional
    @Override
    public void saveProduct(ProductReq productReq) {
        Category category = categoryRepository.findById(productReq.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Kategoriya topilmadi: ID = " + productReq.getCategoryId()));

        Attachment attachment = attachmentRepository.findById(productReq.getAttachmentId())
                .orElseThrow(() -> new RuntimeException("Attachment topilmadi: ID = " + productReq.getAttachmentId()));

        Product product = Product.builder()
                .name(productReq.getName())
                .description(productReq.getDescription())
                .price(productReq.getPrice())
                .amount(productReq.getAmount())
                ._active(true)
                .category(category)
                .attachment(attachment)
                .build();

        productRepository.save(product);
    }

    @Override
    public void updateProduct(Long id) {
        productRepository.updateActive(id);
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
