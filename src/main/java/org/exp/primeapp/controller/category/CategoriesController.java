package org.exp.primeapp.controller.category;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.dto.responce.CategoryRes;
import org.exp.primeapp.models.entities.Category;
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
    public ResponseEntity<List<CategoryRes>> getCategories() {
        List<CategoryRes> categories = categoryService.getCategoriesByActive();
        return new ResponseEntity<>(categories, HttpStatus.ACCEPTED);
    }

    @GetMapping("/all-inactive")
    public ResponseEntity<List<Category>> getInactiveCategories() {
        List<Category>categories = categoryService.getCategoriesByInactive();
        return new ResponseEntity<>(categories, HttpStatus.ACCEPTED);
    }
}
