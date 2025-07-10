package org.exp.primeapp.controller.user;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.UserUpdateReq;
import org.exp.primeapp.models.dto.responce.user.UserRes;
import org.exp.primeapp.models.entities.User;
import org.exp.primeapp.service.interfaces.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(API + V1 + USER)
public class UserController {

    private final UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserRes> getUser(@PathVariable Long userId) {
        UserRes user = userService.getByUserId(userId);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/by-email/{email}")
    public ResponseEntity<UserRes> getUser(@PathVariable String email) {
        UserRes user = userService.getByEmail(email);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserRes> updateUser(@PathVariable Long userId, @RequestBody UserUpdateReq userReq) {
        UserRes user = userService.updateUser(userId, userReq);
        return new ResponseEntity<>(user, HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/{user_id}")
    public ResponseEntity<User> deleteUser(@PathVariable Long user_id) {
        userService.updateUser_Active(user_id);
        return ResponseEntity.noContent().build();
    }
}
