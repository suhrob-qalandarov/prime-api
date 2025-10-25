package org.exp.primeapp.service.face.admin.attachment;

import org.exp.primeapp.models.dto.responce.global.AttachmentRes;
import org.exp.primeapp.models.entities.Attachment;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AdminAttachmentService {

    Attachment uploadOne(MultipartFile file);

    List<Attachment> uploadMultiple(MultipartFile[] files);

    AttachmentRes update(Long attachmentId, MultipartFile file);

    void delete(Long attachmentId);

    List<AttachmentRes> getAttachments();

    List<AttachmentRes> getAttachmentsNoProduct();

    List<AttachmentRes> getAttachmentsLinkedWithProduct();

    void deleteFromS3(Long attachmentId);

    AttachmentRes toggleAttachmentActiveStatus(Long attachmentId);
}
