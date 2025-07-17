package org.exp.primeapp.controller.admin.spotlight;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.models.dto.responce.admin.spotlight.DashboardSpotlightRes;
import org.exp.primeapp.service.interfaces.admin.spotlight.AdminSpotlightService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static org.exp.primeapp.utils.Const.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(API + V1 + ADMIN + SPOTLIGHTS)
public class AdminSpotlightsController {

    private final AdminSpotlightService adminSpotlightService;

    @GetMapping
    public ResponseEntity<DashboardSpotlightRes> getSpotlights() {
        DashboardSpotlightRes dashboardSpotlightRes = adminSpotlightService.getDashboardSpotlightInfo();
        return new ResponseEntity<>(dashboardSpotlightRes, HttpStatus.OK);
    }

    @PatchMapping("/order")
    public ResponseEntity<DashboardSpotlightRes> updateCategoriesOrder(@RequestBody Map<Long, Long> spotlightOrderMap) {
        DashboardSpotlightRes dashboardSpotlightRes = adminSpotlightService.updateSpotlightsOrder(spotlightOrderMap);
        return new ResponseEntity<>(dashboardSpotlightRes, HttpStatus.OK);
    }
}