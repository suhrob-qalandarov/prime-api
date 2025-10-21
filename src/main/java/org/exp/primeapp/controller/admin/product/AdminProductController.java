package org.exp.primeapp.controller.admin.product;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.ProductReq;
import org.exp.primeapp.models.dto.responce.admin.AdminProductDashboardRes;
import org.exp.primeapp.models.dto.responce.admin.AdminProductRes;
import org.exp.primeapp.models.dto.responce.admin.AdminProductViewRes;
import org.exp.primeapp.models.dto.responce.global.ApiResponse;
import org.exp.primeapp.service.interfaces.admin.product.AdminProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequestMapping(API + V1 + ADMIN + PRODUCT)
@RequiredArgsConstructor
public class AdminProductController {

    private final AdminProductService adminProductService;

    @PostMapping
    public ResponseEntity<AdminProductRes> addProduct(@Valid @RequestBody ProductReq productReq) {
        AdminProductRes adminProductRes = adminProductService.saveProduct(productReq);
        return new ResponseEntity<>(adminProductRes, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AdminProductRes>> adminProducts() {
        List<AdminProductRes> adminDashboardProductsRes = adminProductService.getAdminDashboardProducts();
        return ResponseEntity.ok(adminDashboardProductsRes);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminProductDashboardRes> adminProductDashboard() {
        AdminProductDashboardRes adminProductDashboardRes = adminProductService.getProductDashboarRes();
        return ResponseEntity.ok(adminProductDashboardRes);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<AdminProductViewRes> getProduct(@PathVariable Long productId) {
        AdminProductViewRes product = adminProductService.getProductById(productId);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ApiResponse> updateProduct(@PathVariable Long productId, @RequestBody ProductReq productReq) {
        ApiResponse response = adminProductService.updateProduct(productId, productReq);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/toggle/{productId}")
    public ResponseEntity<Void> activateProduct(@PathVariable Long productId) {
        adminProductService.toggleProductUpdate(productId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /*@DeleteMapping("/deactivate/{productId}")
    public ResponseEntity<ApiResponse> deactivateProduct(@PathVariable Long productId) {
        ApiResponse response = adminProductService.deactivateProduct(productId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }*/
}
