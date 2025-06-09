package org.exp.primeapp.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.exp.primeapp.service.interfaces.S3Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class S3ServiceImpl implements S3Service {

    @Value("${aws.s3.bucket}")
    private String bucketName;

    private final S3Client s3Client;

    @SneakyThrows
    @Override
    public String uploadAttachment(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        String key = originalFilename + "_" + System.currentTimeMillis();

        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .build();

        try (InputStream inputStream = file.getInputStream()) {
            s3Client.putObject(objectRequest, RequestBody.fromInputStream(inputStream, file.getSize()));
        }
        return key;
    }

    @SneakyThrows
    @Override
    public byte[] getFile(String url) {
        GetObjectRequest request = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(url)
                .build();
        try (ResponseInputStream<GetObjectResponse> inputStream = s3Client.getObject(request)) {
            return inputStream.readAllBytes();
        }
    }
}
