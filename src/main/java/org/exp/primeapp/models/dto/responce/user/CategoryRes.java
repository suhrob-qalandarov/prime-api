package org.exp.primeapp.models.dto.responce.user;

import lombok.Builder;

@Builder
public record CategoryRes(
        Long id,
        String name,
        String spotlightName
) {
}
