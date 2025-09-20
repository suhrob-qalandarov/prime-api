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

    @GetMapping("/by/{telegramId}")
    public ResponseEntity<UserRes> getUserByTelegramId(@PathVariable Long telegramId) {
        UserRes user = userService.getByTelegramId(telegramId);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/by/{phoneNumber}")
    public ResponseEntity<UserRes> getUserByPhoneNumber(@PathVariable String phoneNumber) {
        UserRes user = userService.getByPhoneNumber(phoneNumber);
        return ResponseEntity.ok(user);
    }

    // it's conflicted end-point
    @GetMapping("/by/{username}")
    public ResponseEntity<UserRes> getUserByUserName(@PathVariable String username) {
        UserRes user = userService.getByUsername(username);
        return ResponseEntity.ok(user);
    }
}
