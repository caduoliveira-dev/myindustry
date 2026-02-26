package com.projedata.myindustry.controller;

import com.projedata.myindustry.dto.ProductRequest;
import com.projedata.myindustry.dto.RawMaterialRequest;
import com.projedata.myindustry.entity.ProductEntity;
import com.projedata.myindustry.entity.RawMaterialEntity;
import com.projedata.myindustry.service.ProductService;
import com.projedata.myindustry.service.RawMaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductEntity create(@RequestBody ProductRequest request) {
        return service.create(request);
    }

    @GetMapping("/{id}")
    public ProductEntity findById(@PathVariable UUID id) { return service.findById(id); }

    @GetMapping
    public List<ProductEntity> findAll() { return service.findAll(); }

    @PutMapping("/{id}")
    public ProductEntity update(@PathVariable UUID id, @RequestBody ProductRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}