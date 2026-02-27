package com.projedata.myindustry.repository;

import com.projedata.myindustry.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<ProductEntity, UUID> {

    List<ProductEntity> findAllByOrderByPriceDesc();

    Page<ProductEntity> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
