package org.exp.primeapp.models.dto.responce;

import lombok.Builder;
import lombok.Value;
import org.exp.primeapp.models.enums.Size;

@Builder
public record ProductSizeRes (
        Size size,
        Integer amount
) {
}
