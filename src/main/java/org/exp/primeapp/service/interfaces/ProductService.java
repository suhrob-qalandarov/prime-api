package org.exp.primeapp.service.interfaces;

import org.exp.primeapp.dto.request.ProductReq;
import org.exp.primeapp.dto.responce.ApiResponse;
import org.exp.primeapp.dto.responce.ProductRes;
import org.exp.primeapp.models.entities.Product;

import java.util.List;

public interface ProductService {
    List<ProductRes> getActiveProducts();

    ProductRes getProductById(Long id);

    ApiResponse saveProduct(ProductReq productReq);

    Product updateProduct(Long productId, ProductReq productReq);

    List<ProductRes> getActiveProductsByCategoryId(Long categoryId);

    List<ProductRes> getInactiveProductsByCategoryId(Long categoryId);

    List<ProductRes> getInactiveProducts();

    ApiResponse deleteProduct(Long productId);

    List<ProductRes> getAllProducts();
}
