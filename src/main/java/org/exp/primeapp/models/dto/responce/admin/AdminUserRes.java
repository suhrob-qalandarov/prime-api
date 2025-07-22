package org.exp.primeapp.models.dto.responce.admin;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record AdminUserRes(
        Long telegramId,
        String firstName,
        String lastName,
        String username,
        String phone,
        List<String> roles,
        Boolean active,
        LocalDateTime createdAt
) {
}
