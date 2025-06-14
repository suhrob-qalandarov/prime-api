package org.exp.primeapp.dto.request;

import lombok.Value;
import org.exp.primeapp.models.enums.Size;

@Value
public class ProductSizeReq {
    Size sizes;
    Integer amount;
}