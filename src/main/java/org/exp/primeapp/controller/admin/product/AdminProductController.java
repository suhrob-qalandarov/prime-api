package org.exp.primeapp.controller.admin.product;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.ProductReq;
import org.exp.primeapp.models.dto.responce.admin.AdminProductDashboardRes;
import org.exp.primeapp.models.dto.responce.admin.AdminProductRes;
import org.exp.primeapp.service.interfaces.admin.product.AdminProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequestMapping(API + V2 + ADMIN + PRODUCT)
@RequiredArgsConstructor
public class AdminProductController {

    private final AdminProductService adminProductService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'VISITOR')")
    public ResponseEntity<AdminProductDashboardRes> adminProducts() {
        AdminProductDashboardRes adminDashboardProductsRes = adminProductService.getProductDashboardRes();
        return new ResponseEntity<>(adminDashboardProductsRes, HttpStatus.OK);
    }

    @GetMapping("/{productId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VISITOR')")
    public ResponseEntity<AdminProductRes> getProduct(@PathVariable Long productId) {
        AdminProductRes adminProductRes = adminProductService.getProductById(productId);
        return new ResponseEntity<>(adminProductRes, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminProductRes> addProduct(@Valid @RequestBody ProductReq productReq) {
        AdminProductRes adminProductRes = adminProductService.saveProduct(productReq);
        return new ResponseEntity<>(adminProductRes, HttpStatus.CREATED);
    }

    @PutMapping("/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminProductRes> updateProduct(@PathVariable Long productId, @RequestBody ProductReq productReq) {
        AdminProductRes adminProductRes = adminProductService.updateProduct(productId, productReq);
        return new ResponseEntity<>(adminProductRes, HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/toggle/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminProductRes> activateProduct(@PathVariable Long productId) {
        AdminProductRes adminProductRes = adminProductService.toggleProductUpdate(productId);
        return new ResponseEntity<>(adminProductRes, HttpStatus.ACCEPTED);
    }
}