describe("Create Product", () => {
  const url = "http://localhost:5173";
  beforeEach(() => {
    cy.visit(`${url}`);
    cy.get("#ProductTrigger").click();
    cy.get("#AddProduct").click();
  });

  it("product registration successful", () => {
    cy.get("#name").type("teste").should("have.value", "teste");
    cy.get("#price").type("10").should("have.value", "10");
    cy.get("#btnSubmit").click();
    cy.contains("Product successfully registered!").should("exist");
  });

  it("should show error when name is empty", () => {
    cy.get("#price").type("10");
    cy.get("#btnSubmit").click();
    cy.contains("Name is required").should("exist");
  });

  it("should show error when price is empty", () => {
    cy.get("#name").type("teste");
    cy.get("#btnSubmit").click();
    cy.contains("Invalid input: expected number, received NaN").should("exist");
  });
});
