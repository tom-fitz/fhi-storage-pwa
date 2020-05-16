// https://docs.cypress.io/api/introduction/api.html

describe('Testing House Component', () => {
  it('Visits the app root url', () => {
    cy.visit('http://localhost:8081/#/')
  })

  it('Open Add house Window And Add New House', () => {
    cy.get('[data-cy=add-house-btn]').click()
  })

  it('Enter in house input fields', () => {
    cy.get('[data-cy=house-address]')
      .type('Cypress Test')
      .should('have.value', 'Cypress Test')
    
    cy.get('[data-cy=house-townInput]')
      .type('Needham')
      .should('have.value', 'Needham').click
    
    cy.get('[data-cy=house-contractedPrice]')
      .type('54321')
      .should('have.value', '54321')

    cy.get('[data-cy=house-poc]')
      .type('Thomas')
      .should('have.value','Thomas')

    // cy.get('[data-test=test-select-list]')
    //   //'one' is the expected select-list value
    //   .type('one{enter}', {force: true})
    //   //this next get is specifically pointing at the div
    //   //that vuetify puts the selected element into
    //   .get('.v-select__selection--comma')
    //       .then(function($elem) {
    //         // cy.log is a super useful debugging tool, use it
    //         // is showed me the exact string I was expecting
    //         cy.log($elem.text())
    //       //then you can assert the selected value
    //       expect($elem.text())
    //         .equal('one')
    //   })

    cy.get('[data-cy=house-close-btn]')
      .click()

    cy.wait(1000)
  })



  it('Get New house and open it', () => {
    cy.get('div').contains('Galloway St. Apt')
      .click()
  })
})
