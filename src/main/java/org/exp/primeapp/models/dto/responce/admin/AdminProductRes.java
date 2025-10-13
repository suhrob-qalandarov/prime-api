package org.exp.primeapp.models.dto.responce.admin;

import lombok.Builder;

@Builder
public record AdminProductRes(
        Long id,
        String name,
        String brand,
        Boolean active,
        String status,
        Integer discount,
        String categoryName,
        Integer attachmentCount,
        //String collectionName,
        Integer sizeCount
) {
}
