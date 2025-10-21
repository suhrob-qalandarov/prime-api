package org.exp.primeapp.service.interfaces.admin.product;

import org.exp.primeapp.models.dto.request.ProductReq;
import org.exp.primeapp.models.dto.responce.admin.AdminProductDashboardRes;
import org.exp.primeapp.models.dto.responce.admin.AdminProductRes;
import org.exp.primeapp.models.dto.responce.admin.AdminProductViewRes;
import org.exp.primeapp.models.dto.responce.global.ApiResponse;
import org.exp.primeapp.models.entities.Product;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AdminProductService {

    AdminProductViewRes getProductById(Long productId);

    AdminProductRes saveProduct(ProductReq productReq);

    ApiResponse updateProduct(Long productId, ProductReq productReq);

    ApiResponse deactivateProduct(Long productId);


    List<Product> getActiveProductsForAdmin();

    List<Product> getInactiveProductsForAdmin();

    AdminProductDashboardRes getProductDashboarRes();

    void toggleProductUpdate(Long productId);

    List<AdminProductRes> getAdminDashboardProducts();
}
