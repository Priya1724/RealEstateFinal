package com.realnest.service.impl;

import com.realnest.dto.PagedResponse;
import com.realnest.dto.PropertyRequest;
import com.realnest.dto.PropertyResponse;
import com.realnest.dto.PropertySearchCriteria;
import com.realnest.dto.UserResponse;
import com.realnest.entity.Property;
import com.realnest.entity.PropertyStatus;
import com.realnest.entity.User;
import com.realnest.exception.ResourceNotFoundException;
import com.realnest.exception.UnauthorizedException;
import com.realnest.repository.PropertyRepository;
import com.realnest.repository.UserRepository;
import com.realnest.service.CloudinaryService;
import com.realnest.service.PropertyService;
import com.realnest.util.PropertySpecifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    public PropertyServiceImpl(PropertyRepository propertyRepository,
                               UserRepository userRepository,
                               CloudinaryService cloudinaryService) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
    }

    @Override
    public PropertyResponse createProperty(Long ownerId, PropertyRequest request, MultipartFile imageFile) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Property property = new Property();
        applyRequest(property, request);
        property.setOwner(owner);
        property.setStatus(PropertyStatus.PENDING);

        String imageUrl = cloudinaryService.uploadImage(imageFile);
        property.setImageUrl(imageUrl);

        Property saved = propertyRepository.save(property);
        return toResponse(saved);
    }

    @Override
    public PropertyResponse updateProperty(Long propertyId, Long ownerId, PropertyRequest request, MultipartFile imageFile) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        if (!property.getOwner().getId().equals(ownerId)) {
            throw new UnauthorizedException("You are not allowed to update this property");
        }

        applyRequest(property, request);
        property.setStatus(PropertyStatus.PENDING);

        String imageUrl = cloudinaryService.uploadImage(imageFile);
        if (imageUrl != null) {
            property.setImageUrl(imageUrl);
        }

        Property updated = propertyRepository.save(property);
        return toResponse(updated);
    }

    @Override
    public void deleteProperty(Long propertyId, Long ownerId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        if (!property.getOwner().getId().equals(ownerId)) {
            throw new UnauthorizedException("You are not allowed to delete this property");
        }

        propertyRepository.delete(property);
    }

    @Override
    @Transactional(readOnly = true)
    public PropertyResponse getProperty(Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        return toResponse(property);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PropertyResponse> getApprovedProperties(int page, int size) {
        Page<Property> propertyPage = propertyRepository.findAllByStatus(PropertyStatus.APPROVED, PageRequest.of(page, size));
        return toPagedResponse(propertyPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PropertyResponse> searchProperties(PropertySearchCriteria criteria, int page, int size) {
        Page<Property> propertyPage = propertyRepository.findAll(PropertySpecifications.withCriteria(criteria), PageRequest.of(page, size));
        return toPagedResponse(propertyPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PropertyResponse> getUserProperties(Long ownerId, int page, int size) {
        Page<Property> propertyPage = propertyRepository.findAllByOwnerId(ownerId, PageRequest.of(page, size));
        return toPagedResponse(propertyPage);
    }

    private void applyRequest(Property property, PropertyRequest request) {
        property.setTitle(request.getTitle());
        property.setDescription(request.getDescription());
        property.setPrice(request.getPrice());
        property.setType(request.getType());
        property.setLocation(request.getLocation());
        property.setContactEmail(request.getContactEmail());
        property.setContactPhone(request.getContactPhone());
    }

    private PropertyResponse toResponse(Property property) {
        PropertyResponse response = new PropertyResponse();
        response.setId(property.getId());
        response.setTitle(property.getTitle());
        response.setDescription(property.getDescription());
        response.setPrice(property.getPrice());
        response.setType(property.getType());
        response.setLocation(property.getLocation());
        response.setImageUrl(property.getImageUrl());
        response.setContactEmail(property.getContactEmail());
        response.setContactPhone(property.getContactPhone());
        response.setStatus(property.getStatus());
        response.setDateListed(property.getDateListed());
        User owner = property.getOwner();
        response.setOwner(new UserResponse(owner.getId(), owner.getName(), owner.getEmail(), owner.getRole()));
        return response;
    }

    private PagedResponse<PropertyResponse> toPagedResponse(Page<Property> page) {
        return new PagedResponse<>(
                page.map(this::toResponse).getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }
}
