package org.exp.primeapp.controller.admin.category;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.CategoryRes;
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

    @GetMapping
    public ResponseEntity<List<CategoryRes>> getCategories() {
        List<CategoryRes> categories = categoryService.getAllCategories();
        return new ResponseEntity<>(categories, HttpStatus.ACCEPTED);
    }

    @GetMapping("/active")
    public ResponseEntity<List<CategoryRes>> getActiveCategories() {
        List<CategoryRes> categories = categoryService.getCategories();
        return new ResponseEntity<>(categories, HttpStatus.ACCEPTED);
    }

    @GetMapping("/inactive")
    public ResponseEntity<List<CategoryRes>> getInactiveCategories() {
        List<CategoryRes> categories = categoryService.getInactiveCategories();
        return new ResponseEntity<>(categories, HttpStatus.ACCEPTED);
    }


}
