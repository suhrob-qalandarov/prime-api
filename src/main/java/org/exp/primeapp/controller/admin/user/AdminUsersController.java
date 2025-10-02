/*
package org.exp.primeapp.controller.admin.user;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.admin.AdminUserDashboardRes;
import org.exp.primeapp.service.interfaces.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequestMapping(API + V1 + ADMIN + USERS)
@RequiredArgsConstructor
public class AdminUsersController {
    private final UserService userService;

    @GetMapping(DASHBOARD)
    public ResponseEntity<AdminUserDashboardRes> getAllUsers() {
        AdminUserDashboardRes users = userService.getAdminAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

}
*/
