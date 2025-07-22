package org.exp.primeapp.models.dto.responce.global;

import lombok.Builder;
import org.exp.primeapp.models.dto.responce.user.UserRes;

@Builder
public record LoginRes(
        String token,
        UserRes userRes
) {
}