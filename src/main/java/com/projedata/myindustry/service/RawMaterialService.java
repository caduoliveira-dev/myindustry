package com.projedata.myindustry.service;

import com.projedata.myindustry.dto.RawMaterialRequest;
import com.projedata.myindustry.entity.RawMaterialEntity;
import com.projedata.myindustry.repository.RawMaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RawMaterialService {

    private final RawMaterialRepository repository;

    public RawMaterialEntity create(RawMaterialRequest request) {
        RawMaterialEntity entity = new RawMaterialEntity();
        entity.setName(request.name());
        entity.setStockQuantity(request.stockQuantity());
        return repository.save(entity);
    }

    public RawMaterialEntity findById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Raw material not found"));
    }

    public Page<RawMaterialEntity> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public RawMaterialEntity update(UUID id, RawMaterialRequest request) {
        RawMaterialEntity entity = findById(id);
        entity.setName(request.name());
        entity.setStockQuantity(request.stockQuantity());
        return repository.save(entity);
    }

    public void delete(UUID id) {
        findById(id);
        repository.deleteById(id);
    }
}
