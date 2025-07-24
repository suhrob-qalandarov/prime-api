package org.exp.primeapp.models.dto.request;

import lombok.Value;
import org.exp.primeapp.models.enums.Size;

@Value
public class ProductSizeReq {
    Size size;
    Integer amount;
}