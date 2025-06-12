package org.exp.primeapp.service.interfaces;

import org.exp.primeapp.dto.request.ProductReq;
import org.exp.primeapp.dto.responce.ProductRes;
import org.exp.primeapp.models.entities.Product;

import java.util.List;

public interface ProductService {
    List<ProductRes> getProducts();

    ProductRes getProductById(Long id);

    List<Product> getAdminProducts();

    void saveProduct(ProductReq productReq);

    Product updateProduct(Long productId, ProductReq productReq);

    List<ProductRes> getProductsByCategoryId(Long categoryId);

    List<ProductRes> getInactiveProducts();

    void deleteProduct(Long productId);
}
