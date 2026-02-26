package com.projedata.myindustry.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "product_raw_material")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductRawMaterialEntity {

    @EmbeddedId
    private ProductRawMaterialId id;

    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private ProductEntity product;

    @ManyToOne
    @MapsId("rawMaterialId")
    @JoinColumn(name = "raw_material_id")
    private RawMaterialEntity rawMaterial;

    @Column(name = "required_quantity")
    private Integer requiredQuantity;
}
