package org.exp.primeapp.controller.admin.product;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.ProductReq;
import org.exp.primeapp.models.dto.responce.admin.AdminProductDashboardRes;
import org.exp.primeapp.models.dto.responce.admin.AdminProductRes;
import org.exp.primeapp.models.dto.responce.global.ApiResponse;
import org.exp.primeapp.service.interfaces.admin.product.AdminProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequestMapping(API + V1 + ADMIN + PRODUCT)
@RequiredArgsConstructor
public class AdminProductController {

    private final AdminProductService adminProductService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminProductRes> addProduct(@Valid @RequestBody ProductReq productReq) {
        AdminProductRes adminProductRes = adminProductService.saveProduct(productReq);
        return new ResponseEntity<>(adminProductRes, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'VISITOR')")
    public ResponseEntity<AdminProductDashboardRes> adminProducts() {
        AdminProductDashboardRes adminDashboardProductsRes = adminProductService.getProductDashboardRes();
        return ResponseEntity.ok(adminDashboardProductsRes);
    }

    @GetMapping("/{productId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VISITOR')")
    public ResponseEntity<AdminProductRes> getProduct(@PathVariable Long productId) {
        AdminProductRes productResponseList = adminProductService.getProductById(productId);
        return new ResponseEntity<>(productResponseList, HttpStatus.OK);
    }

    @PutMapping("/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateProduct(@PathVariable Long productId, @RequestBody ProductReq productReq) {
        ApiResponse response = adminProductService.updateProduct(productId, productReq);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/toggle/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> activateProduct(@PathVariable Long productId) {
        adminProductService.toggleProductUpdate(productId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}