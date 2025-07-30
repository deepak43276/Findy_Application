package com.example.findy.controller;

import com.example.findy.model.Job;
import com.example.findy.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired
    private JobRepository jobRepository;

    @GetMapping
    public ResponseEntity<List<Job>> getJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String experienceLevel) {

        List<Job> jobs;
        if (search != null || location != null || type != null || experienceLevel != null) {
            jobs = jobRepository.findBySearchAndLocationAndExperience(search, location, type, experienceLevel);
        } else {
            jobs = jobRepository.findAll();
        }

        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Job>> getFeaturedJobs() {
        List<Job> featuredJobs = jobRepository.findByFeaturedTrue();
        return ResponseEntity.ok(featuredJobs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return jobRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Job> createJob(@Valid @RequestBody Job job) {
        // Auto-set postedAt if missing
        if (job.getPostedAt() == null) {
            job.setPostedAt(LocalDateTime.now());
        }
        // Default acceptApplications true if not set
        if (!job.isAcceptApplications()) {
            job.setAcceptApplications(true);
        }

        Job savedJob = jobRepository.save(job);
        return ResponseEntity.ok(savedJob);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @Valid @RequestBody Job job) {
        return jobRepository.findById(id)
                .map(existingJob -> {
                    job.setId(id);

                    // Preserve postedAt if missing in update request
                    if (job.getPostedAt() == null) {
                        job.setPostedAt(existingJob.getPostedAt());
                    }

                    Job updatedJob = jobRepository.save(job);
                    return ResponseEntity.ok(updatedJob);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        return jobRepository.findById(id)
                .map(job -> {
                    jobRepository.delete(job);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
