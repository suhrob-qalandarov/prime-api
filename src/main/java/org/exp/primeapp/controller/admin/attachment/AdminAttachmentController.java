package org.exp.primeapp.controller.admin.attachment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.models.dto.responce.AttachmentRes;
import org.exp.primeapp.models.entities.Attachment;
import org.exp.primeapp.service.interfaces.attachment.AdminAttachmentService;
import org.exp.primeapp.utils.AttachmentUtilService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import static org.exp.primeapp.utils.Const.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(API + V1 + ADMIN + ATTACHMENT)
public class AdminAttachmentController {

    private final AdminAttachmentService adminAttachmentService;
    private final AttachmentUtilService attachmentUtilService;

    @GetMapping("/{attachmentId}")
    public ResponseEntity<AttachmentRes> getAttachment(@PathVariable Long attachmentId) {
        log.debug("Fetching attachment with ID: {}", attachmentId);
        Attachment attachment = attachmentUtilService.getAttachment(attachmentId);
        AttachmentRes response = AttachmentRes.builder()
                .id(attachment.getId())
                .url(attachment.getUrl())
                .filename(attachment.getFilename())
                .contentType(attachment.getContentType())
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/upload")
    public ResponseEntity<AttachmentRes> uploadFile(@RequestParam("file") MultipartFile file) {
        log.debug("Uploading single file: {}", file.getOriginalFilename());
        Attachment attachment = adminAttachmentService.uploadOne(file);
        AttachmentRes response = AttachmentRes.builder()
                .id(attachment.getId())
                .url(attachment.getUrl())
                .filename(attachment.getFilename())
                .contentType(attachment.getContentType())
                .build();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{attachmentId}")
    public ResponseEntity<AttachmentRes> updateFile(@PathVariable Long attachmentId, @RequestParam("file") MultipartFile file) {
        log.debug("Updating attachment ID: {}", attachmentId);
        AttachmentRes response = adminAttachmentService.update(attachmentId, file);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{attachmentId}")
    public ResponseEntity<Void> deleteAttachment(@PathVariable Long attachmentId) {
        log.debug("Deleting attachment ID: {}", attachmentId);
        adminAttachmentService.delete(attachmentId);
        return ResponseEntity.noContent().build();
    }
}