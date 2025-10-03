package org.exp.primeapp.models.dto.responce.admin;

import lombok.Builder;
import org.exp.primeapp.models.dto.responce.admin.spotlight.SimpleSpotlightRes;

@Builder
public record AdminCategoryRes(
        Long id,
        String name,
        String spotlightName,
        Long order,
        Boolean active
) {
}
