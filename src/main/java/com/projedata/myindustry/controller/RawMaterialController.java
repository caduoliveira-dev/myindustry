package com.projedata.myindustry.controller;

import com.projedata.myindustry.dto.RawMaterialRequest;
import com.projedata.myindustry.entity.RawMaterialEntity;
import com.projedata.myindustry.service.RawMaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/raw-materials")
@RequiredArgsConstructor
public class RawMaterialController {

    private final RawMaterialService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RawMaterialEntity create(@RequestBody RawMaterialRequest request) {
        return service.create(request);
    }

    @GetMapping("/{id}")
    public RawMaterialEntity findById(@PathVariable UUID id) {
        return service.findById(id);
    }

    @GetMapping
    public Page<RawMaterialEntity> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return service.findAll(PageRequest.of(page, size));
    }

    @PutMapping("/{id}")
    public RawMaterialEntity update(@PathVariable UUID id, @RequestBody RawMaterialRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
