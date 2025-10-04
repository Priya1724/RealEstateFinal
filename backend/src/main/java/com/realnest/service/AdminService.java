package com.realnest.service;

import com.realnest.dto.PagedResponse;
import com.realnest.dto.PropertyResponse;
import com.realnest.dto.UserResponse;
import com.realnest.entity.Role;

public interface AdminService {
    PagedResponse<PropertyResponse> getPendingProperties(int page, int size);
    PropertyResponse approveProperty(Long propertyId);
    PropertyResponse rejectProperty(Long propertyId);
    PagedResponse<UserResponse> getUsers(int page, int size);
    UserResponse updateUserRole(Long userId, Role role);
    void deleteUser(Long userId);
}
