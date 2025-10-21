package org.exp.primeapp.utils;

import org.exp.primeapp.models.dto.responce.global.AttachmentRes;
import org.exp.primeapp.models.entities.Attachment;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AttachmentUtilService {

    Attachment getAttachment(Long attachmentId);

    Attachment getAttachmentWithKey(String attachmentKey);

    void validateFile(MultipartFile file);

    void validateAttachmentId(Long attachmentId);

    List<AttachmentRes> convertToAttachmentResList(List<Attachment> attachments);

    AttachmentRes convertToAttachmentRes(Attachment attachment);

    List<String> convertToAttachmentKeys(List<Attachment> attachments);
}
