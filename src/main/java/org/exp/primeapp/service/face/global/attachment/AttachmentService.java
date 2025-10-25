package org.exp.primeapp.service.face.global.attachment;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public interface AttachmentService {

    void get(String attachmentKey, HttpServletResponse response) throws IOException;
}
