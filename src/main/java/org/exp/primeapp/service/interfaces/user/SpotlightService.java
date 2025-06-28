package org.exp.primeapp.service.interfaces.user;

import org.exp.primeapp.models.dto.responce.CategoryRes;
import org.exp.primeapp.models.dto.responce.SpotlightRes;
import org.exp.primeapp.models.dto.responce.CatalogSpotlightRes;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface SpotlightService {

    SpotlightRes getSpotlight(Long id);

    List<SpotlightRes> getHeroSpotlights();

    List<CatalogSpotlightRes> getCatalogSpotlightsWithCategories();

    List<CategoryRes> getSpotlightCategories(Long spotlightId);
}
