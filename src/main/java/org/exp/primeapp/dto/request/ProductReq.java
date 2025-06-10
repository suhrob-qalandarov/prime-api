package org.exp.primeapp.dto.request;

import lombok.Value;

import java.util.List;

@Value
public class ProductReq {
    String name;
    String description;
    Double price;
    Integer amount;
    Long categoryId;
    List<Long> attachmentIds;
}
