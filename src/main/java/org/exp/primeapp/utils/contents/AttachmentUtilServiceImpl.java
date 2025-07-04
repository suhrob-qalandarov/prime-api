package org.exp.primeapp.utils.contents;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.models.dto.responce.global.AttachmentRes;
import org.exp.primeapp.models.entities.Attachment;
import org.exp.primeapp.repository.AttachmentRepository;
import org.exp.primeapp.utils.AttachmentUtilService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AttachmentUtilServiceImpl implements AttachmentUtilService {

    private final AttachmentRepository attachmentRepository;

    @Override
    public Attachment getAttachment(Long attachmentId) {
        validateAttachmentId(attachmentId);
        return attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new EntityNotFoundException("Active attachment not found with ID: " + attachmentId));
    }

    @Override
    public Attachment getAttachmentWithKey(String attachmentKey) {
        return attachmentRepository.findByKey(attachmentKey);
    }

    @Override
    public void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null or empty");
        }
        if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }
        if (file.getSize() > 5 * 1024 * 1024) { // 5MB limit
            throw new IllegalArgumentException("File size exceeds 5MB limit");
        }
    }

    @Override
    public void validateAttachmentId(Long attachmentId) {
        if (attachmentId == null || attachmentId <= 0) {
            throw new IllegalArgumentException("Invalid attachment ID: " + attachmentId);
        }
    }

    @Override
    public List<AttachmentRes> convertToAttachmentResList(List<Attachment> attachments) {
        return attachments.stream()
                .map(this::convertToAttachmentRes)
                .collect(Collectors.toList());
    }

    @Override
    public AttachmentRes convertToAttachmentRes(Attachment attachment) {
        return AttachmentRes.builder()
                .id(attachment.getId())
                .key(attachment.getKey())
                .filename(attachment.getFilename())
                .contentType(attachment.getContentType())
                .build();
    }
}