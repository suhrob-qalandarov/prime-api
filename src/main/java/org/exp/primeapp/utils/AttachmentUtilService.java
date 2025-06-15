package org.exp.primeapp.utils;

import org.exp.primeapp.models.dto.responce.AttachmentRes;
import org.exp.primeapp.models.entities.Attachment;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AttachmentUtilService {

    Attachment getAttachment(Long attachmentId);

    void validateFile(MultipartFile file);

    void validateAttachmentId(Long attachmentId);

    List<AttachmentRes> convertToAttachmentResList(List<Attachment> attachments);

    AttachmentRes convertToAttachmentRes(Attachment attachment);
}
