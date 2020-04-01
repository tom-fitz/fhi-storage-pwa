// https://docs.cypress.io/api/introduction/api.html

describe('Testing House Component', () => {
  it('Visits the app root url', () => {
    cy.visit('http://localhost:8081/#/')
  })

  it('Open Add house Window And Add New House', () => {
    cy.get('[data-cy=add-house-btn').click()
  })

  it('Enter in house input fields', () => {
    cy.get('[data-cy=house-address')
      .type('Cypress Test')
      .should('have.value', 'Cypress Test')
    
    cy.get('[data-cy=house-zipcode')
      .type('12345')
      .should('have.value', '12345')
    
    cy.get('[data-cy=house-cost')
      .type('54321')
      .should('have.value', '54321')

    cy.get('[data-cy=house-close-btn')
      .click()

    cy.wait(1000)
  })



  it('Get New house and open it', () => {
    cy.get('div').contains('Galloway St. Apt')
      .click()
  })
})
