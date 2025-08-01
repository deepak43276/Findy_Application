package com.example.findy.controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import com.example.findy.model.SavedJob;
import com.example.findy.repository.SavedJobRepository;

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

    @PostMapping
    public SavedJob saveJob(@RequestParam Long userId, @RequestParam Long jobId) {
        if (!repo.existsByUserIdAndJobId(userId, jobId)) {
            return repo.save(new SavedJob(userId, jobId));
        }
        return null;
    }

    @DeleteMapping
    public void removeSavedJob(@RequestParam Long userId, @RequestParam Long jobId) {
        repo.deleteByUserIdAndJobId(userId, jobId);
    }
}
