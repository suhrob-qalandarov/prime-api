package org.exp.primeapp.controller.admin.product;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.entities.Product;
import org.exp.primeapp.models.repo.ProductRepository;
import org.exp.primeapp.service.interfaces.AdminProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(API + V1 + ADMIN + PRODUCTS)
public class AdminProductsController {

    private final ProductRepository productRepository;
    private final AdminProductService adminProductService;

    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllCategories() {
        List<Product> products = productRepository.findAll();
        return new ResponseEntity<>(products, HttpStatus.ACCEPTED);
    }

    @GetMapping("/all-active")
    public ResponseEntity<List<Product>> getAllActiveCategories() {
        List<Product> products = adminProductService.getActiveProductsForAdmin();
        return new ResponseEntity<>(products, HttpStatus.ACCEPTED);
    }

    @GetMapping("/all-inactive")
    public ResponseEntity<List<Product>> getAllInactiveCategories() {
        List<Product> products = adminProductService.getInactiveProductsForAdmin();
        return new ResponseEntity<>(products, HttpStatus.ACCEPTED);
    }
}
