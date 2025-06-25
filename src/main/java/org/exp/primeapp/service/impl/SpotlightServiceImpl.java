package org.exp.primeapp.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.SpotlightReq;
import org.exp.primeapp.models.dto.responce.SpotlightRes;
import org.exp.primeapp.models.entities.Attachment;
import org.exp.primeapp.models.entities.Spotlight;
import org.exp.primeapp.models.repo.SpotlightRepository;
import org.exp.primeapp.service.interfaces.SpotlightService;
import org.exp.primeapp.utils.AttachmentUtilService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class SpotlightServiceImpl implements SpotlightService {

    private final SpotlightRepository spotlightRepository;
    private final CategoryServiceImpl categoryServiceImpl;
    private final AttachmentUtilService attachmentUtilService;

    @Override
    public SpotlightRes getSpotlight(Long id) {
        Spotlight spotlight = spotlightRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Spotlight not found with id: " + id));

        return mapToResponse(spotlight);
    }


    @Override
    public List<SpotlightRes> getHeroSpotlights() {
        return spotlightRepository.findAll().stream()
                .map(spotlight -> new SpotlightRes(
                        spotlight.getId(),
                        spotlight.getName(),
                        spotlight.getImage().getId()
                )).toList();
    }

    @Override
    public List<CatalogSpotlightRes> getCatalogSpotlightsWithCategories() {
        return spotlightRepository.findAll().stream()
                .map(spotlight -> new CatalogSpotlightRes(
                        spotlight.getId(),
                        spotlight.getName(),
                        spotlight.getCategories().stream()
                                .map(categoryServiceImpl::convertToCategoryRes).toList()
                )).toList();
    }

    @Override
    //@Transactional
    public void addSpotlight(SpotlightReq spotlightReq) {
        Spotlight spotlight = mapToEntity(spotlightReq);
        spotlightRepository.save(spotlight);
    }

    private SpotlightRes mapToResponse(Spotlight spotlight) {
        return SpotlightRes.builder()
                .id(spotlight.getId())
                .name(spotlight.getName())
                .imageId(spotlight.getImage().getId())
                .build();
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
