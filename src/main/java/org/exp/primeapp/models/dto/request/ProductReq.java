package org.exp.primeapp.models.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.List;

@Builder
public record ProductReq (

        @NotBlank @Size(max = 512, message = "Nomi 512 belgidan oshmasin")
        String name,

        @NotBlank @Size(max = 512, message = "Brend 512 belgidan oshmasin")
        String brand,

        BigDecimal price,
        String description,
        Long categoryId,
        List<String> attachmentKeys,
        List<ProductSizeReq> productSizes
) {}