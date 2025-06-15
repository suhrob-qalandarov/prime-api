package org.exp.primeapp.models.dto.responce;

import lombok.Builder;

@Builder
public record AttachmentRes(Long id, String url, String filename, String contentType) {
}
