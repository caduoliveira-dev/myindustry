describe("Update Product", () => {
  const url = "http://localhost:5173";
  beforeEach(() => {
    cy.request("POST", "http://localhost:3000/products", {
      name: "produto teste",
      price: 10,
    });

    cy.visit(`${url}`);
    cy.get("[data-testid='actions-trigger']").first().click();
    cy.get("[data-testid='action-update']").click();
  });

  it("product update successful", () => {
    cy.get("#name").clear().type("produto atualizado");
    cy.get("#price").clear().type("99");
    cy.get("#btnSubmit").click();
    cy.contains("Product successfully modified!").should("exist");
  });

  it("should show error when name is empty", () => {
    cy.get("#name").clear();
    cy.get("#btnSubmit").click();
    cy.contains("Name is required").should("exist");
  });

  it("should show error when price is empty", () => {
    cy.get("#price").clear();
    cy.get("#btnSubmit").click();
    cy.contains("Invalid input: expected number, received NaN").should("exist");
  });
});
