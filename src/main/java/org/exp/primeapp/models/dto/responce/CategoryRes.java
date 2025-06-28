package org.exp.primeapp.models.dto.responce;

import lombok.Builder;

@Builder
public record CategoryRes(
        Long id,
        String name
) {
}
