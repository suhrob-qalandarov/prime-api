package org.exp.primeapp.service.interfaces.admin.spotlight;

import org.exp.primeapp.models.dto.request.SpotlightReq;
import org.exp.primeapp.models.dto.responce.admin.spotlight.AdminSpotlightRes;
import org.exp.primeapp.models.dto.responce.admin.spotlight.DashboardSpotlightRes;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public interface AdminSpotlightService {

    AdminSpotlightRes addSpotlight(SpotlightReq spotlightReq);

    AdminSpotlightRes updateSpotlightById(Long spotlightId, SpotlightReq spotlightReq);

    void toggleSpotlightById(Long spotlightId);

    DashboardSpotlightRes getDashboardSpotlightInfo();

    DashboardSpotlightRes updateSpotlightsOrder(Map<Long, Long> spotlightOrderMap);
}
