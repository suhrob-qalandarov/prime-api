package org.exp.primeapp.controller;

import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.dto.responce.AttachmentRes;
import org.exp.primeapp.models.entities.Attachment;
import org.exp.primeapp.service.interfaces.AttachmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import static org.exp.primeapp.utils.Const.*;

@RestController
@MultipartConfig
@RequiredArgsConstructor
@RequestMapping(API + V1 + ATTACHMENT)
public class AttachmentController {

    private final AttachmentService attachmentService;

    @PostMapping
    public ResponseEntity<AttachmentRes> uploadFile(@RequestParam("file") MultipartFile file) {
        Attachment uploadedFile = attachmentService.upload(file);
        AttachmentRes attachmentRes = AttachmentRes.builder()
                .id(uploadedFile.getId())
                .key(uploadedFile.getUrl())
                .build();
        return ResponseEntity.ok(attachmentRes);
    }

    @GetMapping("{attachmentId}")
    public void getFile(@PathVariable Long attachmentId, HttpServletResponse response) {
        attachmentService.get(attachmentId, response);
    }
}
