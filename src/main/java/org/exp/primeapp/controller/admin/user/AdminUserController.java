package org.exp.primeapp.controller.admin.user;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.UserUpdateReq;
import org.exp.primeapp.models.dto.responce.global.ApiResponse;
import org.exp.primeapp.models.entities.User;
import org.exp.primeapp.repository.UserRepository;
import org.exp.primeapp.service.interfaces.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequestMapping(API + V1 + ADMIN + USER)
@RequiredArgsConstructor
public class AdminUserController {
    private final UserRepository userRepository;
    private final UserService userService;

    @GetMapping("{userId}")
    public ResponseEntity<User> getUser(@PathVariable Long userId) {
        User user = userRepository.getById(userId);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/toogle/{userId}")
    public ResponseEntity<?> toggleUser(@PathVariable Long userId) {
        userService.toogleUserUpdate(userId);
        return ResponseEntity.ok().build();
    }
}
