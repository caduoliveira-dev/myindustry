package com.projedata.myindustry.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Table(name = "raw_material")
@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RawMaterialEntity {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;
    private Integer stockQuantity;
}
