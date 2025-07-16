package org.exp.primeapp.models.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record LoginReq(
        @Email(message = "Email formati noto‘g‘ri")
        @NotBlank(message = "Email bo‘sh bo‘lmasligi kerak")
        String email,

        @NotBlank(message = "Parol bo‘sh bo‘lmasligi kerak")
        String password
) {
}