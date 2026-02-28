describe("Production Suggestion", () => {
  const url = "http://localhost:5173";

  it("should show initial state before generating", () => {
    cy.visit(url);
    cy.contains("Click Generate to see a suggestion.").should("exist");
  });

  describe("with stock available", () => {
    beforeEach(() => {
      cy.request("POST", "http://localhost:3000/products", {
        name: "produto sugestao",
        price: 20,
      }).then((productRes) => {
        cy.request("POST", "http://localhost:3000/raw-materials", {
          name: "materia sugestao",
          stockQuantity: 10,
        }).then((rmRes) => {
          cy.request(
            "POST",
            `http://localhost:3000/products/${productRes.body.id}/raw-materials`,
            {
              rawMaterialId: rmRes.body.id,
              requiredQuantity: 2,
            },
          );
        });
      });

      cy.visit(url);
    });

    it("should display product in suggestion with correct values", () => {
      cy.get("[data-testid='btn-generate']").click();

      cy.contains("produto sugestao").should("exist");
      cy.contains("5x").should("exist");
      cy.contains("$20.00 each").should("exist");
      cy.contains("$100.00").should("exist");
      cy.contains("Grand Total").should("exist");
    });
  });
});
