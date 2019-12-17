describe('Sapper template app', () => {
	beforeEach(() => {
		cy.visit('/')
	});

	it('has the correct <h3>', () => {
		cy.contains('h3', 'Introduction')
	});

	it('navigates to /button', () => {
		cy.get('main div nav a').contains('Button').click();
		cy.url().should('include', '/button');
	});

	it('navigates to /checkbox', () => {
		cy.get('main div nav a').contains('Checkbox').click();
		cy.url().should('include', '/checkbox');
	});
});
