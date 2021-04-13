
import { flattenArrayByProp, findIndex, findById } from './array';

describe('utils / array', () => {
	describe('flattenArrayByProp', () => {
		test('flattens array based on key property array', () => {
			const input = [{
				title: 'test 1',
				children: [{
					title: 'test A',
					children: [{
						title: 'test I'
					}]
				}, {
					title: 'test X',
					children: []
				}, {
					title: 'end'
				}]
			}];

			expect(flattenArrayByProp(input, 'children')).toEqual([
					{
						title: 'test 1',
						children: [
							{
								title: 'test A',
								children: [
									{
										title: 'test I'
									}
								]
							},
							{
								title: 'test X',
								children: []
							},
							{
								title: 'end'
							}
						]
					},
					{
						title: 'test A',
						children: [
							{
								title: 'test I'
							}
						]
					},
					{
						title: 'test I'
					},
					{
						title: 'test X',
						children: []
					},
					{
						title: 'end'
					}
				]
			);
		});
	});

	describe('findIndex', () => {
		test('finds ndex of a task in array', () => {
			const input = [{
				title: 'test 1'
			}, {
				title: 'test 2'
			}, {
				title: 'test 3'
			}];

			expect(findIndex(input[2], input)).toEqual(2);
		});
	});

	describe('findById', () => {
		test('finds element in a nested array', () => {
			const input = [{
				id: 'someId-1',
				title: 'test 1',
				children: [{
					id: 'someId-3',
					title: 'test A',
					children: [{
						id: 'someId-xyz',
						title: 'test I',
						children: []
					}]
				}, {
					title: 'test X',
					id: 'someId-23',
					children: []
				}, {
					id: 'someId-3',
					title: 'end',
					children: []
				}]
			}];

			expect(findById('someId-xyz', input, 'children')).toEqual({
				id: 'someId-xyz',
				title: 'test I',
				children: []
			});

		});
	});
});
