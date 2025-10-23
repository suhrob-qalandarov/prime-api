package org.exp.primeapp.models.dto.responce.user;

import lombok.*;
import org.exp.primeapp.models.enums.ProductStatus;

import java.math.BigDecimal;
import java.util.List;

@Builder
public record ProductRes(
        Long id,
        String name,
        String description,
        BigDecimal price,
        Integer discount,
        ProductStatus status,
        String categoryName,
        List<String> attachmentKeys,
        List<ProductSizeRes> productSizes
) {
}
