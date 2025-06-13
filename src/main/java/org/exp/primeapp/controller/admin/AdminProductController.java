package org.exp.primeapp.controller.admin;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.dto.request.ProductReq;
import org.exp.primeapp.dto.responce.ApiResponse;
import org.exp.primeapp.dto.responce.ProductRes;
import org.exp.primeapp.models.entities.Product;
import org.exp.primeapp.service.interfaces.AdminProductService;
import org.exp.primeapp.service.interfaces.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequestMapping(API + V1 + ADMIN + PRODUCT)
@RequiredArgsConstructor
public class AdminProductController {

    private final AdminProductService adminProductService;

    @GetMapping("/{productId}")
    public ResponseEntity<Product> getProduct(@PathVariable Long productId) {
        Product product = adminProductService.getProductById(productId);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addProduct(@RequestBody ProductReq productReq) {
        ApiResponse response = adminProductService.saveProduct(productReq);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ApiResponse> updateProduct(@PathVariable Long productId, @RequestBody ProductReq productReq) {
        ApiResponse response = adminProductService.updateProduct(productId, productReq);
        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse> deleteProduct(@PathVariable Long productId) {
        ApiResponse response = adminProductService.deleteProduct(productId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
