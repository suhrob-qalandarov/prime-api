package org.exp.primeapp.controller;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.UserReq;
import org.exp.primeapp.models.dto.request.UserUpdateReq;
import org.exp.primeapp.models.dto.responce.UserRes;
import org.exp.primeapp.models.entities.User;
import org.exp.primeapp.service.interfaces.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping()
    public ResponseEntity<UserRes> addUser(@RequestBody UserReq userReq) {
        UserRes user=userService.createUser(userReq);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/admin")
    public ResponseEntity<List<UserRes>> getUsers() {
        List<UserRes> users=userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/admin/{user_id}")
    public ResponseEntity<UserRes> getUser(@PathVariable Long user_id) {
        UserRes user=userService.getByUserId(user_id);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/{user_id}")
    public ResponseEntity<UserRes> updateUser(@PathVariable Long user_id,@RequestBody UserUpdateReq userReq) {
        UserRes user=userService.updateUser(user_id,userReq);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{user_id}")
    public ResponseEntity<User> deleteUser(@PathVariable Long user_id) {
        userService.updateUser_Active(user_id);
        return ResponseEntity.noContent().build();
    }
}
