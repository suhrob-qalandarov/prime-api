package org.exp.primeapp.service.interfaces;

import org.exp.primeapp.dto.request.CategoryReq;
import org.exp.primeapp.dto.responce.CategoryRes;
import org.exp.primeapp.models.entities.Category;

import java.util.List;

public interface CategoryService {

    List<CategoryRes> getCategoriesByActive();

    CategoryRes saveCategory(CategoryReq categoryReq);

    CategoryRes updateCategoryById(Long categoryId, CategoryReq categoryReq);

    CategoryRes updateCategoryActive(Long categoryId);

    Category getCategoryById(Long categoryId);

    List<Category> getCategoriesByInactive();
}
