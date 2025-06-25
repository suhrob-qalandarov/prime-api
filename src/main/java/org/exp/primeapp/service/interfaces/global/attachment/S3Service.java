package org.exp.primeapp.service.interfaces.global.attachment;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public interface S3Service {

    String uploadAttachment(MultipartFile file) throws IOException;

    byte[] getFile(String url) throws IOException;

    void deleteFile(String oldKey);
}
