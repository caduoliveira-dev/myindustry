package com.projedata.myindustry.service;

import com.projedata.myindustry.dto.ProductRawMaterialRequest;
import com.projedata.myindustry.dto.ProductionSuggestionResponse;
import com.projedata.myindustry.entity.ProductEntity;
import com.projedata.myindustry.entity.ProductRawMaterialEntity;
import com.projedata.myindustry.entity.ProductRawMaterialId;
import com.projedata.myindustry.entity.RawMaterialEntity;
import com.projedata.myindustry.repository.ProductRawMaterialRepository;
import com.projedata.myindustry.repository.ProductRepository;
import com.projedata.myindustry.repository.RawMaterialRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductRawMaterialServiceTest {

    @Mock
    ProductRawMaterialRepository productRawMaterialRepository;

    @Mock
    ProductRepository productRepository;

    @Mock
    RawMaterialRepository rawMaterialRepository;

    @InjectMocks
    ProductRawMaterialService service;

    @Test
    @DisplayName("Should associate a raw material to a product with required quantity")
    void addRawMaterial() {
        UUID productId = UUID.randomUUID();
        UUID rawMaterialId = UUID.randomUUID();
        ProductEntity product = new ProductEntity(productId, "Engrenagem", 3000);
        RawMaterialEntity rawMaterial = new RawMaterialEntity(rawMaterialId, "Aço", 100);
        ProductRawMaterialRequest request = new ProductRawMaterialRequest(rawMaterialId, 3);

        ProductRawMaterialId id = new ProductRawMaterialId(productId, rawMaterialId);
        ProductRawMaterialEntity saved = new ProductRawMaterialEntity(id, product, rawMaterial, 3);

        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(rawMaterialRepository.findById(rawMaterialId)).thenReturn(Optional.of(rawMaterial));
        when(productRawMaterialRepository.save(any())).thenReturn(saved);

        ProductRawMaterialEntity result = service.addRawMaterial(productId, request);

        assertEquals(3, result.getRequiredQuantity());
        assertEquals(productId, result.getId().getProductId());
        assertEquals(rawMaterialId, result.getId().getRawMaterialId());
        verify(productRawMaterialRepository).save(any());
    }

    @Test
    @DisplayName("Should throw exception when product is not found on association")
    void addRawMaterial_productNotFound() {
        UUID productId = UUID.randomUUID();
        ProductRawMaterialRequest request = new ProductRawMaterialRequest(UUID.randomUUID(), 2);
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.addRawMaterial(productId, request));
        verify(productRawMaterialRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should remove association between product and raw material")
    void removeRawMaterial() {
        UUID productId = UUID.randomUUID();
        UUID rawMaterialId = UUID.randomUUID();

        service.removeRawMaterial(productId, rawMaterialId);

        verify(productRawMaterialRepository).deleteByIdProductIdAndIdRawMaterialId(productId, rawMaterialId);
    }

    @Test
    @DisplayName("Should return all raw material associations for a product")
    void findByProduct() {
        UUID productId = UUID.randomUUID();
        ProductEntity product = new ProductEntity(productId, "Engrenagem", 3000);
        RawMaterialEntity rawMaterial = new RawMaterialEntity(UUID.randomUUID(), "Aço", 100);
        ProductRawMaterialId id = new ProductRawMaterialId(productId, rawMaterial.getId());
        List<ProductRawMaterialEntity> associations = List.of(
                new ProductRawMaterialEntity(id, product, rawMaterial, 2)
        );

        when(productRawMaterialRepository.findByIdProductId(productId)).thenReturn(associations);

        List<ProductRawMaterialEntity> result = service.findByProduct(productId);

        assertEquals(1, result.size());
        assertEquals(2, result.getFirst().getRequiredQuantity());
    }

    @Test
    @DisplayName("Should suggest production prioritizing higher-priced products and deducting shared stock")
    void suggestProduction() {
        // Produto A: 30.00 reais (3000 centavos) — mais caro
        // Produto B: 15.00 reais (1500 centavos)
        UUID productAId = UUID.randomUUID();
        UUID productBId = UUID.randomUUID();
        UUID rmId = UUID.randomUUID();

        ProductEntity productA = new ProductEntity(productAId, "Engrenagem", 3000);
        ProductEntity productB = new ProductEntity(productBId, "Parafuso", 1500);
        RawMaterialEntity rm = new RawMaterialEntity(rmId, "Aço", 10);

        // Produto A precisa de 3 unidades de Aço — produz floor(10/3) = 3, consome 9, sobra 1
        // Produto B precisa de 2 unidades de Aço — produz floor(1/2) = 0, excluído
        ProductRawMaterialId idA = new ProductRawMaterialId(productAId, rmId);
        ProductRawMaterialId idB = new ProductRawMaterialId(productBId, rmId);
        ProductRawMaterialEntity assocA = new ProductRawMaterialEntity(idA, productA, rm, 3);
        ProductRawMaterialEntity assocB = new ProductRawMaterialEntity(idB, productB, rm, 2);

        when(productRepository.findAllByOrderByPriceDesc()).thenReturn(List.of(productA, productB));
        when(rawMaterialRepository.findAll()).thenReturn(List.of(rm));
        when(productRawMaterialRepository.findByIdProductId(productAId)).thenReturn(List.of(assocA));
        when(productRawMaterialRepository.findByIdProductId(productBId)).thenReturn(List.of(assocB));

        ProductionSuggestionResponse response = service.suggestProduction();

        assertEquals(1, response.items().size());
        assertEquals("Engrenagem", response.items().getFirst().productName());
        assertEquals(3, response.items().getFirst().unitsToProduce());
        assertEquals(30.0, response.items().getFirst().unitPrice());
        assertEquals(90.0, response.items().getFirst().totalValue());
        assertEquals(90.0, response.grandTotal());
    }

    @Test
    @DisplayName("Should return empty suggestion when stock is insufficient")
    void suggestProduction_semEstoque() {
        UUID productId = UUID.randomUUID();
        UUID rmId = UUID.randomUUID();

        ProductEntity product = new ProductEntity(productId, "Engrenagem", 3000);
        RawMaterialEntity rm = new RawMaterialEntity(rmId, "Aço", 0);
        ProductRawMaterialId id = new ProductRawMaterialId(productId, rmId);
        ProductRawMaterialEntity assoc = new ProductRawMaterialEntity(id, product, rm, 3);

        when(productRepository.findAllByOrderByPriceDesc()).thenReturn(List.of(product));
        when(rawMaterialRepository.findAll()).thenReturn(List.of(rm));
        when(productRawMaterialRepository.findByIdProductId(productId)).thenReturn(List.of(assoc));

        ProductionSuggestionResponse response = service.suggestProduction();

        assertTrue(response.items().isEmpty());
        assertEquals(0.0, response.grandTotal());
    }
}
