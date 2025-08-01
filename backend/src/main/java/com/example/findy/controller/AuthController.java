package com.example.findy.controller;

import com.example.findy.JwtUtil;
import com.example.findy.model.User;
import com.example.findy.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        logger.debug("Login attempt for email: {}", email);

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            logger.debug("No user found for email: {}", email);
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        User user = userOpt.get();
        logger.debug("Stored hash for user: {}", user.getPassword());

        boolean matches = passwordEncoder.matches(password, user.getPassword());
        logger.debug("Password match result: {}", matches);

        if (!matches) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        // ✅ Fetch user roles safely
        List<String> roles = user.getRoles() != null ? user.getRoles() : Collections.emptyList();

        // ✅ Generate JWT with user ID, email, and roles
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), roles);

        // ✅ Hide password in the response
        user.setPassword(null);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);

        return ResponseEntity.ok(response);
    }
}
