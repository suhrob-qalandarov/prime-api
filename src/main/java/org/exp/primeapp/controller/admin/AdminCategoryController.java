package org.exp.primeapp.controller.admin;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.dto.request.CategoryReq;
import org.exp.primeapp.dto.responce.ApiResponse;
import org.exp.primeapp.models.entities.Category;
import org.exp.primeapp.service.interfaces.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequestMapping(API + V1 + ADMIN + CATEGORY)
@RequiredArgsConstructor
public class AdminCategoryController {

    private final CategoryService categoryService;

    @GetMapping("/{categoryId}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long categoryId) {
        Category category = categoryService.getCategoryByIdForAdmin(categoryId);
        return new ResponseEntity<>(category, HttpStatus.OK);
    }

    @GetMapping("/all-active")
    public ResponseEntity<List<Category>> getCategories() {
        List<Category> categories = categoryService.getCategoriesByActiveForAdmin();
        return new ResponseEntity<>(categories, HttpStatus.ACCEPTED);
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createCategory(@RequestBody CategoryReq categoryReq) {
        ApiResponse apiResponse = categoryService.saveCategory(categoryReq);
        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<ApiResponse> updateCategory(
            @PathVariable Long categoryId,
            @RequestBody CategoryReq categoryReq
    ) {
        ApiResponse apiResponse = categoryService.updateCategoryById(categoryId,categoryReq);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<ApiResponse> deleteCategory(@PathVariable Long categoryId) {
        ApiResponse apiResponse = categoryService.updateCategoryActiveFalse(categoryId);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }
}
