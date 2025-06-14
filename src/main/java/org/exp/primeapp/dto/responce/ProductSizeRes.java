package org.exp.primeapp.dto.responce;

import lombok.Value;
import org.exp.primeapp.models.enums.Size;

@Value
public class ProductSizeRes {
    Size sizes;
    Integer amount;
}
