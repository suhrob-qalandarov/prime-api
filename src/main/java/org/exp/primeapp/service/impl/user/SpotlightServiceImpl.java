package org.exp.primeapp.service.impl.user;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.user.CatalogSpotlightRes;
import org.exp.primeapp.models.dto.responce.user.CategoryRes;
import org.exp.primeapp.models.dto.responce.user.SpotlightRes;
import org.exp.primeapp.models.entities.Spotlight;
import org.exp.primeapp.repository.SpotlightRepository;
import org.exp.primeapp.service.interfaces.user.SpotlightService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class SpotlightServiceImpl implements SpotlightService {

    private final SpotlightRepository spotlightRepository;
    private final CategoryServiceImpl categoryServiceImpl;

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
                        spotlight.getImage().getKey()
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
    public List<CategoryRes> getSpotlightCategories(Long spotlightId) {
        return categoryServiceImpl.getSpotlightCategories(spotlightId);
    }


    private SpotlightRes mapToResponse(Spotlight spotlight) {
        return SpotlightRes.builder()
                .id(spotlight.getId())
                .name(spotlight.getName())
                .imageKey(spotlight.getImage().getKey())
                .build();
    }
}
