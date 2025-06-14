package org.exp.primeapp.controller.category;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.CategoryRes;
import org.exp.primeapp.service.interfaces.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import static org.exp.primeapp.utils.Const.*;

@RestController
@RequestMapping(API + V1 + CATEGORY)
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/{categoryId}")
    public ResponseEntity<CategoryRes> getCategoryById(@PathVariable Long categoryId) {
        CategoryRes categoryRes = categoryService.getCategoryById(categoryId);
        return new ResponseEntity<>(categoryRes, HttpStatus.OK);
    }
}
