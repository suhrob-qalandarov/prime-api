package org.exp.primeapp.service.impl.attachment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.service.interfaces.attachment.S3Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.io.IOException;
import java.io.InputStream;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3ServiceImpl implements S3Service {

    @Value("${aws.s3.bucket}")
    private String bucketName;

    private final S3Client s3Client;

    @Override
    public String uploadAttachment(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null or empty");
        }

        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename() : file.getName();
        String key = filename + "_" + System.currentTimeMillis();

        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .build();

        try (InputStream inputStream = file.getInputStream()) {
            s3Client.putObject(objectRequest, RequestBody.fromInputStream(inputStream, file.getSize()));
            log.info("Uploaded file to S3 with key: {}", key);
        } catch (S3Exception e) {
            log.error("Failed to upload file to S3: {}", e.getMessage());
            throw new RuntimeException("Unable to upload file to S3", e);
        }

        return key;
    }

    @Override
    public byte[] getFile(String key) throws IOException {
        if (key == null || key.isBlank()) {
            throw new IllegalArgumentException("S3 key cannot be null or empty");
        }

        GetObjectRequest request = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        try (var inputStream = s3Client.getObject(request)) {
            log.debug("Retrieved file from S3 with key: {}", key);
            return inputStream.readAllBytes();
        } catch (S3Exception e) {
            log.error("Failed to retrieve file from S3 with key: {}", key, e);
            throw new RuntimeException("Unable to retrieve file from S3", e);
        }
    }

    @Override
    public void deleteFile(String key) {
        if (key == null || key.isBlank()) {
            throw new IllegalArgumentException("S3 key cannot be null or empty");
        }

        DeleteObjectRequest request = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        try {
            s3Client.deleteObject(request);
            log.info("Deleted file from S3 with key: {}", key);
        } catch (S3Exception e) {
            log.error("Failed to delete file from S3 with key: {}", key, e);
            throw new RuntimeException("Unable to delete file from S3", e);
        }
    }
}