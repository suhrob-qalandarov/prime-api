package org.exp.primeapp.service.interfaces;

import org.exp.primeapp.models.dto.request.SpotlightReq;
import org.exp.primeapp.models.dto.responce.SpotlightRes;
import org.exp.primeapp.service.impl.CatalogSpotlightRes;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface SpotlightService {

    SpotlightRes getSpotlight(Long id);

    List<SpotlightRes> getHeroSpotlights();

    List<CatalogSpotlightRes> getCatalogSpotlightsWithCategories();

    void addSpotlight(SpotlightReq spotlightReq);
}
