package com.projedata.myindustry.service;

import com.projedata.myindustry.dto.ProductRequest;
import com.projedata.myindustry.entity.ProductEntity;
import com.projedata.myindustry.repository.ProductRepository;
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
class ProductServiceTest {

    @Mock
    ProductRepository repository;

    @InjectMocks
    ProductService service;

    @Test
    @DisplayName("Should create product converting price to cents")
    void create() {
        ProductRequest request = new ProductRequest("Engrenagem", 15.50);
        ProductEntity saved = new ProductEntity(UUID.randomUUID(), "Engrenagem", 1550);
        when(repository.save(any())).thenReturn(saved);

        ProductEntity result = service.create(request);

        assertEquals(1550, result.getPrice());
        assertEquals("Engrenagem", result.getName());
        verify(repository).save(any());
    }

    @Test
    @DisplayName("Should return product when ID exists")
    void findById() {
        UUID id = UUID.randomUUID();
        ProductEntity product = new ProductEntity(id, "Parafuso", 500);
        when(repository.findById(id)).thenReturn(Optional.of(product));

        ProductEntity result = service.findById(id);

        assertEquals(id, result.getId());
        assertEquals("Parafuso", result.getName());
    }

    @Test
    @DisplayName("Should throw exception when product is not found")
    void findById_notFound() {
        UUID id = UUID.randomUUID();
        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.findById(id));
    }

    @Test
    @DisplayName("Should return all products")
    void findAll() {
        List<ProductEntity> products = List.of(
                new ProductEntity(UUID.randomUUID(), "Porca", 300),
                new ProductEntity(UUID.randomUUID(), "Parafuso", 500)
        );
        when(repository.findAll()).thenReturn(products);

        List<ProductEntity> result = service.findAll();

        assertEquals(2, result.size());
    }

    @Test
    @DisplayName("Should update product name and price")
    void update() {
        UUID id = UUID.randomUUID();
        ProductEntity existing = new ProductEntity(id, "Antigo", 1000);
        ProductRequest request = new ProductRequest("Novo", 30.00);
        ProductEntity updated = new ProductEntity(id, "Novo", 3000);

        when(repository.findById(id)).thenReturn(Optional.of(existing));
        when(repository.save(any())).thenReturn(updated);

        ProductEntity result = service.update(id, request);

        assertEquals("Novo", result.getName());
        assertEquals(3000, result.getPrice());
        verify(repository).save(any());
    }

    @Test
    @DisplayName("Should delete product when ID exists")
    void delete() {
        UUID id = UUID.randomUUID();
        ProductEntity product = new ProductEntity(id, "Parafuso", 500);
        when(repository.findById(id)).thenReturn(Optional.of(product));

        service.delete(id);

        verify(repository).deleteById(id);
    }

    @Test
    @DisplayName("Should throw exception when deleting a non-existing product")
    void delete_notFound() {
        UUID id = UUID.randomUUID();
        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.delete(id));
        verify(repository, never()).deleteById(any());
    }
}
