package org.exp.primeapp.models.dto.responce;

import lombok.Value;
import org.exp.primeapp.models.enums.Size;

@Value
public class ProductSizeRes {
    Size size;
    Integer amount;
}
