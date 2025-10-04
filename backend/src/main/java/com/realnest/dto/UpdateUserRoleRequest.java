package com.realnest.dto;

import com.realnest.entity.Role;
import jakarta.validation.constraints.NotNull;

public class UpdateUserRoleRequest {

    @NotNull
    private Role role;

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
