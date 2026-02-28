package com.projedata.myindustry.dto;

import java.util.List;

public record ProductionSuggestionResponse(List<ProductionItemResponse> items, Double grandTotal) {}
