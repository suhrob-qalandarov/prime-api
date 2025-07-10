package org.exp.primeapp.models.dto.responce.admin;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record AdminUserRes(
        Long id,
        String firstName,
        String lastName,
        String email,
        String phone,
        Boolean active,
        LocalDateTime createdAt
) {
}
