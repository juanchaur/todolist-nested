
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const TaskCreator = ({ onCreateTask }) => {
	const [value, setValue] = useState('');

	const resetState = () => setValue('');

	const onSubmit = e => {
		e.preventDefault();

		if (!value) {
			return;
		}

		onCreateTask(value);
		resetState();
	};
	return (
		<form onSubmit={onSubmit} className={styles.taskCreator}>
			<input
				type="text"
				className={styles.input}
				value={value}
				placeholder="Add a new task"
				onChange={e => {
					setValue(e.target.value)
				}}
			/>
		</form>
	);
};

TaskCreator.propTypes = {
	onCreateTask: PropTypes.func.isRequired,
};


export default TaskCreator;
