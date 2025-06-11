package org.exp.primeapp.service.interfaces;

import org.exp.primeapp.dto.request.CategoryReq;
import org.exp.primeapp.models.entities.Category;

import java.util.List;

public interface CategoryService {

    List<Category> getCategoriesByActive();

    Category saveCategory(CategoryReq categoryReq);

    Category updateCategoryById(Long categoryId, CategoryReq categoryReq);

    void updateCategoryActive(Long categoryId);

    Category getCategoryById(Long categoryId);
}
