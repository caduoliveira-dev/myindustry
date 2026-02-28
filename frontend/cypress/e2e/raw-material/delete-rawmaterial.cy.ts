describe("Delete Raw Material", () => {
  const url = "http://localhost:5173";

  beforeEach(() => {
    cy.request("POST", "http://localhost:3000/raw-materials", {
      name: "materia teste",
      stockQuantity: 50,
    });

    cy.visit(`${url}`);
    cy.get("#RawMaterialTrigger").click();
    cy.get("[data-testid='actions-trigger']").first().click();
    cy.get("[data-testid='action-delete']").click();
  });

  it("raw material delete successful", () => {
    cy.get("#btnDelete").click();
    cy.contains("Raw material successfully deleted!").should("exist");
  });

  it("should close dialog when cancel is clicked", () => {
    cy.get("#btnCancel").click();
    cy.get("#btnDelete").should("not.exist");
  });
});
