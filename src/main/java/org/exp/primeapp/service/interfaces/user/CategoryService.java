package org.exp.primeapp.service.interfaces.user;

import org.exp.primeapp.models.dto.request.CategoryReq;
import org.exp.primeapp.models.dto.responce.admin.AdminCategoryDashboardRes;
import org.exp.primeapp.models.dto.responce.user.CategoryRes;
import org.exp.primeapp.models.dto.responce.admin.AdminCategoryRes;
import org.exp.primeapp.models.entities.Category;

import java.util.List;
import java.util.Map;

public interface CategoryService {

    Category getCategoryById(Long categoryId);

    CategoryRes getCategoryResById(Long categoryId);

    AdminCategoryDashboardRes getCategoryDashboardRes();

    List<Category> getCategories();

    List<CategoryRes> getResCategories();

    AdminCategoryRes saveCategory(CategoryReq categoryReq);

    AdminCategoryRes updateCategoryById(Long categoryId, CategoryReq categoryReq);

    void toggleCategoryActiveStatus(Long categoryId);

    void toggleCategoryActiveStatusWithProductActiveStatus(Long categoryId);

    List<AdminCategoryRes> updateCategoryOrder(Map<Long, Long> categoryOrderMap);

    List<CategoryRes> getSpotlightCategories(Long spotlightId);
}
