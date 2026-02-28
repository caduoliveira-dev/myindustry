describe("Create Raw Material", () => {
  const url = "http://localhost:5173";

  beforeEach(() => {
    cy.visit(`${url}`);
    cy.get("#RawMaterialTrigger").click();
    cy.get("#AddRawMaterial").click();
  });

  it("raw material registration successful", () => {
    cy.get("#name").type("madeira").should("have.value", "madeira");
    cy.get("#stockQuantity").type("100").should("have.value", "100");
    cy.get("#btnSubmit").click();
    cy.contains("Raw material successfully registered!").should("exist");
  });

  it("should show error when name is empty", () => {
    cy.get("#stockQuantity").type("100");
    cy.get("#btnSubmit").click();
    cy.contains("Name is required").should("exist");
  });

  it("should show error when stock is empty", () => {
    cy.get("#name").type("madeira");
    cy.get("#btnSubmit").click();
    cy.contains("Invalid input: expected number, received NaN").should("exist");
  });
});
