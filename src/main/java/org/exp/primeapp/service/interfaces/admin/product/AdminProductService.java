package org.exp.primeapp.service.interfaces.admin.product;

import org.exp.primeapp.models.dto.request.ProductReq;
import org.exp.primeapp.models.dto.responce.admin.AdminProductRes;
import org.exp.primeapp.models.dto.responce.global.ApiResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AdminProductService {

    AdminProductRes getProductById(Long productId);

    AdminProductRes saveProduct(ProductReq productReq);

    ApiResponse updateProduct(Long productId, ProductReq productReq);

    void toggleProductUpdate(Long productId);

    List<AdminProductRes> getAdminDashboardProducts();
}
