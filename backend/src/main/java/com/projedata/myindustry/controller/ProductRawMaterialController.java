package com.projedata.myindustry.controller;

import com.projedata.myindustry.dto.ProductRawMaterialRequest;
import com.projedata.myindustry.entity.ProductRawMaterialEntity;
import com.projedata.myindustry.service.ProductRawMaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/products/{id}/raw-materials")
@RequiredArgsConstructor
public class ProductRawMaterialController {

    private final ProductRawMaterialService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductRawMaterialEntity addRawMaterial(
            @PathVariable UUID id,
            @RequestBody ProductRawMaterialRequest request) {
        return service.addRawMaterial(id, request);
    }

    @DeleteMapping("/{rawMaterialId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeRawMaterial(
            @PathVariable UUID id,
            @PathVariable UUID rawMaterialId) {
        service.removeRawMaterial(id, rawMaterialId);
    }

    @GetMapping
    public List<ProductRawMaterialEntity> findByProduct(@PathVariable UUID id) {
        return service.findByProduct(id);
    }
}
