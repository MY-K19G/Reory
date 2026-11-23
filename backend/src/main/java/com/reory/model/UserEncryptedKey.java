package com.reory.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_encrypted_keys")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEncryptedKey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String userIdentifier;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String ciphertext;

    @Column(nullable = false)
    private String iv;

    @Column(nullable = false)
    private String salt;

    @Column(columnDefinition = "TEXT")
    private String pexelsCiphertext;

    private String pexelsIv;

    private String pexelsSalt;

    private int version;

    private String preferredModel;

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
