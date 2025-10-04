package com.realnest.controller;

import com.realnest.dto.PagedResponse;
import com.realnest.dto.PropertyResponse;
import com.realnest.dto.UpdateUserRoleRequest;
import com.realnest.dto.UserResponse;
import com.realnest.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/properties/pending")
    @Operation(summary = "List pending properties awaiting approval")
    public ResponseEntity<PagedResponse<PropertyResponse>> getPendingProperties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(adminService.getPendingProperties(page, size));
    }

    @PostMapping("/properties/{id}/approve")
    @Operation(summary = "Approve property listing")
    public ResponseEntity<PropertyResponse> approveProperty(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approveProperty(id));
    }

    @PostMapping("/properties/{id}/reject")
    @Operation(summary = "Reject property listing")
    public ResponseEntity<PropertyResponse> rejectProperty(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.rejectProperty(id));
    }

    @GetMapping("/users")
    @Operation(summary = "List registered users")
    public ResponseEntity<PagedResponse<UserResponse>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.getUsers(page, size));
    }

    @PutMapping("/users/{id}/role")
    @Operation(summary = "Update user role")
    public ResponseEntity<UserResponse> updateRole(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRoleRequest request) {
        return ResponseEntity.ok(adminService.updateUserRole(id, request.getRole()));
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete a user")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
