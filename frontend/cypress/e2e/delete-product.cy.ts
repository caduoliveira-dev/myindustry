describe("Delete Product", () => {
  const url = "http://localhost:5173";

  beforeEach(() => {
    cy.request("POST", "http://localhost:3000/products", {
      name: "produto teste",
      price: 10,
    });

    cy.visit(`${url}`);
    cy.get("[data-testid='actions-trigger']").first().click();
    cy.get("[data-testid='action-delete']").click();
  });

  it("product delete successful", () => {
    cy.get("#btnDelete").click();
    cy.contains("Product successfully deleted!").should("exist");
  });

  it("should close dialog when cancel is clicked", () => {
    cy.get("#btnCancel").click();
    cy.get("#btnDelete").should("not.exist");
  });
});
