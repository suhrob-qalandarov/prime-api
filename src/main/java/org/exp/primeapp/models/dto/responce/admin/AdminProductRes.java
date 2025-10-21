package org.exp.primeapp.models.dto.responce.admin;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record AdminProductRes(
        Long id,
        String name,
        String brand,
        String description,
        List<String> picturesKeys,
        String categoryName,
        Double price,
        String status,
        Boolean active,
        Integer discount,
        LocalDateTime createdAt,
        Integer sizeCount
) {
}
