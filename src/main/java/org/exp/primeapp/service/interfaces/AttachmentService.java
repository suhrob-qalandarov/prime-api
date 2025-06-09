package org.exp.primeapp.service.interfaces;

import jakarta.servlet.http.HttpServletResponse;
import org.exp.primeapp.models.entities.Attachment;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface AttachmentService {
    Attachment upload(MultipartFile file);

    void get(Long attachmentId, HttpServletResponse response);
}
