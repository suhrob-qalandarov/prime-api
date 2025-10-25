package org.exp.primeapp.models.dto.responce.admin;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record AdminCategoryDashboardRes(
        long totalCount,
        long activeCount,
        long inactiveCount,
        LocalDateTime responseDate,
        List<AdminCategoryRes> categoryResList
){}
