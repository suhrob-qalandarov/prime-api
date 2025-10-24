package org.exp.primeapp.models.dto.responce.admin;

import lombok.Builder;

@Builder
public record AdminSizeRes (
        String value,
        String label
) {}
