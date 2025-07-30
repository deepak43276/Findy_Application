package com.example.findy.controller;

import com.example.findy.model.Candidate;
import com.example.findy.repository.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
@CrossOrigin(origins = "*")
public class CandidateController {

    @Autowired
    private CandidateRepository candidateRepository;

    @GetMapping
    public ResponseEntity<List<Candidate>> getCandidates() {
        return ResponseEntity.ok(candidateRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Candidate> createCandidate(@RequestBody Candidate candidate) {
        Candidate saved = candidateRepository.save(candidate);
        return ResponseEntity.ok(saved);
    }

    // Add update, delete, and get by id as needed
} 