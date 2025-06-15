package org.exp.primeapp.service.impl;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.ProductRes;
import org.exp.primeapp.models.dto.responce.ProductSizeRes;
import org.exp.primeapp.models.entities.Attachment;
import org.exp.primeapp.models.entities.Product;
import org.exp.primeapp.models.repo.ProductRepository;
import org.exp.primeapp.service.interfaces.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public List<ProductRes> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::convertToProductRes)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductRes> getActiveProducts() {
        return productRepository.findAllByActive(true)
                .stream()
                .map(this::convertToProductRes)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductRes> getInactiveProducts() {
        return productRepository.findAllByActive(false)
                .stream()
                .map(this::convertToProductRes)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductRes> getActiveProductsByCategoryId(Long categoryId) {
        return productRepository.findByActiveAndCategoryId(categoryId, true)
                .stream()
                .map(this::convertToProductRes)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductRes> getInactiveProductsByCategoryId(Long categoryId) {
        return productRepository.findByActiveAndCategoryId(categoryId, false)
                .stream()
                .map(this::convertToProductRes)
                .collect(Collectors.toList());
    }

    @Override
    public ProductRes getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        return convertToProductRes(product);
    }

    private ProductRes convertToProductRes(Product product) {
        List<Long> attachmentIds = product.getAttachments()
                .stream()
                .map(Attachment::getId)
                .collect(Collectors.toList());

        List<ProductSizeRes> productSizes = product.getSizes()
                .stream()
                .map(size -> new ProductSizeRes(size.getSize(), size.getAmount()))
                .collect(Collectors.toList());

        return new ProductRes(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStatus(),
                product.getCategory().getId(),
                attachmentIds,
                productSizes
        );
    }
}
