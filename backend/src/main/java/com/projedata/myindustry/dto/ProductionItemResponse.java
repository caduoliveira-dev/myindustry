package com.projedata.myindustry.dto;

import java.util.UUID;

public record ProductionItemResponse(
        UUID productId,
        String productName,
        Double unitPrice,
        Integer unitsToProduce,
        Double totalValue
) {}
