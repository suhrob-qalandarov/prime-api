package org.exp.primeapp.service.impl.user;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.user.FeaturedProductRes;
import org.exp.primeapp.models.dto.responce.user.ProductRes;
import org.exp.primeapp.models.dto.responce.user.ProductSizeRes;
import org.exp.primeapp.models.dto.responce.user.page.PageRes;
import org.exp.primeapp.models.entities.Attachment;
import org.exp.primeapp.models.entities.Product;
import org.exp.primeapp.repository.ProductRepository;
import org.exp.primeapp.service.face.user.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public List<ProductRes> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::convertToProductRes)
                .collect(toList());
    }

    @Transactional
    @Override
    public FeaturedProductRes getFeaturedRandomProducts() {
        return new FeaturedProductRes(
                productRepository.findRandom4ActiveProductsStatusSale().stream()
                        .map(this::convertToProductRes)
                        .collect(toList()),

                productRepository.findRandom4ActiveProductsStatusNew().stream()
                        .map(this::convertToProductRes)
                        .collect(toList()),

                productRepository.findRandom4ActiveProductsStatusHot().stream()
                        .map(this::convertToProductRes)
                        .collect(toList())
        );
    }

    @Override
    public PageRes<ProductRes> getActiveProducts(Pageable pageable) {
        Page<ProductRes> productRes = productRepository.findAllByActive(true, pageable)
                .map(this::convertToProductRes);
        return toPageRes(productRes);
    }

    @Override
    public PageRes<ProductRes> getProductsByCategoryId(Long categoryId, Pageable pageable) {
        Page<ProductRes> productRes = productRepository.findAllByCategory_IdAndActive(categoryId, true, pageable)
                .map(this::convertToProductRes);

        return toPageRes(productRes);
    }

    @Override
    public List<ProductRes> getInactiveProducts() {
        return productRepository.findAllByActive(false)
                .stream()
                .map(this::convertToProductRes)
                .collect(toList());
    }

    @Override
    public List<ProductRes> getActiveProductsByCategoryId(Long categoryId) {
        return productRepository.findByActiveAndCategoryId(categoryId, true)
                .stream()
                .map(this::convertToProductRes)
                .collect(toList());
    }

    @Override
    public List<ProductRes> getInactiveProductsByCategoryId(Long categoryId) {
        return productRepository.findByActiveAndCategoryId(categoryId, false)
                .stream()
                .map(this::convertToProductRes)
                .collect(toList());
    }

    @Override
    public ProductRes getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with productId: " + productId));
        return convertToProductRes(product);
    }

    public <T> PageRes<T> toPageRes(Page<T> page) {
        return PageRes.<T>builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    public ProductRes convertToProductRes(Product product) {
        List<String> attachmentKeys = product.getAttachments()
                .stream()
                .map(Attachment::getKey)
                .collect(toList());

        List<ProductSizeRes> productSizes = product.getSizes()
                .stream()
                .map(size -> new ProductSizeRes(size.getId(), size.getSize(), size.getAmount()))
                .collect(toList());

        return new ProductRes(
                product.getId(),
                product.getName(),
                product.getBrand(),
                product.getDescription(),
                product.getPrice(),
                product.getDiscount(),
                product.getStatus(),
                product.getCategory().getName(),
                attachmentKeys,
                productSizes
        );
    }
}
