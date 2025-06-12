package org.exp.primeapp.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.dto.request.ProductReq;
import org.exp.primeapp.dto.responce.ProductRes;
import org.exp.primeapp.models.entities.*;
import org.exp.primeapp.models.repo.AttachmentRepository;
import org.exp.primeapp.models.repo.CategoryRepository;
import org.exp.primeapp.models.repo.ProductIncomeRepository;
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
    private final ProductIncomeRepository productIncomeRepository;

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
        Category category = categoryRepository.findById(productReq.getCategoryId()).get();

        List<Long> attachmentIds = productReq.getAttachmentIds();
        List<Attachment> attachmentList;

        if (!attachmentIds.isEmpty()) {
            attachmentList = attachmentRepository.findAllById(attachmentIds);
        } else {
            attachmentList = attachmentRepository.findAllById(List.of(1L, 2L, 3L));
        }

        Product product = Product.builder()
                .name(productReq.getName())
                .description(productReq.getDescription())
                .price(productReq.getPrice())
                .amount(productReq.getAmount())
                ._active(true)
                .category(category)
                .attachments(attachmentList)
                .build();

        productRepository.save(product);

        ProductIncome productIncome = ProductIncome.builder()
                .amount(productReq.getAmount())
                .product(product)
                .build();

        productIncomeRepository.save(productIncome);
    }

    @Override
    public void updateProduct(Long id) {
        productRepository.updateActive(id);
    }

    @Override
    public List<ProductRes> getProductsByCategoryId(Long categoryId) {
        return productRepository.findAllByCategory_Id(categoryId);
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


