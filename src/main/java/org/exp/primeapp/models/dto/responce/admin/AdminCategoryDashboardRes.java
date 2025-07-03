package org.exp.primeapp.models.dto.responce.admin;

import lombok.Builder;

import java.util.List;

@Builder
public record AdminCategoryDashboardRes(
        long count,
        long activeCount,
        long inactiveCount,
        List<AdminCategoryRes> categoryResList,
        List<AdminCategoryRes> activeCategoryResList,
        List<AdminCategoryRes> inactiveCategoryResList
) {
}
