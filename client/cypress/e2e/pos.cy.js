describe('POS Terminal - Cashier Transactions (E2E Test)', () => {
  beforeEach(() => {
    // 1. Visit the app
    cy.visit('/');
    
    // 2. Clear old state
    cy.clearLocalStorage();
  });

  it('Successfully logs in as a Cashier, adds items to cart, and completes checkout', () => {
    // Navigate to Cashier Login
    cy.contains('Cashier Login').click();
    cy.url().should('include', '/login');
    
    // Perform Mock Login
    // Note: We bypass real network auth in unit/integration E2E unless testing the DB,
    // intercept API auth directly.
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'mock-jwt-token',
        user: { id: 'test', name: 'Cy Casher', role: 'cashier' }
      }
    }).as('loginRequest');

    cy.get('input[type="email"]').type('cashier@retailpro.com');
    cy.get('input[type="password"]').type('password123');
    cy.contains('button', 'Login').click();
    cy.wait('@loginRequest');

    // Should arrive at the POS Dashboard
    cy.url().should('include', '/dashboard/pos');

    // Ensure the terminal loaded
    cy.contains('Retail Pro POS').should('be.visible');

    // Simulate Product Searching -> Add to Cart
    // (This searches the DOM for buttons specifically designed in the POS terminal tailwind structure)
    cy.intercept('GET', '**/api/products*', {
      statusCode: 200,
      body: {
        products: [
          { id: 'prod1', name: 'Test Apple', price: 1.5, stock: 100 }
        ]
      }
    }).as('getProducts');

    cy.wait('@getProducts');
    cy.contains('Test Apple').click();

    // Verify cart calculation algorithms
    cy.get('.cart-subtotal').should('contain', '$1.50');

    // Trigger Checkout
    cy.intercept('POST', '**/api/orders', {
      statusCode: 201,
      body: { orderNumber: 'ORD-CY-1', status: 'completed' }
    }).as('createOrder');

    cy.contains('button', 'Pay').click();

    // Verify Transaction success screen / toast
    cy.wait('@createOrder');
    cy.contains('Order entirely successful').should('exist');
  });
});
