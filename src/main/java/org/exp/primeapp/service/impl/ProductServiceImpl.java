package org.exp.primeapp.service.impl;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.dto.request.ProductReq;
import org.exp.primeapp.models.entities.Product;
import org.exp.primeapp.models.repo.ProductRepository;
import org.exp.primeapp.service.interfaces.CategoryService;
import org.exp.primeapp.service.interfaces.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;

    @Override
    public List<Product> getProducts() {
        return productRepository.findBy_active(true);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findBy_activeTrueAndId(id);
    }

    @Override
    public List<Product> getAdminProducts() {
        return productRepository.findAll();
    }

    @Override
    public void saveProduct(ProductReq productReq) {
        Long categoryId = productReq.getCategoryId();

        Product product = Product.builder()
                .name(productReq.getName())
                .description(productReq.getDescription())
                .price(productReq.getPrice())
                .amount(productReq.getAmount())
                ._active(true)
                .build();
        productRepository.save(product);
    }

    @Override
    public void updateProduct(Long id) {
        productRepository.updateActive(id);
    }
}
