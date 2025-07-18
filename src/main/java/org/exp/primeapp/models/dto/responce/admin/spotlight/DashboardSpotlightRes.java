package org.exp.primeapp.models.dto.responce.admin.spotlight;

import lombok.Builder;

import java.util.List;

@Builder
public record DashboardSpotlightRes(
        long count,
        long activeCount,
        long inactiveCount,
        List<AdminSpotlightRes> spotlightResList,
        List<AdminSpotlightRes> activeSpotlightResList,
        List<AdminSpotlightRes> inactiveSpotlightResList
) {
}
