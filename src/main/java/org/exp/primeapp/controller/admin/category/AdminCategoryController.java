package org.exp.primeapp.controller.admin.category;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.CategoryReq;
import org.exp.primeapp.models.dto.responce.admin.AdminCategoryDashboardRes;
import org.exp.primeapp.models.dto.responce.admin.AdminCategoryRes;
import org.exp.primeapp.service.face.user.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequestMapping(API + V2 + ADMIN + CATEGORY)
@RequiredArgsConstructor
public class AdminCategoryController {

    private final CategoryService categoryService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminCategoryRes> createCategory(@RequestBody CategoryReq categoryReq) {
        AdminCategoryRes adminCategoryRes = categoryService.saveCategory(categoryReq);
        return new ResponseEntity<>(adminCategoryRes, HttpStatus.CREATED);
    }

    @GetMapping("/{categoryId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VISITOR')")
    public ResponseEntity<AdminCategoryRes> getCategoryById(@PathVariable Long categoryId) {
        AdminCategoryRes adminCategoryRes  = categoryService.getAdminCategoryResById(categoryId);
        return new ResponseEntity<>(adminCategoryRes, HttpStatus.OK);
    }

    @PutMapping("/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminCategoryRes> updateCategory(
            @PathVariable Long categoryId,
            @RequestBody CategoryReq categoryReq
    ) {
        AdminCategoryRes categoryRes = categoryService.updateCategoryById(categoryId,categoryReq);
        return new ResponseEntity<>(categoryRes, HttpStatus.ACCEPTED);
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'VISITOR')")
    public ResponseEntity<AdminCategoryDashboardRes> getCategoryDashboard() {
        AdminCategoryDashboardRes categoryDashboardRes = categoryService.getCategoryDashboardRes();
        return new ResponseEntity<>(categoryDashboardRes, HttpStatus.ACCEPTED);
    }

    @PatchMapping("/order")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminCategoryRes>> updateCategoriesOrder(@RequestBody Map<Long, Long> categoryOrderMap) {
        List<AdminCategoryRes> updatedCategories = categoryService.updateCategoryOrder(categoryOrderMap);
        return new ResponseEntity<>(updatedCategories, HttpStatus.ACCEPTED);
    }

    @PatchMapping("/toggle/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> toggleCategory(@PathVariable Long categoryId) {
        categoryService.toggleCategoryActiveStatus(categoryId);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @PatchMapping("/toggle-with-products/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> toggleCategoryWithProducts(@PathVariable Long categoryId) {
        categoryService.toggleCategoryActiveStatusWithProductActiveStatus(categoryId);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }
}
