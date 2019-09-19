import { Component, h } from '../src/supertag';

describe('supertag', () => {
	test('exports', () => {
		expect(Component).toBeDefined();
		expect(h).toBeDefined();
	});
});
