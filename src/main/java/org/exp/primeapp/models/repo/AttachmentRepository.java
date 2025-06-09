package org.exp.primeapp.models.repo;

import org.exp.primeapp.models.entities.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
}