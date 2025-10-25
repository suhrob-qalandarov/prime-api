package org.exp.primeapp.controller.admin.user;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.admin.AdminUserDashboardRes;
import org.exp.primeapp.models.entities.User;
import org.exp.primeapp.repository.UserRepository;
import org.exp.primeapp.service.face.user.UserService;
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

    @GetMapping("/dashboard")
    public ResponseEntity<AdminUserDashboardRes> getAllUsers() {
        AdminUserDashboardRes users = userService.getAdminAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("{userId}")
    public ResponseEntity<User> getUser(@PathVariable Long userId) {
        User user = userRepository.getById(userId);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/toggle/{userId}")
    public ResponseEntity<?> toggleUser(@PathVariable Long userId) {
        userService.toggleUserUpdate(userId);
        return ResponseEntity.ok().build();
    }
}
