package org.exp.primeapp.service.interfaces.attachment;

import org.exp.primeapp.models.dto.responce.AttachmentRes;
import org.exp.primeapp.models.entities.Attachment;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AdminAttachmentService {

    Attachment uploadOne(MultipartFile file);

    List<Attachment> uploadMultiple(MultipartFile[] files);

    AttachmentRes update(Long attachmentId, MultipartFile file);

    void delete(Long attachmentId);

    List<AttachmentRes> getAllAttachments();

    List<AttachmentRes> getActiveAttachments();

    List<AttachmentRes> getInactiveAttachments();

    List<AttachmentRes> getAttachmentsNoProduct();

    List<AttachmentRes> getActiveAttachmentsNoProduct();

    List<AttachmentRes> getInactiveAttachmentsNoProduct();

    List<AttachmentRes> getAttachmentsLinkedWithProduct();

    List<AttachmentRes> getActiveAttachmentsLinkedWithProduct();

    List<AttachmentRes> getInactiveAttachmentsLinkedWithProduct();

    int getAllAttachmentsCount();

    int getActiveAttachmentsCount();

    int getInactiveAttachmentsCount();

    void deleteFromS3(Long attachmentId);

    AttachmentRes activateAttachment(Long attachmentId);
    AttachmentRes deactivateAttachment(Long attachmentId);
}
