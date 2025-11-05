package org.exp.primeapp.models.dto.request;

import jakarta.validation.constraints.*;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.Set;

@Builder
public record ProductReq (

        @NotBlank(message = "Mahsulot nomi bo‘sh bo‘lmasligi kerak")
        @Size(max = 512, message = "Mahsulot nomi 512 belgidan oshmasin")
        String name,

        @NotBlank(message = "Brend nomi bo‘sh bo‘lmasligi kerak")
        @Size(max = 512, message = "Brend nomi 512 belgidan oshmasin")
        String brand,

        @NotNull(message = "Narx kiritilishi kerak")
        @DecimalMin(value = "0.0", message = "Narx manfiy bo‘lishi mumkin emas")
        BigDecimal price,

        @Size(max = 2048, message = "Tavsif 2048 belgidan oshmasin")
        String description,

        @NotNull(message = "Kategoriya ID kiritilishi kerak")
        @Positive(message = "Kategoriya ID musbat bo‘lishi kerak")
        Long categoryId,

        @NotNull(message = "Rasm yoki fayl kalitlari bo‘sh bo‘lmasligi kerak")
        @Size(max = 10, message = "Eng ko‘pi bilan 10 ta fayl yuklash mumkin")
        Set<String> attachmentKeys
) {}
