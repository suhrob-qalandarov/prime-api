package org.exp.primeapp.models.dto.responce.global;

import lombok.Builder;

@Builder
public record LoginRes(
        String accessToken,
        String refreshToken,
        String message
) {
}