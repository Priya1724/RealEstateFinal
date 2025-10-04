package com.realnest.repository;

import com.realnest.entity.Property;
import com.realnest.entity.PropertyStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {
    Page<Property> findAllByStatus(PropertyStatus status, Pageable pageable);
    Page<Property> findAllByOwnerId(Long ownerId, Pageable pageable);
}
