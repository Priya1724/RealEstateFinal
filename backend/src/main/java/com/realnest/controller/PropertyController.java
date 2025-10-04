package com.realnest.controller;

import com.realnest.dto.PagedResponse;
import com.realnest.dto.PropertyRequest;
import com.realnest.dto.PropertyResponse;
import com.realnest.dto.PropertySearchCriteria;
import com.realnest.entity.PropertyType;
import com.realnest.security.UserPrincipal;
import com.realnest.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/properties")
@Tag(name = "Properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping
    @Operation(summary = "List approved properties")
    public ResponseEntity<PagedResponse<PropertyResponse>> getApprovedProperties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(propertyService.getApprovedProperties(page, size));
    }

    @GetMapping("/search")
    @Operation(summary = "Search approved properties by filters")
    public ResponseEntity<PagedResponse<PropertyResponse>> searchProperties(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) PropertyType type,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String keywords,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        PropertySearchCriteria criteria = new PropertySearchCriteria();
        criteria.setLocation(location);
        criteria.setType(type);
        criteria.setMinPrice(minPrice);
        criteria.setMaxPrice(maxPrice);
        criteria.setKeywords(keywords);
        return ResponseEntity.ok(propertyService.searchProperties(criteria, page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get property by id")
    public ResponseEntity<PropertyResponse> getProperty(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getProperty(id));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    @Operation(summary = "List properties created by the authenticated user")
    public ResponseEntity<PagedResponse<PropertyResponse>> getMyProperties(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(propertyService.getUserProperties(userPrincipal.getId(), page, size));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Create new property listing")
    public ResponseEntity<PropertyResponse> createProperty(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Parameter(description = "Property payload as JSON string")
            @Valid @RequestPart("property") PropertyRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return ResponseEntity.ok(propertyService.createProperty(userPrincipal.getId(), request, image));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Update property listing")
    public ResponseEntity<PropertyResponse> updateProperty(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id,
            @Valid @RequestPart("property") PropertyRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return ResponseEntity.ok(propertyService.updateProperty(id, userPrincipal.getId(), request, image));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Delete property listing")
    public ResponseEntity<Void> deleteProperty(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        propertyService.deleteProperty(id, userPrincipal.getId());
        return ResponseEntity.noContent().build();
    }
}
