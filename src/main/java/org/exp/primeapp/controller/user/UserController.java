package org.exp.primeapp.controller.user;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.UserReq;
import org.exp.primeapp.models.dto.responce.user.UserRes;
import org.exp.primeapp.models.entities.User;
import org.exp.primeapp.service.interfaces.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(API + V1 + USER)
public class UserController {

    private final UserService userService;

    @GetMapping("/{user_id}")
    public ResponseEntity<UserRes> getUser(@PathVariable Long user_id) {
        UserRes user = userService.getByUserId(user_id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{email}")
    public ResponseEntity<UserRes> getUser(@PathVariable String email) {
        UserRes user = userService.getByEmail(email);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{user_id}")
    public ResponseEntity<User> deleteUser(@PathVariable Long user_id) {
        userService.updateUser_Active(user_id);
        return ResponseEntity.noContent().build();
    }
}
