package org.exp.primeapp.models.dto.responce.user;

import lombok.Builder;

@Builder
public record SpotlightRes(
        Long id,
        String name,
        String imageKey
) {
}
