package com.projedata.myindustry.repository;

import com.projedata.myindustry.entity.ProductEntity;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class ProductRepositoryTest {

    @Autowired
    EntityManager entityManager;

    @Autowired
    ProductRepository productRepository;

    @Test
    @DisplayName("Should return all products ordered by price descending")
    void findAllByOrderByPriceDesc() {
        ProductEntity cheap = new ProductEntity(null, "Parafuso", 500);
        ProductEntity mid   = new ProductEntity(null, "Porca",    1500);
        ProductEntity pricey = new ProductEntity(null, "Engrenagem", 3000);

        entityManager.persist(cheap);
        entityManager.persist(mid);
        entityManager.persist(pricey);
        entityManager.flush();
        entityManager.clear();

        List<ProductEntity> result = productRepository.findAllByOrderByPriceDesc();

        assertEquals(3, result.size());
        assertTrue(result.get(0).getPrice() >= result.get(1).getPrice());
        assertTrue(result.get(1).getPrice() >= result.get(2).getPrice());
        assertEquals("Engrenagem", result.get(0).getName());
        assertEquals("Parafuso", result.get(2).getName());
    }
}
