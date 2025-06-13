package org.exp.primeapp.controller.category;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.dto.responce.CategoryRes;
import org.exp.primeapp.service.interfaces.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequestMapping(API + V1 + CATEGORIES)
@RequiredArgsConstructor
public class CategoriesController {

    private final CategoryService categoryService;

    @GetMapping("/all-active")
    public ResponseEntity<List<CategoryRes>> getActiveCategories() {
        List<CategoryRes> categories = categoryService.getActiveCategories();
        return new ResponseEntity<>(categories, HttpStatus.ACCEPTED);
    }
}
