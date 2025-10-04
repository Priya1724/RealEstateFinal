package com.realnest.service.impl;

import com.realnest.dto.PagedResponse;
import com.realnest.dto.PropertyResponse;
import com.realnest.dto.UserResponse;
import com.realnest.entity.Property;
import com.realnest.entity.PropertyStatus;
import com.realnest.entity.Role;
import com.realnest.entity.User;
import com.realnest.exception.ResourceNotFoundException;
import com.realnest.repository.PropertyRepository;
import com.realnest.repository.UserRepository;
import com.realnest.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public AdminServiceImpl(PropertyRepository propertyRepository, UserRepository userRepository) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PropertyResponse> getPendingProperties(int page, int size) {
        Page<Property> propertyPage = propertyRepository.findAllByStatus(PropertyStatus.PENDING, PageRequest.of(page, size));
        return new PagedResponse<>(
                propertyPage.map(this::toPropertyResponse).getContent(),
                propertyPage.getNumber(),
                propertyPage.getSize(),
                propertyPage.getTotalElements(),
                propertyPage.getTotalPages(),
                propertyPage.isLast()
        );
    }

    @Override
    public PropertyResponse approveProperty(Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        property.setStatus(PropertyStatus.APPROVED);
        return toPropertyResponse(propertyRepository.save(property));
    }

    @Override
    public PropertyResponse rejectProperty(Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        property.setStatus(PropertyStatus.REJECTED);
        return toPropertyResponse(propertyRepository.save(property));
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<UserResponse> getUsers(int page, int size) {
        Page<User> userPage = userRepository.findAll(PageRequest.of(page, size));
        return new PagedResponse<>(
                userPage.map(this::toUserResponse).getContent(),
                userPage.getNumber(),
                userPage.getSize(),
                userPage.getTotalElements(),
                userPage.getTotalPages(),
                userPage.isLast()
        );
    }

    @Override
    public UserResponse updateUserRole(Long userId, Role role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setRole(role);
        return toUserResponse(userRepository.save(user));
    }

    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        userRepository.delete(user);
    }

    private PropertyResponse toPropertyResponse(Property property) {
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

    private UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
