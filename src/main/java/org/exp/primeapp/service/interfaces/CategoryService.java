package org.exp.primeapp.service.interfaces;

import org.exp.primeapp.dto.request.CategoryReq;
import org.exp.primeapp.dto.responce.ApiResponse;
import org.exp.primeapp.dto.responce.CategoryRes;
import org.exp.primeapp.models.entities.Category;

import java.util.List;

public interface CategoryService {

    List<CategoryRes> getCategoriesByActive();

    List<Category> getCategoriesByActiveForAdmin();

    List<Category> getCategoriesByInactive();

    ApiResponse saveCategory(CategoryReq categoryReq);

    ApiResponse updateCategoryById(Long categoryId, CategoryReq categoryReq);

    ApiResponse updateCategoryActiveFalse(Long categoryId);

    ApiResponse updateCategoryActiveTrue(Long categoryId);

    ApiResponse updateCategoryProductsActiveTrue(Long categoryId);

    CategoryRes getCategoryById(Long categoryId);

    Category getCategoryByIdForAdmin(Long categoryId);
}
