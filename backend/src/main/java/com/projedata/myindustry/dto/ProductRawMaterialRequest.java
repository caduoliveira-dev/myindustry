package com.projedata.myindustry.dto;

import java.util.UUID;

public record ProductRawMaterialRequest(UUID rawMaterialId, Integer requiredQuantity) {}
