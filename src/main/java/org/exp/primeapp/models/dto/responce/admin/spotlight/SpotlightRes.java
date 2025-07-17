package org.exp.primeapp.models.dto.responce.admin.spotlight;

import lombok.Builder;

@Builder
public record SpotlightRes(
        Long id,
        String name,
        Long orderNumber,
        Boolean active,
        Integer categoriesCount
) {
}
