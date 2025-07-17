package org.exp.primeapp.models.dto.responce.admin;

import lombok.Builder;
import org.exp.primeapp.models.dto.responce.admin.spotlight.SimpleSpotlightRes;

@Builder
public record AdminCategoryRes(
        Long id,
        String name,
        SimpleSpotlightRes spotlightRes,
        Long order,
        Boolean active
) {
}
