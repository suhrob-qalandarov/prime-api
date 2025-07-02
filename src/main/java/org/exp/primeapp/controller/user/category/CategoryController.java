package org.exp.primeapp.controller.user.category;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.user.CategoryRes;
import org.exp.primeapp.service.interfaces.user.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequestMapping(API + V1 + CATEGORY)
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/{categoryId}")
    public ResponseEntity<CategoryRes> getCategoryById(@PathVariable Long categoryId) {
        CategoryRes categoryRes = categoryService.getCategoryResById(categoryId);
        return new ResponseEntity<>(categoryRes, HttpStatus.OK);
    }
}
