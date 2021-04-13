
export const findIndex = (task, parent) => parent.findIndex(currentTask => currentTask === task);

const hasChildren = (currentTask, keyProp) => Array.isArray(currentTask[keyProp]) && currentTask[keyProp].length > 0;

export const flattenArrayByProp = (currentTasks, keyProp) => {
	let result = [];

	currentTasks.forEach(currentTask => {
		result.push(currentTask);

		if (hasChildren(currentTask, keyProp)) {
			result = result.concat(flattenArrayByProp(currentTask[keyProp], keyProp));
		}
	});

	return result;
};

export const findById = (id, items, nestedKeyProp) => {
	// eslint-disable-next-line no-restricted-syntax
	for (const item of items) {
		if (item.id === id) {
			return item;
		}

		const found = findById(id, item[nestedKeyProp], nestedKeyProp);
		if (found) {
			return found;
		}
	}

	return undefined;
};
