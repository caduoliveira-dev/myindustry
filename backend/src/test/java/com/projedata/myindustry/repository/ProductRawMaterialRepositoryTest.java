package com.projedata.myindustry.repository;

import com.projedata.myindustry.entity.ProductEntity;
import com.projedata.myindustry.entity.ProductRawMaterialEntity;
import com.projedata.myindustry.entity.ProductRawMaterialId;
import com.projedata.myindustry.entity.RawMaterialEntity;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class ProductRawMaterialRepositoryTest {

    @Autowired
    EntityManager entityManager;

    @Autowired
    ProductRawMaterialRepository productRawMaterialRepository;

    private ProductEntity product;
    private RawMaterialEntity rawMaterial1;
    private RawMaterialEntity rawMaterial2;

    @BeforeEach
    void setUp() {
        product      = new ProductEntity(null, "Engrenagem", 3000);
        rawMaterial1 = new RawMaterialEntity(null, "Aço", 100);
        rawMaterial2 = new RawMaterialEntity(null, "Alumínio", 50);

        entityManager.persist(product);
        entityManager.persist(rawMaterial1);
        entityManager.persist(rawMaterial2);
        entityManager.flush();

        ProductRawMaterialId id1 = new ProductRawMaterialId(product.getId(), rawMaterial1.getId());
        ProductRawMaterialId id2 = new ProductRawMaterialId(product.getId(), rawMaterial2.getId());

        entityManager.persist(new ProductRawMaterialEntity(id1, product, rawMaterial1, 2));
        entityManager.persist(new ProductRawMaterialEntity(id2, product, rawMaterial2, 5));
        entityManager.flush();
        entityManager.clear();
    }

    @Test
    @DisplayName("Should return all associations for a given product ID")
    void findByIdProductId() {
        List<ProductRawMaterialEntity> result = productRawMaterialRepository.findByIdProductId(product.getId());

        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(a -> a.getId().getProductId().equals(product.getId())));
    }

    @Test
    @DisplayName("Should delete only the association matching both product ID and raw material ID")
    void deleteByIdProductIdAndIdRawMaterialId() {
        productRawMaterialRepository.deleteByIdProductIdAndIdRawMaterialId(product.getId(), rawMaterial1.getId());
        entityManager.flush();
        entityManager.clear();

        List<ProductRawMaterialEntity> result = productRawMaterialRepository.findByIdProductId(product.getId());

        assertEquals(1, result.size());
        assertEquals(rawMaterial2.getId(), result.getFirst().getId().getRawMaterialId());
    }
}
