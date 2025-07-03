package org.exp.primeapp.service.interfaces.admin.product;

import org.exp.primeapp.models.dto.request.ProductReq;
import org.exp.primeapp.models.dto.responce.global.ApiResponse;
import org.exp.primeapp.models.entities.Product;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AdminProductService {

    Product getProductById(Long productId);

    ApiResponse saveProduct(ProductReq productReq);

    ApiResponse updateProduct(Long productId, ProductReq productReq);

    ApiResponse deactivateProduct(Long productId);

    ApiResponse activateProduct(Long productId);

    List<Product> getActiveProductsForAdmin();

    List<Product> getInactiveProductsForAdmin();

}
