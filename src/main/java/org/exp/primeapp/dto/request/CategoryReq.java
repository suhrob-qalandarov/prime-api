package org.exp.primeapp.dto.request;

import lombok.Value;

@Value
public class CategoryReq {
    String name;
    Long attachmentId;
    Boolean active;
}
