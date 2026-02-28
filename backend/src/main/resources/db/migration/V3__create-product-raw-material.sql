CREATE TABLE product_raw_material (
    product_id      UUID    NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    raw_material_id UUID    NOT NULL REFERENCES raw_material(id) ON DELETE CASCADE,
    required_quantity INTEGER NOT NULL,
    PRIMARY KEY (product_id, raw_material_id)
);
