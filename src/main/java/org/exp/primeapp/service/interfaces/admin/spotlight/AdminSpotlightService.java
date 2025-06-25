package org.exp.primeapp.service.interfaces.admin.spotlight;

import org.exp.primeapp.models.dto.request.SpotlightReq;
import org.jvnet.hk2.annotations.Service;

@Service
public interface AdminSpotlightService {

    void addSpotlight(SpotlightReq spotlightReq);
}
