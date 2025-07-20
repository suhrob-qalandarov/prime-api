package org.exp.primeapp.models.dto.responce.user;

import lombok.Builder;
import org.exp.primeapp.models.enums.Size;

@Builder
public record ProductSizeRes (
        String size,
        Integer amount
) {
}
