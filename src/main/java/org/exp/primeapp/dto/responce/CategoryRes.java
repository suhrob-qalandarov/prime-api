package org.exp.primeapp.dto.responce;

import lombok.Builder;
import lombok.Value;

@Builder
@Value
public class CategoryRes {
    String name;
    Boolean _active;
}
