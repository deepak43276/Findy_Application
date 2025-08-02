package com.example.findy.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

import com.example.findy.model.SavedJob;
import com.example.findy.repository.SavedJobRepository;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/saved-jobs")
@CrossOrigin(origins = "http://localhost:3000")
public class SavedJobController {

    private final SavedJobRepository repo;

    public SavedJobController(SavedJobRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/{userId}")
    public List<SavedJob> getSavedJobs(@PathVariable Long userId) {
        return repo.findByUserId(userId);
    }

    // ✅ Save job and return updated job IDs
    @PostMapping
    public List<Long> saveJob(@RequestParam Long userId, @RequestParam Long jobId) {
        if (!repo.existsByUserIdAndJobId(userId, jobId)) {
            repo.save(new SavedJob(userId, jobId));
        }
        return getJobIds(userId);
    }

    // ✅ Delete saved job and return updated job IDs
    @Transactional
    @DeleteMapping

    public List<Long> removeSavedJob(@RequestParam Long userId, @RequestParam Long jobId) {
        if (repo.existsByUserIdAndJobId(userId, jobId)) {
            repo.deleteByUserIdAndJobId(userId, jobId);
        }
        return getJobIds(userId); // Always return 200 with updated job IDs
    }

    // ✅ Helper to get all saved job IDs for a user
    private List<Long> getJobIds(Long userId) {
        return repo.findByUserId(userId)
                   .stream()
                   .map(SavedJob::getJobId)
                   .collect(Collectors.toList());
    }
}
