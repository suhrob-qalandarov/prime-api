package org.exp.primeapp.service.interfaces.user;

import org.exp.primeapp.models.dto.responce.user.FeaturedProductRes;
import org.exp.primeapp.models.dto.responce.user.ProductRes;

import java.util.List;

public interface ProductService {
    List<ProductRes> getActiveProducts();

    ProductRes getProductById(Long id);

    List<ProductRes> getActiveProductsByCategoryId(Long categoryId);

    List<ProductRes> getInactiveProductsByCategoryId(Long categoryId);

    List<ProductRes> getInactiveProducts();

    List<ProductRes> getAllProducts();

    FeaturedProductRes getFeaturedRandomProducts();
}
