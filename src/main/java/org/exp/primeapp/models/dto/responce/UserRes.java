package org.exp.primeapp.models.dto.responce;

import lombok.Builder;

@Builder
public record UserRes(
        Long id,
        String firstName,
        String lastName,
        String email,
        String phone) {

}
