package org.exp.primeapp.dto.request;

import lombok.Value;

@Value
public class CategoryReq {
    String name;
    Boolean active;
}
