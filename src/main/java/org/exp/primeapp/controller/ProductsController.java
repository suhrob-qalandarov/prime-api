package org.exp.primeapp.controller;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.dto.responce.ProductRes;
import org.exp.primeapp.service.interfaces.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequestMapping(API + V1 + PRODUCTS)
@RequiredArgsConstructor
public class ProductsController {

    private final ProductService productService;

    @GetMapping("/all")
    public ResponseEntity<List<ProductRes>> getAllProducts() {
        List<ProductRes> products = productService.getAllProducts();
        return new ResponseEntity<>(products, HttpStatus.ACCEPTED);
    }

    @GetMapping("/all-active")
    public ResponseEntity<List<ProductRes>> getProducts() {
        List<ProductRes> products = productService.getActiveProducts();
        return new ResponseEntity<>(products, HttpStatus.ACCEPTED);
    }

    @GetMapping("/all-inactive")
    public ResponseEntity<List<ProductRes>> getInactiveProducts() {
        List<ProductRes> products = productService.getInactiveProducts();
        return new ResponseEntity<>(products, HttpStatus.ACCEPTED);
    }

    @GetMapping("/all-active/by-category/{categoryId}")
    public ResponseEntity<List<ProductRes>> getActiveProductsByCategory(@PathVariable Long categoryId) {
        List<ProductRes> products = productService.getActiveProductsByCategoryId(categoryId);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/all-inactive/by-category/{categoryId}")
    public ResponseEntity<List<ProductRes>> getInactiveProductsByCategory(@PathVariable Long categoryId) {
        List<ProductRes> products = productService.getActiveProductsByCategoryId(categoryId);
        return ResponseEntity.ok(products);
    }
}
