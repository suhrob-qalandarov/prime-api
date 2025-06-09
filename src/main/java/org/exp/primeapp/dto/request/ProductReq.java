package org.exp.primeapp.dto.request;

import lombok.Value;

@Value
public class ProductReq {
    String name;
    String description;
    Double price;
    Integer amount;
    Long categoryId;


}
