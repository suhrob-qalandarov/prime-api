package org.exp.primeapp.service.impl;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.models.entities.Attachment;
import org.exp.primeapp.models.repo.AttachmentRepository;
import org.exp.primeapp.service.interfaces.AttachmentService;
import org.exp.primeapp.service.interfaces.S3Service;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AttachmentServiceImpl implements AttachmentService {

    private final S3Service s3Service;
    private final AttachmentRepository attachmentRepository;

    @Transactional
    @Override
    public List<Attachment> uploadMultiple(MultipartFile[] files) {
        // Har bir faylni S3 ga yuklash va Attachment sifatida saqlash
        List<Attachment> attachments = Arrays.stream(files)
                .map(file -> {

                    if (!file.getContentType().startsWith("image/")) {
                        throw new IllegalArgumentException("Faqat rasm fayllari ruxsat etiladi!");
                    }

                    // Faylni S3 ga yuklash
                    String key = s3Service.uploadAttachment(file);

                    // Attachment entity yaratish
                    Attachment newAttachment = Attachment.builder()
                            .url(key)
                            ._active(true)
                            .build();

                    // Bazaga saqlash
                    return attachmentRepository.save(newAttachment);
                })
                .collect(Collectors.toList());

        return attachments;
    }

    @SneakyThrows
    @Override
    public void get(Long attachmentId, HttpServletResponse response) {
        Optional<Attachment> optionalAttachment = attachmentRepository.findById(attachmentId);

        if (optionalAttachment.isEmpty()) {
            log.error("Not found file with ID {}", attachmentId);
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        Attachment attachment = optionalAttachment.get();
        byte[] file = s3Service.getFile(attachment.getUrl());
        response.setContentType("image/jpeg"); // Rasm uchun MIME turi (ixtiyoriy: dinamik sozlash mumkin)
        response.getOutputStream().write(file);
    }

    @Override
    public Attachment uploadOne(MultipartFile file) {
        String key = s3Service.uploadAttachment(file);

        Attachment newAttachment = Attachment.builder()
                .url(key)
                ._active(true)
                .build();

        return attachmentRepository.save(newAttachment);
    }
}
