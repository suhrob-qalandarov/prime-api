package org.exp.primeapp.controller.admin.category;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.CategoryReq;
import org.exp.primeapp.models.dto.responce.admin.AdminCategoryRes;
import org.exp.primeapp.models.entities.Category;
import org.exp.primeapp.service.interfaces.user.CategoryService;
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
    public ResponseEntity<AdminCategoryRes> createCategory(@RequestBody CategoryReq categoryReq) {
        AdminCategoryRes adminCategoryRes = categoryService.saveCategory(categoryReq);
        return new ResponseEntity<>(adminCategoryRes, HttpStatus.CREATED);
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long categoryId) {
        Category category = categoryService.getCategoryById(categoryId);
        return new ResponseEntity<>(category, HttpStatus.OK);
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<AdminCategoryRes> updateCategory(
            @PathVariable Long categoryId,
            @RequestBody CategoryReq categoryReq
    ) {
        AdminCategoryRes categoryRes = categoryService.updateCategoryById(categoryId,categoryReq);
        return new ResponseEntity<>(categoryRes, HttpStatus.valueOf("UPDATED"));
    }

    @PatchMapping("/toggle/{categoryId}")
    public ResponseEntity<Void> toggleCategory(@PathVariable Long categoryId) {
        categoryService.toggleCategoryActiveStatus(categoryId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("/toggle-with-products/{categoryId}")
    public ResponseEntity<Void> toggleCategoryWithProducts(@PathVariable Long categoryId) {
        categoryService.toggleCategoryActiveStatusWithProductActiveStatus(categoryId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
