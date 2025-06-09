package org.exp.primeapp.controller;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.dto.request.UserReq;
import org.exp.primeapp.dto.request.UserUpdateReq;
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

    @PostMapping
    public ResponseEntity<User> addUser(@RequestBody UserReq userReq) {
        User user=userService.createUser(userReq);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<List<User>> getUsers() {
        List<User> users=userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{user_id}")
    public ResponseEntity<User> getUser(@PathVariable Long user_id) {
        User user=userService.getByUserId(user_id);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/{user_id}")
    public ResponseEntity<User> updateUser(@PathVariable Long user_id,@RequestBody UserUpdateReq userReq) {
        User user=userService.updateUser(user_id,userReq);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{user_id}")
    public ResponseEntity<User> deleteUser(@PathVariable Long user_id) {
        userService.updateUser_Active(user_id);
        return ResponseEntity.noContent().build();
    }
}
