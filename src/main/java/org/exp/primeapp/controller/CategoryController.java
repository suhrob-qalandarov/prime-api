package org.exp.primeapp.controller;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.dto.request.CategoryReq;
import org.exp.primeapp.dto.responce.CategoryRes;
import org.exp.primeapp.models.entities.Category;
import org.exp.primeapp.service.interfaces.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequestMapping(API + V1 + CATEGORY)
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/active")
    public ResponseEntity<List<CategoryRes>> getCategories() {
        List<CategoryRes>categories = categoryService.getCategoriesByActive();
        return new ResponseEntity<>(categories, HttpStatus.ACCEPTED);
    }

    @GetMapping("/inactive")
    public ResponseEntity<List<Category>> getInactiveCategories() {
        List<Category>categories = categoryService.getCategoriesByInactive();
        return new ResponseEntity<>(categories, HttpStatus.ACCEPTED);
    }

    @PostMapping
    public ResponseEntity<CategoryRes> createCategory(@RequestBody CategoryReq categoryReq) {
        CategoryRes category = categoryService.saveCategory(categoryReq);
        return new ResponseEntity<>(category, HttpStatus.CREATED);
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<CategoryRes> updateCategory(
            @PathVariable Long categoryId,
            @RequestBody CategoryReq categoryReq
    ) {
        CategoryRes updatedCategory = categoryService.updateCategoryById(categoryId,categoryReq);
        return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long categoryId) {
        Category category = categoryService.getCategoryById(categoryId);
        return new ResponseEntity<>(category, HttpStatus.OK);
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long categoryId) {
        CategoryRes categoryRes = categoryService.updateCategoryActive(categoryId);
        return new ResponseEntity<>(categoryRes, HttpStatus.OK);
    }
}
