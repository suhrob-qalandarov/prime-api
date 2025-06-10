package org.exp.primeapp.service.interfaces;

import jakarta.servlet.http.HttpServletResponse;
import org.exp.primeapp.models.entities.Attachment;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public interface AttachmentService {
    Attachment uploadOne(MultipartFile file);

    void get(Long attachmentId, HttpServletResponse response);

    List<Attachment> uploadMultiple(MultipartFile[] files);
}
