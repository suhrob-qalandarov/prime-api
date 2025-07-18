package org.exp.primeapp.service.impl.admin.spotlight;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.SpotlightReq;
import org.exp.primeapp.models.dto.responce.admin.spotlight.AdminSpotlightRes;
import org.exp.primeapp.models.dto.responce.admin.spotlight.DashboardSpotlightRes;
import org.exp.primeapp.models.entities.Attachment;
import org.exp.primeapp.models.entities.Spotlight;
import org.exp.primeapp.repository.SpotlightRepository;
import org.exp.primeapp.service.interfaces.admin.spotlight.AdminSpotlightService;
import org.exp.primeapp.utils.AttachmentUtilService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminSpotlightServiceImpl implements AdminSpotlightService {

    private final SpotlightRepository spotlightRepository;
    private final AttachmentUtilService attachmentUtilService;

    @Transactional
    @Override
    public AdminSpotlightRes addSpotlight(SpotlightReq spotlightReq) {
        Spotlight spotlight = mapToEntity(spotlightReq);
        Spotlight saved = spotlightRepository.save(spotlight);
        return mapToAdminSpotlightRes(saved);
    }

    @Transactional
    @Override
    public DashboardSpotlightRes getDashboardSpotlightInfo() {
        List<AdminSpotlightRes> spotlightResList = spotlightRepository.findAllByOrderByOrderNumberAsc().stream()
                .map(this::mapToAdminSpotlightRes)
                .toList();
        List<AdminSpotlightRes> activeSpotlightResList = spotlightRepository.findAllByActiveTrueOrderByOrderNumberAsc().stream()
                .map(this::mapToAdminSpotlightRes)
                .toList();
        List<AdminSpotlightRes> inactiveSpotlightResList = spotlightRepository.findAllByActiveFalseOrderByOrderNumberAsc().stream()
                .map(this::mapToAdminSpotlightRes)
                .toList();

        return DashboardSpotlightRes.builder()
                .count(spotlightResList.size())
                .activeCount(activeSpotlightResList.size())
                .inactiveCount(inactiveSpotlightResList.size())
                .spotlightResList(spotlightResList)
                .activeSpotlightResList(activeSpotlightResList)
                .inactiveSpotlightResList(inactiveSpotlightResList)
                .build();
    }

    @Transactional
    @Override
    public AdminSpotlightRes updateSpotlightById(Long spotlightId, SpotlightReq spotlightReq) {
        Spotlight spotlight = spotlightRepository.findById(spotlightId).orElseThrow();

        if (!spotlightReq.name().isBlank()) {
            spotlight.setName(spotlightReq.name());
        }

        if (spotlightReq.imageId() != null) {
            Attachment attachment = attachmentUtilService.getAttachment(spotlightReq.imageId());
            spotlight.setImage(attachment);
        }
        Spotlight saved = spotlightRepository.save(spotlight);
        return mapToAdminSpotlightRes(saved);
    }

    @Override
    public void toggleSpotlightById(Long spotlightId) {
        spotlightRepository.toggleSpotlightActiveStatus(spotlightId);
    }

    @Transactional
    @Override
    public DashboardSpotlightRes updateSpotlightsOrder(Map<Long, Long> spotlightOrderMap) {
        List<Spotlight> spotlights = spotlightRepository.findAllById(spotlightOrderMap.keySet());

        for (Spotlight spotlight : spotlights) {
            Long newOrder = spotlightOrderMap.get(spotlight.getId());
            spotlight.setOrderNumber(newOrder);
        }
        spotlightRepository.saveAll(spotlights);
        return getDashboardSpotlightInfo();
    }

    private Spotlight mapToEntity(SpotlightReq spotlightReq) {
        Long imageId = spotlightReq.imageId();
        Attachment attachment = attachmentUtilService.getAttachment(imageId);
        return Spotlight.builder()
                .name(spotlightReq.name())
                .image(attachment)
                .build();
    }

    private AdminSpotlightRes mapToAdminSpotlightRes(Spotlight spotlight) {
        return AdminSpotlightRes.builder()
                .id(spotlight.getId())
                .name(spotlight.getName())
                .orderNumber(spotlight.getOrderNumber())
                .active(spotlight.getActive())
                .categoriesCount((long) spotlight.getCategories().size())
                .build();
    }
}
