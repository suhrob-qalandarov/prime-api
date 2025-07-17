package org.exp.primeapp.service.impl.admin.spotlight;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.SpotlightReq;
import org.exp.primeapp.models.entities.Attachment;
import org.exp.primeapp.models.entities.Spotlight;
import org.exp.primeapp.repository.SpotlightRepository;
import org.exp.primeapp.service.interfaces.admin.spotlight.AdminSpotlightService;
import org.exp.primeapp.utils.AttachmentUtilService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminSpotlightServiceImpl implements AdminSpotlightService {

    private final SpotlightRepository spotlightRepository;
    private final AttachmentUtilService attachmentUtilService;

    @Transactional
    @Override
    public void addSpotlight(SpotlightReq spotlightReq) {
        Spotlight spotlight = mapToEntity(spotlightReq);
        spotlightRepository.save(spotlight);
    }

    private Spotlight mapToEntity(SpotlightReq spotlightReq) {
        Long imageId = spotlightReq.imageId();
        Attachment attachment = attachmentUtilService.getAttachment(imageId);
        return Spotlight.builder()
                .name(spotlightReq.name())
                .image(attachment)
                .build();
    }
}
