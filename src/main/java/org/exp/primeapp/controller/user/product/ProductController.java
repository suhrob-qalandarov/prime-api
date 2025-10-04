package org.exp.primeapp.controller.user.product;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.user.ProductRes;
import org.exp.primeapp.models.dto.responce.user.page.PageRes;
import org.exp.primeapp.service.interfaces.user.ProductService;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequestMapping(API + V1 + PRODUCT)
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/{productId}")
    public ResponseEntity<ProductRes> getProduct(@PathVariable Long productId) {
        ProductRes product = productService.getProductById(productId);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<PageRes<ProductRes>> getProducts(Pageable pageable) {
        PageRes<ProductRes> pageableProducts = productService.getActiveProducts(pageable);
        return new ResponseEntity<>(pageableProducts, HttpStatus.OK);
    }

    @GetMapping("/by-category/{categoryId}")
    public ResponseEntity<PageRes<ProductRes>> getProductsByCategory(@PathVariable Long categoryId, Pageable pageable) {
        PageRes<ProductRes> pageableProducts = productService.getProductsByCategoryId(categoryId, pageable);
        return new ResponseEntity<>(pageableProducts, HttpStatus.OK);
    }
}
