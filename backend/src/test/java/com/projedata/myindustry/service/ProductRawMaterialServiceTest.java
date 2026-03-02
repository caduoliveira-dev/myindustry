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
    @DisplayName("Should order suggestion by unit price descending, not by total production value")
    void suggestProduction() {
        // Produto A: R$110,00 (11000 centavos) — produz 1 unidade, total R$110
        // Produto B: R$90,00  (9000 centavos)  — produz 2 unidades, total R$180
        // Produto A deve aparecer primeiro: maior preço unitário, mesmo tendo menor custo total
        UUID productAId = UUID.randomUUID();
        UUID productBId = UUID.randomUUID();
        UUID rmAId = UUID.randomUUID();
        UUID rmBId = UUID.randomUUID();

        ProductEntity productA = new ProductEntity(productAId, "Engrenagem", 11000);
        ProductEntity productB = new ProductEntity(productBId, "Parafuso", 9000);
        RawMaterialEntity rmA = new RawMaterialEntity(rmAId, "Aço", 3);
        RawMaterialEntity rmB = new RawMaterialEntity(rmBId, "Ferro", 6);

        // Produto A: precisa de 3 unidades de Aço  → floor(3/3) = 1
        // Produto B: precisa de 3 unidades de Ferro → floor(6/3) = 2
        ProductRawMaterialId idA = new ProductRawMaterialId(productAId, rmAId);
        ProductRawMaterialId idB = new ProductRawMaterialId(productBId, rmBId);
        ProductRawMaterialEntity assocA = new ProductRawMaterialEntity(idA, productA, rmA, 3);
        ProductRawMaterialEntity assocB = new ProductRawMaterialEntity(idB, productB, rmB, 3);

        when(productRepository.findAllByOrderByPriceDesc()).thenReturn(List.of(productA, productB));
        when(rawMaterialRepository.findAll()).thenReturn(List.of(rmA, rmB));
        when(productRawMaterialRepository.findByIdProductId(productAId)).thenReturn(List.of(assocA));
        when(productRawMaterialRepository.findByIdProductId(productBId)).thenReturn(List.of(assocB));

        ProductionSuggestionResponse response = service.suggestProduction();

        assertEquals(2, response.items().size());
        assertEquals("Engrenagem", response.items().get(0).productName());
        assertEquals(1, response.items().get(0).unitsToProduce());
        assertEquals(110.0, response.items().get(0).unitPrice());
        assertEquals(110.0, response.items().get(0).totalValue());
        assertEquals("Parafuso", response.items().get(1).productName());
        assertEquals(2, response.items().get(1).unitsToProduce());
        assertEquals(90.0, response.items().get(1).unitPrice());
        assertEquals(180.0, response.items().get(1).totalValue());
        assertEquals(290.0, response.grandTotal());
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
