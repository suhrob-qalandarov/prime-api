package org.exp.primeapp.models.dto.responce.user;

import lombok.Builder;

import java.util.List;

@Builder
public record UserRes(
        Long telegramId,
        String firstName,
        String lastName,
        String username,
        String phone,
        List<String> roles
) {
}
