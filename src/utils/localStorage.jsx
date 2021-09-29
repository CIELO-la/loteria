import { useState } from 'react';

// custom useState hook for browser storage (window.localStorage)
// modified from https://usehooks.com/useLocalStorage/
export const useLocalStorage = (localKey, defaultValue) => {
  	// initial state (browser kv or default) and update hook
	const localItem = localStorage.getItem(localKey);
	const initialValue = localItem
		// TODO: only parse JSON objects
		? typeof localItem === typeof {}
			? JSON.parse(localItem)
			: localItem
		: defaultValue
	;
	const [localValue, setStateValue] = useState(initialValue);

	// initial write to browser
	localStorage.setItem(localKey, initialValue);

  	// wrap update function so setting also updates local storage 
	const setLocalValue = value => {
		// mimic setState behavior of storing data vs running function
		const valueToSet = value instanceof Function
			? value(localValue)
			: value
		;
		// store value in app and in browser
		setStateValue(valueToSet);
		localStorage.setItem(localKey, JSON.stringify(valueToSet));
	};
	return [localValue, setLocalValue];
};
