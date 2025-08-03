package com.example.findy.controller;

import com.example.findy.model.AppliedJob;
import com.example.findy.dto.AppliedJobRequest; // ✅ Fixed package
import com.example.findy.repository.AppliedJobRepository;
import com.example.findy.repository.JobRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/applied-jobs")
@CrossOrigin(origins = "http://localhost:3000") // allow Next.js frontend
public class AppliedJobController {

    @Autowired
    private AppliedJobRepository appliedJobRepository;

    @Autowired
    private JobRepository jobRepository;

    // ✅ POST /api/applied-jobs
    @PostMapping
    public ResponseEntity<?> applyJob(@RequestBody AppliedJobRequest request) {
        Optional<AppliedJob> existing = appliedJobRepository
                .findByUserIdAndJobId(request.getUserId(), request.getJobId());
        if (existing.isPresent()) {
            return ResponseEntity.ok().body(Map.of("message", "Already applied"));
        }

        AppliedJob appliedJob = new AppliedJob();
        appliedJob.setUserId(request.getUserId());
        appliedJob.setJobId(request.getJobId());
        appliedJob.setAppliedAt(LocalDateTime.now());

        appliedJobRepository.save(appliedJob);
        return ResponseEntity.status(HttpStatus.CREATED).body(appliedJob);
    }

    // ✅ GET /api/applied-jobs/{userId}
    @GetMapping("/{userId}")
    public ResponseEntity<?> getAppliedJobs(@PathVariable Long userId) {
        List<AppliedJob> appliedJobs = appliedJobRepository.findByUserId(userId);
        return ResponseEntity.ok(appliedJobs);
    }
}
