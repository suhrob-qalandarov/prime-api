package org.exp.primeapp.models.dto.responce.user;

import lombok.Builder;

import java.util.List;

@Builder
public record UserRes(
        Long id,
        String firstName,
        String lastName,
        String email,
        String phone,
        List<String> roles
) {
}
