package org.exp.primeapp.controller.admin.attachment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.models.dto.responce.global.AttachmentRes;
import org.exp.primeapp.models.entities.Attachment;
import org.exp.primeapp.service.face.admin.attachment.AdminAttachmentService;
import org.exp.primeapp.utils.AttachmentUtilService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(API + V1 + ADMIN + ATTACHMENT)
public class AdminAttachmentController {

    private final AdminAttachmentService adminAttachmentService;
    private final AttachmentUtilService attachmentUtilService;

    @GetMapping("/{attachmentId}")
    public ResponseEntity<Attachment> getAttachment(@PathVariable Long attachmentId) {
        log.debug("Fetching attachment with ID: {}", attachmentId);
        return ResponseEntity.ok(attachmentUtilService.getAttachment(attachmentId));
    }

    @GetMapping("/with-key/{attachmentKey}")
    public ResponseEntity<Attachment> getAttachmentWithKey(@PathVariable String attachmentKey) {
        log.debug("Fetching attachment with KEY: {}", attachmentKey);
        return ResponseEntity.ok(attachmentUtilService.getAttachmentWithKey(attachmentKey));
    }

    @PostMapping("/oneupload")
    public ResponseEntity<AttachmentRes> uploadFile(@RequestParam("file") MultipartFile file) {
        log.debug("Uploading single file: {}", file.getOriginalFilename());
        Attachment attachment = adminAttachmentService.uploadOne(file);
        AttachmentRes response = AttachmentRes.builder()
                .id(attachment.getId())
                .key(attachment.getKey())
                .filename(attachment.getFilename())
                .contentType(attachment.getContentType())
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/multiupload")
    public ResponseEntity<List<String>> uploadFiles(@RequestParam("files") MultipartFile[] files) {
        log.debug("Uploading multiple files: {}", files.length);
        List<Attachment> uploadedFiles = adminAttachmentService.uploadMultiple(files);
        List<String> responses = attachmentUtilService.convertToAttachmentKeys(uploadedFiles);
        return ResponseEntity.ok(responses);
    }


    @PutMapping("/{attachmentId}")
    public ResponseEntity<AttachmentRes> updateFile(@PathVariable Long attachmentId, @RequestParam("file") MultipartFile file) {
        log.debug("Updating attachment ID: {}", attachmentId);
        AttachmentRes response = adminAttachmentService.update(attachmentId, file);
        return ResponseEntity.ok(response);
    }

    /*@PostMapping("/toggle/{attachmentId}")
    public ResponseEntity<AttachmentRes> activate(@PathVariable Long attachmentId) {
        log.debug("Updating attachment ID: {}", attachmentId);
        AttachmentRes response = adminAttachmentService.toggleAttachmentActiveStatus(attachmentId);
        return ResponseEntity.ok(response);
    }*/

    /*@DeleteMapping("/{attachmentId}")
    public ResponseEntity<Void> deleteAttachment(@PathVariable Long attachmentId) {
        log.debug("Deleting attachment ID: {}", attachmentId);
        adminAttachmentService.delete(attachmentId);
        return ResponseEntity.noContent().build();
    }*/

    /*@DeleteMapping("/delete-from-base/{attachmentId}")
    public ResponseEntity<Void> deleteAttachmentFromS3(@PathVariable Long attachmentId) {
        log.debug("Deleting attachment ID: {}", attachmentId);
        adminAttachmentService.deleteFromS3(attachmentId);
        return ResponseEntity.noContent().build();
    }*/
}