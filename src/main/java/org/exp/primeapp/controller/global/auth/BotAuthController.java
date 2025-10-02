package org.exp.primeapp.controller.global.auth;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.global.LoginRes;
import org.exp.primeapp.models.dto.responce.user.UserRes;
import org.exp.primeapp.models.entities.User;
import org.exp.primeapp.service.interfaces.global.auth.AuthService;
import org.exp.primeapp.service.interfaces.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(API + V1 + AUTH)
public class BotAuthController {

    private final AuthService authService;
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserRes> getUserData(@AuthenticationPrincipal User user) {
        UserRes userRes = userService.getUserDataFromToken(user);
        return ResponseEntity.ok(userRes);
    }

    @GetMapping("check-user-permission")
    public ResponseEntity<Boolean> checkUserAdminRole(@AuthenticationPrincipal User user) {
        boolean hasAdminRole = user.getRoles()
                .stream()
                .anyMatch(role -> ROLE_ADMIN.equals(role.getName().trim()));

        return ResponseEntity.ok(hasAdminRole);
    }

    @PostMapping("/code/{code}")
    public ResponseEntity<LoginRes> verifyUserWithCode(@PathVariable Integer code, HttpServletResponse response) {
        LoginRes loginRes = authService.verifyWithCodeAndSendUserData(code, response);
        return new ResponseEntity<>(loginRes, HttpStatus.ACCEPTED);
    }
}
