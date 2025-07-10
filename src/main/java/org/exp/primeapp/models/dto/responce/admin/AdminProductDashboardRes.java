package org.exp.primeapp.models.dto.responce.admin;

import lombok.*;

import java.util.List;

@Builder
public record AdminProductDashboardRes(
        long count,
        long activeCount,
        long inactiveCount,
        List<AdminProductRes> productResList,
        List<AdminProductRes> ActiveProductResList,
        List<AdminProductRes> InactiveProductResList
) {
}
