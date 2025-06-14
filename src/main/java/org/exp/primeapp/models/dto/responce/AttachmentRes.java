package org.exp.primeapp.models.dto.responce;

import lombok.Builder;
import lombok.Value;

@Builder
@Value
public class AttachmentRes {
    Long id;
    String key;
}
