package org.exp.primeapp.controller.admin.user;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.UserUpdateReq;
import org.exp.primeapp.models.dto.responce.ApiResponse;
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

    @GetMapping("{user_id}")
    public ResponseEntity<User> getUser(@PathVariable long user_id) {
        User user = userRepository.getById(user_id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{user_id}")
    public ResponseEntity<ApiResponse> updateUser(@PathVariable Long user_id, @RequestBody UserUpdateReq userReq) {
        ApiResponse apiResponse = userService.updateUser(user_id, userReq);
        return new ResponseEntity<>(apiResponse, HttpStatus.ACCEPTED);
    }

    @PutMapping("/activate/{user_id}")
    public ResponseEntity<ApiResponse> activateUser(@PathVariable Long user_id) {
        ApiResponse apiResponse = userService.activateUser(user_id);
        return new ResponseEntity<>(apiResponse, HttpStatus.ACCEPTED);
    }

    @PutMapping("/deactivate/{user_id}")
    public ResponseEntity<ApiResponse> deactivateUser(@PathVariable Long user_id) {
        ApiResponse apiResponse = userService.deactivateUser(user_id);
        return new ResponseEntity<>(apiResponse, HttpStatus.ACCEPTED);
    }


}
