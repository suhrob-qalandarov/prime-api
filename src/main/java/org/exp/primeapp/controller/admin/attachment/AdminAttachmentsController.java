package org.exp.primeapp.controller.admin.attachment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.models.dto.responce.global.AttachmentRes;
import org.exp.primeapp.models.entities.Attachment;
import org.exp.primeapp.service.interfaces.admin.attachment.AdminAttachmentService;
import org.exp.primeapp.utils.AttachmentUtilService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(API + V1 + ADMIN + ATTACHMENTS)
public class AdminAttachmentsController {

    private final AdminAttachmentService adminAttachmentService;
    private final AttachmentUtilService attachmentUtilService;

    @PostMapping("/upload")
    public ResponseEntity<List<AttachmentRes>> uploadFiles(@RequestParam("files") MultipartFile[] files) {
        log.debug("Uploading multiple files: {}", files.length);
        List<Attachment> uploadedFiles = adminAttachmentService.uploadMultiple(files);
        List<AttachmentRes> responses = attachmentUtilService.convertToAttachmentResList(uploadedFiles);
        return ResponseEntity.ok(responses);
    }

    @GetMapping()
    public ResponseEntity<List<AttachmentRes>> getAttachments() {
        log.debug("Fetching all attachments");
        return ResponseEntity.ok(adminAttachmentService.getAttachments());
    }

    @GetMapping("/no-linked-with-product")
    public ResponseEntity<List<AttachmentRes>> getAttachmentsNoProduct() {
        log.debug("Fetching all(active+inactive) attachments not linked to products");
        return ResponseEntity.ok(adminAttachmentService.getAttachmentsNoProduct());
    }

    @GetMapping("/linked-with-product")
    public ResponseEntity<List<AttachmentRes>> getAttachmentsLinkedWithProduct() {
        log.debug("Fetching all(active+inactive) attachments linked to products");
        return ResponseEntity.ok(adminAttachmentService.getAttachmentsLinkedWithProduct());
    }

    @GetMapping("/deleted")
    public ResponseEntity<Void> getDeletedAttachments() {
        return (ResponseEntity<Void>) ResponseEntity.ok();
    }
}
