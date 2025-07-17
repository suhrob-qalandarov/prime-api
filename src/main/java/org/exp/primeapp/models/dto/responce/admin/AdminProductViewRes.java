package org.exp.primeapp.models.dto.responce.admin;

import lombok.Builder;
import org.exp.primeapp.models.dto.responce.user.ProductSizeRes;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record AdminProductViewRes(
        Long id,
        String name,
        Boolean active,
        String status,
        Integer discount,
        String categoryName,
        List<String> attachmentKeys,
        List<ProductSizeRes> productSizeRes,
        String createdAt
) {
}
