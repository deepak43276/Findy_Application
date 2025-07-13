package com.example.findy.repository;

import com.example.findy.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    
    @Query("SELECT j FROM Job j WHERE " +
           "(:search IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(j.company) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(j.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:type IS NULL OR j.type = :type)")
    List<Job> findBySearchAndLocation(@Param("search") String search, 
                                     @Param("location") String location,
                                     @Param("type") String type);
    
    List<Job> findByFeaturedTrue();
    
    List<Job> findByCompany(String company);
    
    List<Job> findByType(String type);
    
    List<Job> findByLocationContainingIgnoreCase(String location);
} 