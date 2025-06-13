package org.exp.primeapp.service.interfaces;

import org.exp.primeapp.dto.request.ProductReq;
import org.exp.primeapp.dto.responce.ApiResponse;
import org.exp.primeapp.dto.responce.ProductRes;
import org.exp.primeapp.models.entities.Product;

import java.util.List;

public interface ProductService {
    List<ProductRes> getActiveProducts();

    ProductRes getProductById(Long id);

    List<ProductRes> getActiveProductsByCategoryId(Long categoryId);

    List<ProductRes> getInactiveProductsByCategoryId(Long categoryId);

    List<ProductRes> getInactiveProducts();

    List<ProductRes> getAllProducts();

}
