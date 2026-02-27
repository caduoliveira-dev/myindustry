package com.projedata.myindustry.repository;

import com.projedata.myindustry.entity.RawMaterialEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RawMaterialRepository extends JpaRepository<RawMaterialEntity, UUID> {

    Page<RawMaterialEntity> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
