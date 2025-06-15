package org.exp.primeapp.service.interfaces;

import org.exp.primeapp.models.dto.request.CategoryReq;
import org.exp.primeapp.models.dto.responce.ApiResponse;
import org.exp.primeapp.models.dto.responce.CategoryRes;
import org.exp.primeapp.models.entities.Category;

import java.util.List;

public interface CategoryService {

    CategoryRes getCategoryById(Long categoryId);

    List<CategoryRes> getAllCategories();

    List<CategoryRes> getActiveCategories();

    List<CategoryRes> getInactiveCategories();

    ApiResponse saveCategory(CategoryReq categoryReq);

    ApiResponse updateCategoryById(Long categoryId, CategoryReq categoryReq);

    ApiResponse deactivateCategory(Long categoryId);

    ApiResponse activateCategory(Long categoryId);

    ApiResponse activateCategoryWithProducts(Long categoryId);

    Category getCategoryByIdForAdmin(Long categoryId);

}
