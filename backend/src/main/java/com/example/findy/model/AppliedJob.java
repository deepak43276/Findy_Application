package com.example.findy.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applied_jobs")
public class AppliedJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long jobId;

    private LocalDateTime appliedAt;

    // ✅ Constructors
    public AppliedJob() {}

    public AppliedJob(Long userId, Long jobId, LocalDateTime appliedAt) {
        this.userId = userId;
        this.jobId = jobId;
        this.appliedAt = appliedAt;
    }

    // ✅ Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
}
