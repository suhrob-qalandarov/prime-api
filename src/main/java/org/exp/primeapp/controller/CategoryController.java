package org.exp.primeapp.controller;


import lombok.RequiredArgsConstructor;
import org.exp.primeapp.dto.request.CategoryReq;
import org.exp.primeapp.models.entities.Category;
import org.exp.primeapp.service.interfaces.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<Category>> getCategory() {
        List<Category>categories=categoryService.getCategoriesByActive();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody CategoryReq categoryReq) {
        Category category=categoryService.saveCategory(categoryReq);
        return new ResponseEntity<>(category, HttpStatus.CREATED);
    }

    @PostMapping("/{category_id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long category_id,
                                                   @RequestBody CategoryReq categoryReq) {
        Category updatedCategory=categoryService.updateCategoryById(category_id,categoryReq);
        return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
    }
}
