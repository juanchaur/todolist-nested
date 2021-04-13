import { useState } from 'react';

const useLocalStorage = (key, initialValue)  => {
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const jsonData = window.localStorage.getItem(key);

			return jsonData ? JSON.parse(jsonData) : initialValue;
		} catch (error) {
			// console.log(error);
			return initialValue;
		}
	});

	const setValue = (value) => {
		try {
			setStoredValue(value);
			window.localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			// console.log(error);
		}
	};

	return [storedValue, setValue];
};

export default useLocalStorage;
