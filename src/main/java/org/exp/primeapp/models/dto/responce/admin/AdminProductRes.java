package org.exp.primeapp.models.dto.responce.admin;

import lombok.Builder;

import java.math.BigDecimal;
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
        BigDecimal price,
        String status,
        Boolean active,
        Integer discount,
        LocalDateTime createdAt,
        Integer sizeCount
) {
}
