package org.exp.primeapp.models.dto.responce;

import lombok.Builder;

@Builder
public record SpotlightRes(
        Long id,
        String name,
        Long imageId
) {
}
