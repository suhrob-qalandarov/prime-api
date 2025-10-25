package org.exp.primeapp.controller.global.attachment;

import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.service.face.global.attachment.AttachmentService;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

import static org.exp.primeapp.utils.Const.*;

@Slf4j
@RestController
@MultipartConfig
@RequiredArgsConstructor
@RequestMapping(API + V1 + ATTACHMENT)
public class AttachmentController {

    private final AttachmentService attachmentService;

    @GetMapping("/{key}")
    public void getAttachment(@PathVariable String key, HttpServletResponse response) throws IOException {
        log.debug("Fetching attachment with KEY: {}", key);
        attachmentService.get(key, response);
        log.info("Successfully served attachment: {}", key);
    }
}
