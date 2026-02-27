package com.projedata.myindustry.service;

import com.projedata.myindustry.dto.ProductRequest;
import com.projedata.myindustry.entity.ProductEntity;
import com.projedata.myindustry.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository repository;

    public ProductEntity create(ProductRequest request) {
        ProductEntity entity = new ProductEntity();
        entity.setName(request.name());
        entity.setPrice((int) (request.price() * 100));
        return repository.save(entity);
    }

    public ProductEntity findById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Page<ProductEntity> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public ProductEntity update(UUID id, ProductRequest request) {
        ProductEntity entity = findById(id);
        entity.setName(request.name());
        entity.setPrice((int) (request.price() * 100));
        return repository.save(entity);
    }

    public void delete(UUID id){
        findById(id);
        repository.deleteById(id);
    }
}
