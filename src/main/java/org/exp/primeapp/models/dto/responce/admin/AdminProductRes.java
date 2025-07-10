package org.exp.primeapp.models.dto.responce.admin;

import lombok.Builder;

@Builder
public record AdminProductRes(
        Long id,
        String name,
        Integer discount,
        Boolean active,
        String status,
        String categoryName,
        Integer attachmentCount,
        String collectionName,
        Integer sizeCount
) {
}
