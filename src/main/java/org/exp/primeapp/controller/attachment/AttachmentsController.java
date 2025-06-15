package org.exp.primeapp.controller.attachment;

import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.service.interfaces.attachment.AttachmentService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@Slf4j
@RestController
@MultipartConfig
@RequiredArgsConstructor
@RequestMapping(API + V1 + ATTACHMENTS)
public class AttachmentsController {

    private final AttachmentService attachmentService;

    @GetMapping
    public void getMultipleAttachments(@RequestParam("attachmentIds") List<Long> attachmentIds, HttpServletResponse response) throws IOException {
        log.debug("Fetching multiple attachments with IDs: {}", attachmentIds);
        for (Long attachmentId : attachmentIds) {
            attachmentService.get(attachmentId, response);
        }
        log.info("Successfully served multiple attachments: {}", attachmentIds);
    }
}
