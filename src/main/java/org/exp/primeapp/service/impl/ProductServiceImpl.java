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
import org.exp.primeapp.service.interfaces.AttachmentService;
import org.exp.primeapp.service.interfaces.ProductService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final AttachmentService attachmentService;
    private final AttachmentRepository attachmentRepository;

    @Override
    public List<ProductRes> getProducts() {
        return productRepository.findBy_active(true)
                .stream()
                .map(product -> {
                    ProductRes productRes = new ProductRes();
                    productRes.setName(product.getName());
                    productRes.setPrice(product.getPrice());
                    productRes.setDescription(product.getDescription());
                    productRes.setAmount(product.getAmount());
                    productRes.setCategoryId(product.getCategory().getId());
                    return productRes;
                })
                .collect(Collectors.toList());
    }


    @Override
    public ProductRes getProductById(Long id) {
        Product activeProduct = productRepository.findBy_activeTrueAndId(id);
        ProductRes productRes = new ProductRes();
        productRes.setName(activeProduct.getName());
        productRes.setPrice(activeProduct.getPrice());
        productRes.setDescription(activeProduct.getDescription());
        productRes.setAmount(activeProduct.getAmount());
        productRes.setCategoryId(activeProduct.getCategory().getId());
        return productRes;
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
        Optional<Attachment> optionalAttachment = attachmentRepository.findById(productReq.getAttachmentId());

        if(optionalAttachment.isEmpty()) {
            return;
        }
        Attachment attachment = optionalAttachment.get();

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
}
