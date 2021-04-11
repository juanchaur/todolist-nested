
/* eslint-disable no-debugger */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './styles.module.scss';

const Task = ({ task, index, onComplete, onDelete, onNest }) => {
	return (
		<div
			className={classnames(styles.task, task.completed ? styles.completed : null)}
		>

			<label htmlFor={index} className={styles.checkbox}>
				<input
					id={index}
					type="checkbox"
					value={task.title}
					checked={task.completed}
					onChange={(e) => {
						const value = e.target.checked;

						onComplete(value, index);
					}}
				/>
				<span className={styles.title}>
					{ task.title }
				</span>
			</label>



			<button
				className={styles.deleteBtn}
				onClick={() => onDelete(index)}
			/>

			<button
				className={styles.nestBtn}
				onClick={() => onNest(index)}
			/>

		</div>
	);
};

Task.propTypes = {
	task: PropTypes.shape({
		title: PropTypes.string.isRequired,
		completed: PropTypes.bool.isRequired,
		children: PropTypes.shape({})
	}).isRequired,
	onDelete: PropTypes.func.isRequired,
	onComplete: PropTypes.func.isRequired,
	onNest: PropTypes.func.isRequired,
	index: PropTypes.number,
};

Task.defaultProps = {
	index: 0,
};

export default Task;
