package org.exp.primeapp.controller.admin.spotlight;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.models.dto.request.SpotlightReq;
import org.exp.primeapp.models.dto.responce.admin.AdminCategoryDashboardRes;
import org.exp.primeapp.models.dto.responce.admin.spotlight.AdminSpotlightRes;
import org.exp.primeapp.models.dto.responce.admin.spotlight.FullSpotlightRes;
import org.exp.primeapp.models.dto.responce.user.SpotlightRes;
import org.exp.primeapp.service.interfaces.user.CategoryService;
import org.exp.primeapp.service.interfaces.user.SpotlightService;
import org.exp.primeapp.service.interfaces.admin.spotlight.AdminSpotlightService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(API + V1 + ADMIN + SPOTLIGHT)
public class AdminSpotlightController {

    private final SpotlightService spotlightService;
    private final AdminSpotlightService adminSpotlightService;
    private final CategoryService categoryService;

   /* @GetMapping
    public ResponseEntity<List<SpotlightRes>> getSpotlights() {
        List<SpotlightRes> spotlights = spotlightService.getHeroSpotlights();
        return new ResponseEntity<>(spotlights, HttpStatus.ACCEPTED);
    }*/

    @GetMapping("/{spotlightId}")
    public ResponseEntity<FullSpotlightRes> getSpotlightById(@PathVariable Long spotlightId) {
        FullSpotlightRes spotlight = spotlightService.getFullSpotlight(spotlightId);
        return new ResponseEntity<>(spotlight, HttpStatus.ACCEPTED);
    }

    @GetMapping("/{spotlightId}/categories")
    public ResponseEntity<AdminCategoryDashboardRes> getSpotlightCategories(@PathVariable Long spotlightId) {
        AdminCategoryDashboardRes spotlightCategories = categoryService.getAdminSpotlightCategories(spotlightId);
        return new ResponseEntity<>(spotlightCategories, HttpStatus.ACCEPTED);
    }

    @PostMapping
    public ResponseEntity<AdminSpotlightRes> saveSpotlight(@RequestBody SpotlightReq spotlightReq) {
        AdminSpotlightRes spotlightRes = adminSpotlightService.addSpotlight(spotlightReq);
        return new ResponseEntity<>(spotlightRes, HttpStatus.OK);
    }

    @PutMapping("/{spotlightId}")
    public ResponseEntity<AdminSpotlightRes> updateSpotlight(@PathVariable Long spotlightId, @RequestBody SpotlightReq spotlightReq) {
        AdminSpotlightRes spotlightRes = adminSpotlightService.updateSpotlightById(spotlightId, spotlightReq);
        return new ResponseEntity<>(spotlightRes, HttpStatus.OK);
    }

    @PatchMapping("/toggle/{spotlightId}")
    public ResponseEntity<Void> toggleSpotlight(@PathVariable Long spotlightId) {
        adminSpotlightService.toggleSpotlightById(spotlightId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
