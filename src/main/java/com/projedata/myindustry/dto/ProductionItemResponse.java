package com.projedata.myindustry.dto;

import java.util.UUID;

public record ProductionItemResponse(
        UUID productId,
        String productName,
        Integer unitPrice,
        Integer unitsToProduce,
        Integer totalValue
) {}
