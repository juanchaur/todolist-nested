import { renderHook } from '@testing-library/react-hooks';

import useLocalStorage from './index';

describe('Hooks: useLocalStorage', () => {
	let localStorageMock;

	beforeEach(() => {
		localStorageMock = {
			getItem: jest.fn(),
			setItem: jest.fn(),
			clear: jest.fn(),
		};

		global.localStorage = localStorageMock;
	});

	afterEach(() => {
		localStorage.clear();
	});

	test('hook return value and function to set the state', () => {
		const { result } = renderHook(() => useLocalStorage('task', {}));

		expect(typeof result.current[0]).toEqual('object');
		expect(typeof result.current[1]).toEqual('function');
	});

	test('sets localStorage on hook execution', () => {
		const value = { title: 'test' };

		const { result } = renderHook(() => useLocalStorage('task', value));

		expect(result.current[0]).toEqual({ title: 'test' });
		expect(typeof result.current[1]).toEqual('function');
	});

	test('read localStorage on hook execution', () => {
		localStorage.setItem('task', JSON.stringify({ title: 'test' }));

		const { result } = renderHook(() => useLocalStorage('task', []));

		expect(result.current[0]).toEqual({ title: 'test' });
		expect(typeof result.current[1]).toEqual('function');
	});
});
