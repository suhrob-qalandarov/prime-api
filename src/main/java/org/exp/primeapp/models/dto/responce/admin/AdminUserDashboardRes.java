package org.exp.primeapp.models.dto.responce.admin;

import lombok.Builder;

import java.util.List;

@Builder
public record AdminUserDashboardRes(
        long count,
        long activeCount,
        long inactiveCount,
        List<AdminUserRes> adminUserResList,
        List<AdminUserRes> activeAdminUserResList,
        List<AdminUserRes> inactiveAdminUserResList
) {
}
