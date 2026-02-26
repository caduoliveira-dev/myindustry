package com.projedata.myindustry.repository;

import com.projedata.myindustry.entity.ProductRawMaterialEntity;
import com.projedata.myindustry.entity.ProductRawMaterialId;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProductRawMaterialRepository extends JpaRepository<ProductRawMaterialEntity, ProductRawMaterialId> {

    List<ProductRawMaterialEntity> findByIdProductId(UUID productId);

    @Transactional
    void deleteByIdProductIdAndIdRawMaterialId(UUID productId, UUID rawMaterialId);
}
