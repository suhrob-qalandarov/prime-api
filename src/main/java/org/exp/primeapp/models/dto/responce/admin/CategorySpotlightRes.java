package org.exp.primeapp.models.dto.responce.admin;

import lombok.Builder;

@Builder
public record  CategorySpotlightRes(
        Long id,
        String name
) {
}
