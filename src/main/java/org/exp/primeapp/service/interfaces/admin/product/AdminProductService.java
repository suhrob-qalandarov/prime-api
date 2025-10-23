package org.exp.primeapp.service.interfaces.admin.product;

import org.exp.primeapp.models.dto.request.ProductReq;
import org.exp.primeapp.models.dto.responce.admin.AdminProductDashboardRes;
import org.exp.primeapp.models.dto.responce.admin.AdminProductRes;
import org.exp.primeapp.models.dto.responce.global.ApiResponse;
import org.springframework.stereotype.Service;

@Service
public interface AdminProductService {

    AdminProductDashboardRes getProductDashboardRes();

    AdminProductRes getProductById(Long productId);

    AdminProductRes saveProduct(ProductReq productReq);

    ApiResponse updateProduct(Long productId, ProductReq productReq);

    void toggleProductUpdate(Long productId);
}