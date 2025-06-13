package org.exp.primeapp.service.interfaces;

import org.exp.primeapp.dto.request.ProductReq;
import org.exp.primeapp.dto.responce.ApiResponse;
import org.exp.primeapp.models.entities.Product;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AdminProductService {

    Product getProductById(Long productId);

    ApiResponse saveProduct(ProductReq productReq);

    ApiResponse updateProduct(Long productId, ProductReq productReq);

    ApiResponse deleteProduct(Long productId);




    List<Product> getActiveProductsForAdmin();

    List<Product> getInactiveProductsForAdmin();
}
