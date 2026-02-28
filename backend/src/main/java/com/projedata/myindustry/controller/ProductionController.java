package com.projedata.myindustry.controller;

import com.projedata.myindustry.dto.ProductionSuggestionResponse;
import com.projedata.myindustry.service.ProductRawMaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/production")
@RequiredArgsConstructor
public class ProductionController {

    private final ProductRawMaterialService service;

    @GetMapping("/suggestion")
    public ProductionSuggestionResponse suggest() {
        return service.suggestProduction();
    }
}
