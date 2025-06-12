package org.exp.primeapp.controller;

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
@RequestMapping(API + V1 + AUTH + PRODUCT)
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

    @DeleteMapping(ADMIN + INACTIVE +  "/{id}")
    public ResponseEntity<Product> deleteProduct(@PathVariable Long id) {
        productService.updateProduct(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
