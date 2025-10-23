package org.exp.primeapp.models.dto.responce.admin;

import lombok.*;
import java.util.List;

@Builder
public record AdminProductDashboardRes(
        long totalCount,
        long activeCount,
        long inactiveCount,
        long newCount,
        long hotCount,
        long saleCount,
        String responseDate,
        List<AdminProductRes> productResList
) {}