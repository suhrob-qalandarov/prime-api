package org.exp.primeapp.controller.user;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.user.UserRes;
import org.exp.primeapp.models.entities.User;
import org.exp.primeapp.service.interfaces.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(API + V1 + USER)
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserRes> getUserData(@AuthenticationPrincipal User user) {
        UserRes userRes = userService.getUserData(user);
        return ResponseEntity.ok(userRes);
    }

    @GetMapping("/{telegramId}")
    public ResponseEntity<UserRes> getUser(@PathVariable Long telegramId) {
        UserRes user = userService.getByTelegramId(telegramId);
        return ResponseEntity.ok(user);
    }

    // it's conflicted end-point
    @GetMapping("/by-username/{tgUsername}")
    public ResponseEntity<UserRes> getUser(@PathVariable String tgUsername) {
        UserRes user = userService.getByUsername(tgUsername);
        return ResponseEntity.ok(user);
    }
}
