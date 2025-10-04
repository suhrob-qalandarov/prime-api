package org.exp.primeapp.models.dto.responce.admin;

import lombok.Builder;

@Builder
public record AdminCategoryRes(
        Long id,
        String name,
        String spotlightName,
        Long order,
        Boolean active
) {
}
