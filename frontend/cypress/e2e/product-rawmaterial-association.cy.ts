describe("Product Raw Material Association", () => {
  const url = "http://localhost:5173";

  function navigateToProductDetail() {
    cy.visit(url);
    cy.get("[data-testid='actions-trigger']").first().click();
    cy.get("[data-testid='action-view']").click();
  }

  describe("Associate/Disassociate raw material", () => {
    beforeEach(() => {
      cy.request("POST", "http://localhost:3000/products", {
        name: "produto teste",
        price: 10,
      });

      cy.request("POST", "http://localhost:3000/raw-materials", {
        name: "materia teste",
        stockQuantity: 50,
      });

      navigateToProductDetail();
    });

    it("should associate/disassociate a raw material to the product", () => {
      cy.get("#filterName")
        .type("materia teste")
        .should("have.value", "materia teste");
      cy.contains("materia teste")
        .parent()
        .find("[data-testid='btn-associate']")
        .click();

      cy.get("h3")
        .contains("Associated")
        .parent()
        .contains("materia teste")
        .should("exist");

      cy.contains("materia teste")
        .parent()
        .parent()
        .find("[data-testid='btn-remove']")
        .click();

      cy.get("h3")
        .contains("Raw Materials")
        .parent()
        .contains("materia teste")
        .should("exist");
    });
  });
});
