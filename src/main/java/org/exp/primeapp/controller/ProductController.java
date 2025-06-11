package org.exp.primeapp.controller;

import org.exp.primeapp.dto.request.ProductReq;
import org.exp.primeapp.dto.responce.ProductRes;
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
    public ResponseEntity<List<ProductRes>> getProducts() {
        List<ProductRes> products = productService.getProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductRes> getProduct(@PathVariable Long id) {
        ProductRes product = productService.getProductById(id);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @GetMapping("by-category/{categoryId}")
    public  ResponseEntity<List<ProductRes>> getCategoryProducts(@PathVariable Long categoryId) {
        List<ProductRes> products = productService.getProductsByCategoryId(categoryId);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/admin")
    public ResponseEntity<List<Product>> getAdminProducts() {
        List<Product> products = productService.getAdminProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @PostMapping("/admin")
    public ResponseEntity<Product> addProduct(@RequestBody ProductReq productReq) {
        productService.saveProduct(productReq);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Product> deleteProduct(@PathVariable Long id) {
        productService.updateProduct(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
