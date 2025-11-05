package org.exp.primeapp.repository;

import org.exp.primeapp.models.entities.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    Optional<Attachment> findByIdAndActiveTrue(Long id);

    List<Attachment> findAllByActiveTrue();

    List<Attachment> findAllByActiveFalse();

    @Query("SELECT a FROM Attachment a WHERE NOT EXISTS (SELECT 1 FROM Product p JOIN p.attachments pa WHERE pa = a)")
    List<Attachment> findAllByNotLinkedToProduct();

    @Query("SELECT a FROM Attachment a WHERE a.active = true AND NOT EXISTS (SELECT 1 FROM Product p JOIN p.attachments pa WHERE pa = a)")
    List<Attachment> findAllByActiveTrueAndNotLinkedToProduct();

    @Query("SELECT a FROM Attachment a WHERE a.active = false AND NOT EXISTS (SELECT 1 FROM Product p JOIN p.attachments pa WHERE pa = a)")
    List<Attachment> findAllByActiveFalseAndNotLinkedToProduct();

    @Query("SELECT a FROM Attachment a WHERE EXISTS (SELECT 1 FROM Product p JOIN p.attachments pa WHERE pa = a)")
    List<Attachment> findAllByLinkedToProduct();

    @Query("SELECT a FROM Attachment a WHERE a.active = true AND EXISTS (SELECT 1 FROM Product p JOIN p.attachments pa WHERE pa = a)")
    List<Attachment> findAllByActiveTrueAndLinkedToProduct();

    @Query("SELECT a FROM Attachment a WHERE a.active = false AND EXISTS (SELECT 1 FROM Product p JOIN p.attachments pa WHERE pa = a)")
    List<Attachment> findAllByActiveFalseAndLinkedToProduct();

    @Query("SELECT COUNT(a) FROM Attachment a")
    int countAll();

    @Query("SELECT COUNT(a) FROM Attachment a WHERE a.active = true")
    int countAllByActiveTrue();

    @Query("SELECT COUNT(a) FROM Attachment a WHERE a.active = false")
    int countAllByActiveFalse();

    Attachment findByKey(String key);

    Set<Attachment> findAllByKeyIn(Collection<String> keys);
}