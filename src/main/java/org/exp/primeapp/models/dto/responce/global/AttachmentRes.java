package org.exp.primeapp.models.dto.responce.global;

import lombok.Builder;

@Builder
public record AttachmentRes(Long id, String key, String filename, String contentType) {
}
