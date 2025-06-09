package org.exp.primeapp.service.impl;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.models.entities.Attachment;
import org.exp.primeapp.models.repo.AttachmentRepository;
import org.exp.primeapp.service.interfaces.AttachmentService;
import org.exp.primeapp.service.interfaces.S3Service;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AttachmentServiceImpl implements AttachmentService {

    private final S3Service s3Service;
    private final AttachmentRepository attachmentRepository;

    @Override
    public Long upload(MultipartFile file) {
        String key = s3Service.uploadAttachment(file);

        Attachment newAttachment = Attachment.builder()
                .url(key)
                .build();

        Attachment savedAttachment = attachmentRepository.save(newAttachment);
        return savedAttachment.getId();
    }

    @SneakyThrows
    @Override
    public void get(Long attachmentId, HttpServletResponse response) {
        Optional<Attachment> optionalAttachment = attachmentRepository.findById(attachmentId);

        if (optionalAttachment.isEmpty()) {
            log.error("Not found file {}", optionalAttachment);
            return;
        }

        Attachment attachment = optionalAttachment.get();
        byte[] file = s3Service.getFile(attachment.getUrl());
        response.getOutputStream().write(file);
    }
}
