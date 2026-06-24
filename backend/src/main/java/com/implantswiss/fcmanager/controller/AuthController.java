package com.implantswiss.fcmanager.controller;

import com.implantswiss.fcmanager.dto.JwtResponse;
import com.implantswiss.fcmanager.dto.LoginRequest;
import com.implantswiss.fcmanager.entity.User;
import com.implantswiss.fcmanager.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody User user) {
        User created = authService.register(user);
        created.setPassword(null); // Don't return password
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest request) {
        JwtResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<User> me(Principal principal) {
        User user = authService.getUserByUsername(principal.getName());
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }
}