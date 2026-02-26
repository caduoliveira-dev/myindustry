package com.projedata.myindustry.service;

import com.projedata.myindustry.dto.RawMaterialRequest;
import com.projedata.myindustry.entity.RawMaterialEntity;
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
class RawMaterialServiceTest {

    @Mock
    RawMaterialRepository repository;

    @InjectMocks
    RawMaterialService service;

    @Test
    @DisplayName("Should create raw material with correct stock quantity")
    void create() {
        RawMaterialRequest request = new RawMaterialRequest("Aço", 100);
        RawMaterialEntity saved = new RawMaterialEntity(UUID.randomUUID(), "Aço", 100);
        when(repository.save(any())).thenReturn(saved);

        RawMaterialEntity result = service.create(request);

        assertEquals("Aço", result.getName());
        assertEquals(100, result.getStockQuantity());
        verify(repository).save(any());
    }

    @Test
    @DisplayName("Should return raw material when ID exists")
    void findById() {
        UUID id = UUID.randomUUID();
        RawMaterialEntity rawMaterial = new RawMaterialEntity(id, "Alumínio", 50);
        when(repository.findById(id)).thenReturn(Optional.of(rawMaterial));

        RawMaterialEntity result = service.findById(id);

        assertEquals(id, result.getId());
        assertEquals("Alumínio", result.getName());
    }

    @Test
    @DisplayName("Should throw exception when raw material is not found")
    void findById_notFound() {
        UUID id = UUID.randomUUID();
        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.findById(id));
    }

    @Test
    @DisplayName("Should return all raw materials")
    void findAll() {
        List<RawMaterialEntity> rawMaterials = List.of(
                new RawMaterialEntity(UUID.randomUUID(), "Aço", 100),
                new RawMaterialEntity(UUID.randomUUID(), "Alumínio", 50)
        );
        when(repository.findAll()).thenReturn(rawMaterials);

        List<RawMaterialEntity> result = service.findAll();

        assertEquals(2, result.size());
    }

    @Test
    @DisplayName("Should update raw material name and stock quantity")
    void update() {
        UUID id = UUID.randomUUID();
        RawMaterialEntity existing = new RawMaterialEntity(id, "Antigo", 10);
        RawMaterialRequest request = new RawMaterialRequest("Aço", 200);
        RawMaterialEntity updated = new RawMaterialEntity(id, "Aço", 200);

        when(repository.findById(id)).thenReturn(Optional.of(existing));
        when(repository.save(any())).thenReturn(updated);

        RawMaterialEntity result = service.update(id, request);

        assertEquals("Aço", result.getName());
        assertEquals(200, result.getStockQuantity());
        verify(repository).save(any());
    }

    @Test
    @DisplayName("Should delete raw material when ID exists")
    void delete() {
        UUID id = UUID.randomUUID();
        RawMaterialEntity rawMaterial = new RawMaterialEntity(id, "Aço", 100);
        when(repository.findById(id)).thenReturn(Optional.of(rawMaterial));

        service.delete(id);

        verify(repository).deleteById(id);
    }

    @Test
    @DisplayName("Should throw exception when deleting a non-existing raw material")
    void delete_notFound() {
        UUID id = UUID.randomUUID();
        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.delete(id));
        verify(repository, never()).deleteById(any());
    }
}
