package org.exp.primeapp.models.dto.responce.admin;

import lombok.Builder;
import org.exp.primeapp.models.dto.responce.user.ProductSizeRes;

import java.util.List;

@Builder
public record AdminProductViewRes(
        Long id,
        String name,
        String description,
        Double price,
        Boolean active,
        String status,
        Integer discount,
        String categoryName,
        List<String> attachmentKeys,
        List<ProductSizeRes> productSizeRes,
        String createdAt
) {
}
