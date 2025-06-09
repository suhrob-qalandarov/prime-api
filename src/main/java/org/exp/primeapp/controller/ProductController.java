package org.exp.primeapp.controller;

import org.exp.primeapp.dto.request.ProductReq;
import org.exp.primeapp.models.entities.Product;
import org.exp.primeapp.service.interfaces.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping()
    public ResponseEntity<?> getProducts() {
        List<Product> products = productService.getProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @GetMapping("/admin/products")
    public ResponseEntity<?> getAdminProducts() {
        List<Product> products = productService.getAdminProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @PostMapping("/admin/product")
    public ResponseEntity<?> addProduct(@RequestBody ProductReq productReq) {
        productService.saveProduct(productReq);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.updateProduct(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
