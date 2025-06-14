package org.exp.primeapp.controller.admin.category;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.CategoryReq;
import org.exp.primeapp.models.dto.responce.ApiResponse;
import org.exp.primeapp.models.entities.Category;
import org.exp.primeapp.service.interfaces.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequestMapping(API + V1 + ADMIN + CATEGORY)
@RequiredArgsConstructor
public class AdminCategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<ApiResponse> createCategory(@RequestBody CategoryReq categoryReq) {
        ApiResponse apiResponse = categoryService.saveCategory(categoryReq);
        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long categoryId) {
        Category category = categoryService.getCategoryByIdForAdmin(categoryId);
        return new ResponseEntity<>(category, HttpStatus.OK);
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<ApiResponse> updateCategory(
            @PathVariable Long categoryId,
            @RequestBody CategoryReq categoryReq
    ) {
        ApiResponse apiResponse = categoryService.updateCategoryById(categoryId,categoryReq);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PutMapping("/activate/{categoryId}")
    public ResponseEntity<ApiResponse> activateCategory(@PathVariable Long categoryId) {
        ApiResponse apiResponse = categoryService.activateCategory(categoryId);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PutMapping("/activate-with-products/{categoryId}")
    public ResponseEntity<ApiResponse> activateCategoryWithProducts(@PathVariable Long categoryId) {
        ApiResponse apiResponse = categoryService.activateCategoryWithProducts(categoryId);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @DeleteMapping("/deactivate/{categoryId}")
    public ResponseEntity<ApiResponse> deleteCategory(@PathVariable Long categoryId) {
        ApiResponse apiResponse = categoryService.deactivateCategory(categoryId);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }
}
