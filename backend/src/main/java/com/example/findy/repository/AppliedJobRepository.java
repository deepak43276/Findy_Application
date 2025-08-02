package com.example.findy.repository;

import com.example.findy.model.AppliedJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppliedJobRepository extends JpaRepository<AppliedJob, Long> {
    List<AppliedJob> findByUserId(Long userId);
    Optional<AppliedJob> findByUserIdAndJobId(Long userId, Long jobId);
}
