package org.exp.primeapp.service.interfaces.attachment;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public interface AttachmentService {

    void get(Long attachmentId, HttpServletResponse response) throws IOException;
}
