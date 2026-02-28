describe("Update Raw Material", () => {
  const url = "http://localhost:5173";

  beforeEach(() => {
    cy.request("POST", "http://localhost:3000/raw-materials", {
      name: "materia teste",
      stockQuantity: 50,
    });

    cy.visit(`${url}`);
    cy.get("#RawMaterialTrigger").click();
    cy.get("[data-testid='actions-trigger']").first().click();
    cy.get("[data-testid='action-update']").click();
  });

  it("raw material update successful", () => {
    cy.get("#name").clear().type("materia atualizada");
    cy.get("#stockQuantity").clear().type("200");
    cy.get("#btnSubmit").click();
    cy.contains("Raw material successfully modified!").should("exist");
  });

  it("should show error when name is empty", () => {
    cy.get("#name").clear();
    cy.get("#btnSubmit").click();
    cy.contains("Name is required").should("exist");
  });

  it("should show error when stock is empty", () => {
    cy.get("#stockQuantity").clear();
    cy.get("#btnSubmit").click();
    cy.contains("Invalid input: expected number, received NaN").should("exist");
  });
});
