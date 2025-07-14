package com.example.findy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordTest {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Your database hash
        String dbHash = "$2a$10$C2yrJNfZkarNEG7jUpFAvu9.n4ObF5dM90SJqaMca9xNBvB6O5cua";
        
        // Test different passwords
        String[] testPasswords = {"admin", "password", "123456", "deepak", "DEEPAK"};
        
        System.out.println("Testing password matches:");
        for (String password : testPasswords) {
            boolean matches = encoder.matches(password, dbHash);
            System.out.println("Password '" + password + "' matches: " + matches);
        }
        
        // Generate hash for "admin"
        System.out.println("\nBCrypt hash for 'admin': " + encoder.encode("admin"));
    }
} 