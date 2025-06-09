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
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<Category>> getCategories() {
        List<Category>categories=categoryService.getCategoriesByActive();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    @PostMapping("/admin")
    public ResponseEntity<Category> createCategory(@RequestBody CategoryReq categoryReq) {
        Category category=categoryService.saveCategory(categoryReq);
        return new ResponseEntity<>(category, HttpStatus.CREATED);
    }

    @PostMapping("/admin/update/{category_id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long category_id,
                                                   @RequestBody CategoryReq categoryReq) {
        Category updatedCategory=categoryService.updateCategoryById(category_id,categoryReq);
        return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
    }

    @GetMapping("/{category_id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long category_id) {
        Category category=categoryService.getCategoryById(category_id);
        return new ResponseEntity<>(category, HttpStatus.OK);
    }

    @DeleteMapping("/admin/{category_id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long category_id) {
        categoryService.updateCategoryIsActive(category_id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
