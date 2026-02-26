package com.projedata.myindustry.service;

import com.projedata.myindustry.dto.ProductRawMaterialRequest;
import com.projedata.myindustry.dto.ProductionItemResponse;
import com.projedata.myindustry.dto.ProductionSuggestionResponse;
import com.projedata.myindustry.entity.ProductEntity;
import com.projedata.myindustry.entity.ProductRawMaterialEntity;
import com.projedata.myindustry.entity.ProductRawMaterialId;
import com.projedata.myindustry.entity.RawMaterialEntity;
import com.projedata.myindustry.repository.ProductRawMaterialRepository;
import com.projedata.myindustry.repository.ProductRepository;
import com.projedata.myindustry.repository.RawMaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductRawMaterialService {

    private final ProductRawMaterialRepository productRawMaterialRepository;
    private final ProductRepository productRepository;
    private final RawMaterialRepository rawMaterialRepository;

    public ProductRawMaterialEntity addRawMaterial(UUID productId, ProductRawMaterialRequest request) {
        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        RawMaterialEntity rawMaterial = rawMaterialRepository.findById(request.rawMaterialId())
                .orElseThrow(() -> new RuntimeException("Raw material not found"));

        ProductRawMaterialId id = new ProductRawMaterialId(productId, request.rawMaterialId());
        ProductRawMaterialEntity entity = new ProductRawMaterialEntity(id, product, rawMaterial, request.requiredQuantity());
        return productRawMaterialRepository.save(entity);
    }

    public void removeRawMaterial(UUID productId, UUID rawMaterialId) {
        productRawMaterialRepository.deleteByIdProductIdAndIdRawMaterialId(productId, rawMaterialId);
    }

    public List<ProductRawMaterialEntity> findByProduct(UUID productId) {
        return productRawMaterialRepository.findByIdProductId(productId);
    }

    public ProductionSuggestionResponse suggestProduction() {
        List<ProductEntity> products = productRepository.findAllByOrderByPriceDesc();

        Map<UUID, Integer> availableStock = new HashMap<>();
        rawMaterialRepository.findAll().forEach(rm ->
                availableStock.put(rm.getId(), rm.getStockQuantity()));

        List<ProductionItemResponse> items = new ArrayList<>();
        double grandTotal = 0;

        for (ProductEntity product : products) {
            List<ProductRawMaterialEntity> associations = productRawMaterialRepository.findByIdProductId(product.getId());

            if (associations.isEmpty()) continue;

            int unitsToProduce = Integer.MAX_VALUE;
            for (ProductRawMaterialEntity assoc : associations) {
                UUID rmId = assoc.getRawMaterial().getId();
                int stock = availableStock.getOrDefault(rmId, 0);
                int units = stock / assoc.getRequiredQuantity();
                unitsToProduce = Math.min(unitsToProduce, units);
            }

            if (unitsToProduce <= 0) continue;

            for (ProductRawMaterialEntity assoc : associations) {
                UUID rmId = assoc.getRawMaterial().getId();
                int consumed = unitsToProduce * assoc.getRequiredQuantity();
                availableStock.merge(rmId, -consumed, Integer::sum);
            }

            double unitPrice = product.getPrice() / 100.0;
            double totalValue = unitsToProduce * unitPrice;
            grandTotal += totalValue;
            items.add(new ProductionItemResponse(
                    product.getId(),
                    product.getName(),
                    unitPrice,
                    unitsToProduce,
                    totalValue
            ));
        }

        return new ProductionSuggestionResponse(items, grandTotal);
    }
}
