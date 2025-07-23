package org.exp.primeapp.controller.global.auth.bot;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.global.LoginRes;
import org.exp.primeapp.models.entities.Role;
import org.exp.primeapp.models.entities.User;
import org.exp.primeapp.service.interfaces.global.auth.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(API + V1 + AUTH)
public class BotAuthController {

    private final AuthService authService;

    @GetMapping("check-admin-role")
    public ResponseEntity<Boolean> checkUserAdminRole(@AuthenticationPrincipal User user) {
        boolean hasAdminRole = user.getRoles()
                .stream()
                .anyMatch(role -> ROLE_ADMIN.equals(role.getName().trim()));

        return ResponseEntity.ok(hasAdminRole);
    }

    @PostMapping("/code/{code}")
    public ResponseEntity<LoginRes> verifyUserWithCode(@PathVariable Integer code) {
        LoginRes loginRes = authService.verifyWithCodeAndSendUserData(code);
        return new ResponseEntity<>(loginRes, HttpStatus.ACCEPTED);
    }
}
