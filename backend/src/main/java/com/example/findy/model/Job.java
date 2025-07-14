package com.example.findy.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "jobs")
public class Job {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    private String title;
    
    @NotBlank
    private String company;
    
    @NotBlank
    private String location;
    
    @NotBlank
    private String type;
    
    private String salary;
    
    private String description;
    
    private String requirements;
    
    private String benefits;
    
    @ElementCollection
    @CollectionTable(name = "job_skills", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "skill")
    private List<String> skills;
    
    @NotNull
    private LocalDateTime postedAt;
    
    private boolean featured;
    
    private boolean urgent;
    
    private boolean remote;
    
    private String applicationEmail;
    
    private LocalDateTime applicationDeadline;
    
    private boolean acceptApplications = true;

    @Column(name = "experience_level")
    private String experienceLevel;
    
    // Constructors
    public Job() {}
    
    public Job(String title, String company, String location, String type) {
        this.title = title;
        this.company = company;
        this.location = location;
        this.type = type;
        this.postedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getCompany() {
        return company;
    }
    
    public void setCompany(String company) {
        this.company = company;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getSalary() {
        return salary;
    }
    
    public void setSalary(String salary) {
        this.salary = salary;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getRequirements() {
        return requirements;
    }
    
    public void setRequirements(String requirements) {
        this.requirements = requirements;
    }
    
    public String getBenefits() {
        return benefits;
    }
    
    public void setBenefits(String benefits) {
        this.benefits = benefits;
    }
    
    public List<String> getSkills() {
        return skills;
    }
    
    public void setSkills(List<String> skills) {
        this.skills = skills;
    }
    
    public LocalDateTime getPostedAt() {
        return postedAt;
    }
    
    public void setPostedAt(LocalDateTime postedAt) {
        this.postedAt = postedAt;
    }
    
    public boolean isFeatured() {
        return featured;
    }
    
    public void setFeatured(boolean featured) {
        this.featured = featured;
    }
    
    public boolean isUrgent() {
        return urgent;
    }
    
    public void setUrgent(boolean urgent) {
        this.urgent = urgent;
    }
    
    public boolean isRemote() {
        return remote;
    }
    
    public void setRemote(boolean remote) {
        this.remote = remote;
    }
    
    public String getApplicationEmail() {
        return applicationEmail;
    }
    
    public void setApplicationEmail(String applicationEmail) {
        this.applicationEmail = applicationEmail;
    }
    
    public LocalDateTime getApplicationDeadline() {
        return applicationDeadline;
    }
    
    public void setApplicationDeadline(LocalDateTime applicationDeadline) {
        this.applicationDeadline = applicationDeadline;
    }
    
    public boolean isAcceptApplications() {
        return acceptApplications;
    }
    
    public void setAcceptApplications(boolean acceptApplications) {
        this.acceptApplications = acceptApplications;
    }

    public String getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }
} 