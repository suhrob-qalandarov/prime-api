package org.exp.primeapp.models.dto.responce.admin;

import lombok.Builder;
import org.exp.primeapp.models.dto.responce.user.ProductSizeRes;

import java.math.BigDecimal;
import java.util.List;

@Builder
public record AdminProductRes(
        Long id,
        String name,
        String brand,
        String description,
        String categoryName,
        BigDecimal price,
        String status,
        Boolean active,
        Integer discount,
        String createdAt,
        List<String> picturesKeys,
        List<ProductSizeRes> productSizeRes
){}
