package com.example.findy.controller;

import com.example.findy.model.SavedJob;
import com.example.findy.repository.SavedJobRepository;
import com.example.findy.repository.JobRepository;
import com.example.findy.model.Job;

import org.springframework.web.bind.annotation.*;
import jakarta.transaction.Transactional;

import java.util.List;

@RestController
@RequestMapping("/api/saved-jobs")
@CrossOrigin(origins = "http://localhost:3000")
public class SavedJobController {

    private final SavedJobRepository repo;
    private final JobRepository jobRepository;

    public SavedJobController(SavedJobRepository repo, JobRepository jobRepository) {
        this.repo = repo;
        this.jobRepository = jobRepository;
    }

    // ✅ Get all saved jobs for a user
    @GetMapping("/{userId}")
    public List<SavedJob> getSavedJobs(@PathVariable Long userId) {
        return repo.findByUserId(userId);
    }

    // ✅ Save a job and return updated saved job IDs
    @PostMapping
    @Transactional
    public List<Long> saveJob(@RequestParam Long userId, @RequestParam Long jobId) {
        if (!repo.existsByUserIdAndJobId(userId, jobId)) {
            repo.save(new SavedJob(userId, jobId));
        }
        return repo.findByUserId(userId)
                   .stream()
                   .map(SavedJob::getJobId)
                   .toList();
    }

    // ✅ Remove a job and return updated saved job IDs
    @DeleteMapping
    @Transactional
    public List<Long> removeSavedJob(@RequestParam Long userId, @RequestParam Long jobId) {
        repo.deleteByUserIdAndJobId(userId, jobId);
        return repo.findByUserId(userId)
                   .stream()
                   .map(SavedJob::getJobId)
                   .toList();
    }

    // ✅ New endpoint: Fetch full job details for saved jobs
    @GetMapping("/jobs/by-ids")
    public List<Job> getJobsByIds(@RequestParam List<Long> ids) {
        return jobRepository.findAllById(ids);
    }
}
