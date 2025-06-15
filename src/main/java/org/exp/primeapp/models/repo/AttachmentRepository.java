package org.exp.primeapp.models.repo;

import org.exp.primeapp.models.entities.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    Optional<Attachment> findByIdAnd_activeTrue(Long id);

    List<Attachment> findAllBy_activeTrue();

    List<Attachment> findAllBy_activeFalse();

    @Query("SELECT a FROM Attachment a WHERE NOT EXISTS (SELECT 1 FROM Product p JOIN p.attachments pa WHERE pa = a)")
    List<Attachment> findAllByNotLinkedToProduct();

    @Query("SELECT a FROM Attachment a WHERE a._active = true AND NOT EXISTS (SELECT 1 FROM Product p JOIN p.attachments pa WHERE pa = a)")
    List<Attachment> findAllBy_activeTrueAndNotLinkedToProduct();

    @Query("SELECT a FROM Attachment a WHERE a._active = false AND NOT EXISTS (SELECT 1 FROM Product p JOIN p.attachments pa WHERE pa = a)")
    List<Attachment> findAllBy_activeFalseAndNotLinkedToProduct();

    @Query("SELECT COUNT(a) FROM Attachment a")
    int countAll();

    @Query("SELECT COUNT(a) FROM Attachment a WHERE a._active = true")
    int countAllBy_activeTrue();

    @Query("SELECT COUNT(a) FROM Attachment a WHERE a._active = false")
    int countAllBy_activeFalse();
}