package com.realnest.service;

import com.realnest.dto.PagedResponse;
import com.realnest.dto.PropertyRequest;
import com.realnest.dto.PropertyResponse;
import com.realnest.dto.PropertySearchCriteria;
import org.springframework.web.multipart.MultipartFile;

public interface PropertyService {
    PropertyResponse createProperty(Long ownerId, PropertyRequest request, MultipartFile imageFile);
    PropertyResponse updateProperty(Long propertyId, Long ownerId, PropertyRequest request, MultipartFile imageFile);
    void deleteProperty(Long propertyId, Long ownerId);
    PropertyResponse getProperty(Long propertyId);
    PagedResponse<PropertyResponse> getApprovedProperties(int page, int size);
    PagedResponse<PropertyResponse> searchProperties(PropertySearchCriteria criteria, int page, int size);
    PagedResponse<PropertyResponse> getUserProperties(Long ownerId, int page, int size);
}
