package org.exp.primeapp.service.face.user;

import org.exp.primeapp.models.dto.request.CategoryReq;
import org.exp.primeapp.models.dto.responce.admin.AdminCategoryDashboardRes;
import org.exp.primeapp.models.dto.responce.user.CategoryRes;
import org.exp.primeapp.models.dto.responce.admin.AdminCategoryRes;

import java.util.List;
import java.util.Map;

public interface CategoryService {

    AdminCategoryDashboardRes getCategoryDashboardRes();

    List<CategoryRes> getResCategories();

    AdminCategoryRes getAdminCategoryResById(Long categoryId);

    AdminCategoryRes saveCategory(CategoryReq categoryReq);

    AdminCategoryRes updateCategoryById(Long categoryId, CategoryReq categoryReq);

    void toggleCategoryActiveStatus(Long categoryId);

    void toggleCategoryActiveStatusWithProductActiveStatus(Long categoryId);

    List<AdminCategoryRes> updateCategoryOrder(Map<Long, Long> categoryOrderMap);

    List<CategoryRes> getResCategoriesBySpotlightName(String spotlightName);
}
