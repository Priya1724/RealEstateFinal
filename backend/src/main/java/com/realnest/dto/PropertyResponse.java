package com.realnest.dto;

import com.realnest.entity.PropertyStatus;
import com.realnest.entity.PropertyType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PropertyResponse {

    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private PropertyType type;
    private String location;
    private String imageUrl;
    private String contactEmail;
    private String contactPhone;
    private PropertyStatus status;
    private LocalDateTime dateListed;
    private UserResponse owner;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public PropertyType getType() {
        return type;
    }

    public void setType(PropertyType type) {
        this.type = type;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public PropertyStatus getStatus() {
        return status;
    }

    public void setStatus(PropertyStatus status) {
        this.status = status;
    }

    public LocalDateTime getDateListed() {
        return dateListed;
    }

    public void setDateListed(LocalDateTime dateListed) {
        this.dateListed = dateListed;
    }

    public UserResponse getOwner() {
        return owner;
    }

    public void setOwner(UserResponse owner) {
        this.owner = owner;
    }
}
