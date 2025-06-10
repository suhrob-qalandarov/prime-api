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

import java.util.List;
import java.util.stream.Collectors;

import static org.exp.primeapp.utils.Const.*;

@RestController
@MultipartConfig
@RequiredArgsConstructor
@RequestMapping(API + V1 + ATTACHMENT)
public class AttachmentController {

    private final AttachmentService attachmentService;

    @PostMapping
    public ResponseEntity<List<AttachmentRes>> uploadFiles(@RequestParam("file") MultipartFile[] files) {
        List<Attachment> uploadedFiles = attachmentService.uploadMultiple(files);
        List<AttachmentRes> attachmentResponses = uploadedFiles.stream()
                .map(attachment -> AttachmentRes.builder()
                        .id(attachment.getId())
                        .key(attachment.getUrl())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(attachmentResponses);
    }

    @GetMapping("{attachmentId}")
    public void getFile(@PathVariable Long attachmentId, HttpServletResponse response) {
        attachmentService.get(attachmentId, response);
    }
}
