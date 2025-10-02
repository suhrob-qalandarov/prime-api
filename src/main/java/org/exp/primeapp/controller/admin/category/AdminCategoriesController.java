/*
package org.exp.primeapp.controller.admin.category;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.admin.AdminCategoryDashboardRes;
import org.exp.primeapp.models.dto.responce.user.CategoryRes;
import org.exp.primeapp.models.dto.responce.admin.AdminCategoryRes;
import org.exp.primeapp.service.interfaces.user.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequestMapping(API + V1 + ADMIN + CATEGORIES)
@RequiredArgsConstructor
public class AdminCategoriesController {

    private final CategoryService categoryService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminCategoryDashboardRes> getCategoryDashboard() {
        AdminCategoryDashboardRes categoryDashboardRes = categoryService.getCategoryDashboardRes();
        return new ResponseEntity<>(categoryDashboardRes, HttpStatus.ACCEPTED);
    }

    @GetMapping
    public ResponseEntity<List<CategoryRes>> getCategories() {
        List<CategoryRes> categories = categoryService.getResCategories();
        return new ResponseEntity<>(categories, HttpStatus.ACCEPTED);
    }

    @PatchMapping("/order")
    public ResponseEntity<List<AdminCategoryRes>> updateCategoriesOrder(@RequestBody Map<Long, Long> categoryOrderMap) {
        List<AdminCategoryRes> updatedCategories = categoryService.updateCategoryOrder(categoryOrderMap);
        return new ResponseEntity<>(updatedCategories, HttpStatus.OK);
    }
}
*/
