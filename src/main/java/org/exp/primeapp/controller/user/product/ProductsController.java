/*
package org.exp.primeapp.controller.user.product;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.user.FeaturedProductRes;
import org.exp.primeapp.models.dto.responce.user.ProductRes;
import org.exp.primeapp.service.interfaces.user.ProductService;
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

    @GetMapping
    public ResponseEntity<List<ProductRes>> getProducts() {
        List<ProductRes> products = productService.getActiveProducts();
        return new ResponseEntity<>(products, HttpStatus.ACCEPTED);
    }

    @GetMapping("/featured")
    public ResponseEntity<FeaturedProductRes> getFeaturedRandomProducts() {
        FeaturedProductRes products = productService.getFeaturedRandomProducts();
        return new ResponseEntity<>(products, HttpStatus.ACCEPTED);
    }

    @GetMapping(BY_CATEGORY + "/{categoryId}")
    public ResponseEntity<List<ProductRes>> getActiveProductsByCategory(@PathVariable Long categoryId) {
        List<ProductRes> products = productService.getActiveProductsByCategoryId(categoryId);
        return new ResponseEntity<>(products, HttpStatus.ACCEPTED);
    }
}
    */
