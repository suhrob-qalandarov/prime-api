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

import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequestMapping(API + V1 + CATEGORIES)
@RequiredArgsConstructor
public class CategoriesController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryRes>> getCategories() {
        List<CategoryRes> categories = categoryService.getResCategories();
        return new ResponseEntity<>(categories, HttpStatus.ACCEPTED);
    }

    @GetMapping("/by-spotlight/{spotlightId}")
    public ResponseEntity <List<CategoryRes>> getCategoriesBySpotlightId(@PathVariable Long spotlightId) {
        List<CategoryRes> categories = categoryService.getSpotlightCategories(spotlightId);
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }
}
