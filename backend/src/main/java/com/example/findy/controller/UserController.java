package com.example.findy.controller;

import com.example.findy.model.User;
import com.example.findy.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ Get all users (Admin/testing only)
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // ✅ Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Get current logged-in user using JWT
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(403).build();
        }

        String email;
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails springUser) {
            email = springUser.getUsername(); // username = email
        } else if (principal instanceof String s) {
            email = s;
        } else {
            return ResponseEntity.status(401).build();
        }

        return userRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Register a new user
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@Valid @RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().build();
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return ResponseEntity.ok(userRepository.save(user));
    }

    // ✅ Update logged-in user's profile
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id,
                                           @Valid @RequestBody User user,
                                           Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(401).build();
        }

        String loggedInEmail;
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails springUser) {
            loggedInEmail = springUser.getUsername();
        } else if (principal instanceof String s) {
            loggedInEmail = s;
        } else {
            return ResponseEntity.status(401).build();
        }

        // ✅ Ensure the logged-in user is updating their own profile
        if (!loggedInEmail.equalsIgnoreCase(user.getEmail())) {
            return ResponseEntity.status(403).build();
        }

        return userRepository.findById(id)
                .map(existingUser -> {
                    user.setId(id);

                    // Keep old password if none is provided
                    if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                        user.setPassword(passwordEncoder.encode(user.getPassword()));
                    } else {
                        user.setPassword(existingUser.getPassword());
                    }

                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Delete user (self-deletion)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id, Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(401).<Void>build(); // Explicit <Void>
        }

        String loggedInEmail = (authentication.getPrincipal() instanceof UserDetails springUser)
                ? springUser.getUsername()
                : authentication.getName();

        return userRepository.findById(id)
                .map(user -> {
                    // Only allow user to delete their own account
                    if (!user.getEmail().equalsIgnoreCase(loggedInEmail)) {
                        return ResponseEntity.status(403).<Void>build(); // Explicit <Void>
                    }

                    userRepository.delete(user);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().<Void>build()); // Explicit <Void>
    }
}
