package org.exp.primeapp.service.impl.global.attachment;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.models.entities.Attachment;
import org.exp.primeapp.repository.AttachmentRepository;
import org.exp.primeapp.service.interfaces.global.attachment.AttachmentService;
import org.exp.primeapp.service.interfaces.global.attachment.S3Service;
import org.exp.primeapp.utils.AttachmentUtilService;
import org.springframework.stereotype.Service;

import java.io.IOException;

import software.amazon.awssdk.services.s3.model.S3Exception;

@Slf4j
@Service
@RequiredArgsConstructor
public class AttachmentServiceImpl implements AttachmentService {

    private final S3Service s3Service;
    private final AttachmentUtilService attachmentUtilService;
    private final AttachmentRepository attachmentRepository;

    /*@Override
    public void get(Long attachmentId, HttpServletResponse response) throws IOException {
        try {
            var attachment = attachmentUtilService.getAttachment(attachmentId);
            byte[] fileContent = getFileContent(attachment.getKey());

            response.setContentType(attachment.getContentType() != null ? attachment.getContentType() : "image/jpeg");
            response.setHeader("Content-Disposition", "inline; filename=\"" + (attachment.getFilename() != null ? attachment.getFilename() : "attachment") + "\"");
            response.getOutputStream().write(fileContent);
            response.getOutputStream().flush();
        } catch (IOException | S3Exception e) {
            log.error("Failed to fetch file for attachment ID {}: {}", attachmentId, e.getMessage());
            throw new IOException("Unable to retrieve file", e);
        }
    }*/

    @Override
    public void get(String attachmentKey, HttpServletResponse response) throws IOException {
        try {
            String[] parts = attachmentKey.split("_", 2);
            String filename = parts.length > 1 ? parts[1] : attachmentKey;
            byte[] fileContent = getFileContent(attachmentKey);

            response.setContentType("image/jpeg");
            response.setHeader("Content-Disposition", "inline; filename=\"" + (filename != null ? filename : "attachment") + "\"");
            response.getOutputStream().write(fileContent);
            response.getOutputStream().flush();
        } catch (IOException | S3Exception e) {
            log.error("Failed to fetch file for attachment KEY {}: {}", attachmentKey, e.getMessage());
            throw new IOException("Unable to retrieve file", e);
        }
    }

    private byte[] getFileContent(String key) throws IOException, S3Exception {
        if (key == null || key.isBlank()) {
            throw new IllegalArgumentException("S3 attachment-key cannot be null or empty");
        }
        return s3Service.getFile(key);
    }
}