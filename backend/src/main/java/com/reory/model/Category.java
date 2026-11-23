package com.reory.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "categories", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_identifier", "name"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    @Builder.Default
    private String icon = "bi-tag";

    @Column(name = "user_identifier", nullable = false)
    @Builder.Default
    private String userIdentifier = "default_user";

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
