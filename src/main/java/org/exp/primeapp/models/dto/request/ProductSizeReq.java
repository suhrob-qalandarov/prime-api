package org.exp.primeapp.models.dto.request;

import lombok.Builder;
import org.exp.primeapp.models.enums.Size;

@Builder
public record ProductSizeReq (
        Size size,
        Integer amount
) {}