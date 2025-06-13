package org.exp.primeapp.controller.admin.category;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.entities.Category;
import org.exp.primeapp.models.repo.CategoryRepository;
import org.exp.primeapp.service.interfaces.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequestMapping(API + V1 + ADMIN + CATEGORIES)
@RequiredArgsConstructor
public class AdminCategoriesController {

    private final CategoryService categoryService;
    private final CategoryRepository categoryRepository;

    @GetMapping("/all")
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return new ResponseEntity<>(categories, HttpStatus.ACCEPTED);
    }

    @GetMapping("/all-active")
    public ResponseEntity<List<Category>> getAllActiveCategories() {
        List<Category> categories = categoryService.getActiveCategoriesForAdmin();
        return new ResponseEntity<>(categories, HttpStatus.ACCEPTED);
    }

    @GetMapping("/all-inactive")
    public ResponseEntity<List<Category>> getAllInactiveCategories() {
        List<Category> categories = categoryService.getInactiveCategoriesForAdmin();
        return new ResponseEntity<>(categories, HttpStatus.ACCEPTED);
    }
}
