package org.exp.primeapp.service.interfaces;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface S3Service {

    String uploadAttachment(MultipartFile file);

    byte[] getFile(String url);
}
