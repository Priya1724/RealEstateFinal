package com.realnest.util;

import com.realnest.dto.PropertySearchCriteria;
import com.realnest.entity.Property;
import com.realnest.entity.PropertyStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class PropertySpecifications {

    private PropertySpecifications() {
    }

    public static Specification<Property> withCriteria(PropertySearchCriteria criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("status"), PropertyStatus.APPROVED));

            if (criteria.getLocation() != null && !criteria.getLocation().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("location")), "%" + criteria.getLocation().toLowerCase() + "%"));
            }

            if (criteria.getType() != null) {
                predicates.add(cb.equal(root.get("type"), criteria.getType()));
            }

            if (criteria.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), criteria.getMinPrice()));
            }

            if (criteria.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), criteria.getMaxPrice()));
            }

            if (criteria.getKeywords() != null && !criteria.getKeywords().isBlank()) {
                String lowerKeyword = "%" + criteria.getKeywords().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), lowerKeyword),
                        cb.like(cb.lower(root.get("description")), lowerKeyword)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
