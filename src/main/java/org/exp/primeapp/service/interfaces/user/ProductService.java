package org.exp.primeapp.service.interfaces.user;

import org.exp.primeapp.models.dto.responce.user.FeaturedProductRes;
import org.exp.primeapp.models.dto.responce.user.ProductRes;
import org.exp.primeapp.models.dto.responce.user.page.PageRes;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {

    PageRes<ProductRes> getActiveProducts(Pageable pageable);
    PageRes<ProductRes> getProductsByCategoryId(Long categoryId, Pageable pageable);

    ProductRes getProductById(Long id);

    List<ProductRes> getActiveProductsByCategoryId(Long categoryId);

    List<ProductRes> getInactiveProductsByCategoryId(Long categoryId);

    List<ProductRes> getInactiveProducts();

    List<ProductRes> getAllProducts();

    FeaturedProductRes getFeaturedRandomProducts();
}
