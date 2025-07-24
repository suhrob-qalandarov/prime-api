package org.exp.primeapp.service.impl.user;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.admin.spotlight.FullSpotlightRes;
import org.exp.primeapp.models.dto.responce.admin.spotlight.SimpleSpotlightRes;
import org.exp.primeapp.models.dto.responce.user.CatalogSpotlightRes;
import org.exp.primeapp.models.dto.responce.user.CategoryRes;
import org.exp.primeapp.models.dto.responce.user.SpotlightRes;
import org.exp.primeapp.models.entities.Category;
import org.exp.primeapp.models.entities.Spotlight;
import org.exp.primeapp.repository.SpotlightRepository;
import org.exp.primeapp.service.interfaces.user.SpotlightService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                .orElseThrow(() -> new NoSuchElementException("Spotlight not found with spotlightId: " + id));

        return mapToResponse(spotlight);
    }

    @Transactional
    @Override
    public FullSpotlightRes getFullSpotlight(Long spotlightId) {
        Spotlight spotlight = spotlightRepository.findById(spotlightId)
                .orElseThrow(() -> new NoSuchElementException("Spotlight not found with spotlightId: " + spotlightId));
        return mapToSpotlightFullSpotlightRes(spotlight);
    }

    @Override
    public List<SpotlightRes> getHeroSpotlights() {
        return spotlightRepository.findAllByActiveTrueOrderByOrderNumberAsc().stream()
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

    @Override
    public List<SimpleSpotlightRes> getSpotlightsForCategory() {
        return spotlightRepository.findAllByOrderByOrderNumberAsc().stream()
                .map(this::mapToSimpleSpotlightRes)
                .toList();
    }

    private SpotlightRes mapToResponse(Spotlight spotlight) {
        return SpotlightRes.builder()
                .id(spotlight.getId())
                .name(spotlight.getName())
                .imageKey(spotlight.getImage().getKey())
                .build();
    }

    public SimpleSpotlightRes mapToSimpleSpotlightRes(Spotlight spotlight) {
        return SimpleSpotlightRes.builder()
                .id(spotlight.getId())
                .name(spotlight.getName())
                .build();
    }

    @Transactional
    public FullSpotlightRes mapToSpotlightFullSpotlightRes(Spotlight spotlight) {
        return FullSpotlightRes.builder()
                .id(spotlight.getId())
                .name(spotlight.getName())
                .orderNumber(spotlight.getOrderNumber())
                .imageKey(spotlight.getImage().getKey())
                .categoriesName(spotlight.getCategories().stream()
                        .map(Category::getName)
                        .toList())
                .build();
    }
}
