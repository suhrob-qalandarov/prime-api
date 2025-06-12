package org.exp.primeapp.controller;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.dto.request.ProductReq;
import org.exp.primeapp.dto.responce.ProductRes;
import org.exp.primeapp.models.entities.Product;
import org.exp.primeapp.service.interfaces.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequestMapping(API + V1 + PRODUCT)
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/all-active")
    public ResponseEntity<List<ProductRes>> getProducts() {
        List<ProductRes> products = productService.getProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/all-inactive")
    public ResponseEntity<List<ProductRes>> getInactiveProducts() {
        List<ProductRes> products = productService.getInactiveProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ProductRes> getProduct(@PathVariable Long productId) {
        ProductRes product = productService.getProductById(productId);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @GetMapping(BY_CATEGORY + "/{categoryId}")
    public ResponseEntity<List<ProductRes>> getProductsByCategory(@PathVariable Long categoryId) {
        List<ProductRes> products = productService.getProductsByCategoryId(categoryId);
        return ResponseEntity.ok(products);
    }

    @GetMapping(ADMIN)
    public ResponseEntity<List<Product>> getAdminProducts() {
        List<Product> products = productService.getAdminProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @PostMapping(ADMIN)
    public ResponseEntity<Product> addProduct(@RequestBody ProductReq productReq) {
        productService.saveProduct(productReq);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping(ADMIN + "/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping(ADMIN + "/{productId}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long productId, @RequestBody ProductReq productReq) {
        Product product = productService.updateProduct(productId, productReq);
        return new ResponseEntity<>(product, HttpStatus.ACCEPTED);
    }
}
