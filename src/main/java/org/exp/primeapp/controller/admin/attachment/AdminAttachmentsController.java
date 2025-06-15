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
    public ResponseEntity<List<AttachmentRes>> getAllAttachments() {
        log.debug("Fetching all attachments");
        return ResponseEntity.ok(adminAttachmentService.getAllAttachments());
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> getAllAttachmentsCount() {
        log.debug("Fetching all attachments count");
        return ResponseEntity.ok(adminAttachmentService.getAllAttachmentsCount());
    }

    @GetMapping("/active")
    public ResponseEntity<List<AttachmentRes>> getActiveAttachments() {
        log.debug("Fetching active attachments");
        return ResponseEntity.ok(adminAttachmentService.getActiveAttachments());
    }

    @GetMapping("/active-count")
    public ResponseEntity<Integer> getActiveAttachmentsCount() {
        log.debug("Fetching active attachments count");
        return ResponseEntity.ok(adminAttachmentService.getActiveAttachmentsCount());
    }

    @GetMapping("/inactive")
    public ResponseEntity<List<AttachmentRes>> getInactiveAttachments() {
        log.debug("Fetching inactive attachments");
        return ResponseEntity.ok(adminAttachmentService.getInactiveAttachments());
    }

    @GetMapping("/inactive-count")
    public ResponseEntity<Integer> getInactiveAttachmentsCount() {
        log.debug("Fetching inactive attachments count");
        return ResponseEntity.ok(adminAttachmentService.getInactiveAttachmentsCount());
    }

    @GetMapping("/no-linked-with-product")
    public ResponseEntity<List<AttachmentRes>> getAttachmentsNoProduct() {
        log.debug("Fetching all(active+inactive) attachments not linked to products");
        return ResponseEntity.ok(adminAttachmentService.getAttachmentsNoProduct());
    }

    @GetMapping("/active-and-no-linked-with-product")
    public ResponseEntity<List<AttachmentRes>> getActiveAttachmentsNoProduct() {
        log.debug("Fetching active attachments not linked to products");
        return ResponseEntity.ok(adminAttachmentService.getActiveAttachmentsNoProduct());
    }

    @GetMapping("/inactive-and-no-linked-with-product")
    public ResponseEntity<List<AttachmentRes>> getInactiveAttachmentsNoProduct() {
        log.debug("Fetching inactive attachments not linked to products");
        return ResponseEntity.ok(adminAttachmentService.getInactiveAttachmentsNoProduct());
    }
}
