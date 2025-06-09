package org.exp.primeapp.dto.responce;

import lombok.Builder;
import lombok.Value;

@Builder
@Value
public class AttachmentRes {
    Long id;
    String key;
}
