import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { filters } from '../../constants/filters';

import styles from './styles.module.scss';

const Task = ({ filter, task, onComplete, onDelete, onNest, onUnNest }) => {
	const renderTask = () => {
		return (
			<div
				className={classnames(
					styles.task,
					task.completed ? styles['task--completed'] : null
				)}
			>
				<label htmlFor={task.id} className={styles.task__checkbox}>
					<input
						id={task.id}
						type="checkbox"
						className={styles.task__checkbox__input}
						value={task.title}
						checked={task.completed}
						onChange={(e) => onComplete(task.id, e.target.checked)}
					/>
					<span className={styles.task__checkbox__title}>{ task.title }</span>
				</label>

				<button
					className={classnames(styles.task__actionBtn, styles['task__actionBtn--delete'])}
					onClick={() => onDelete(task.id)}
				/>
				{ task.parent ? (
					<button
						className={classnames(styles.task__actionBtn, styles['task__actionBtn--nested'], styles['task__actionBtn--leftArrow'])}
						onClick={() => onUnNest(task.id)}
					/>
				) : null }
				{ task.previous ? (
					<button
						className={classnames(styles.task__actionBtn, styles['task__actionBtn--nested'], styles['task__actionBtn--rightArrow'])}
						onClick={() => onNest(task.id)}
					/>
				) : null }
			</div>
		);
	};

	const shouldRenderTask = () => {
		switch (filter) {
			case filters.PENDING:
				return task.completed === false;
			case filters.COMPLETED:
				return task.completed === true;
			default:
				return true;
		}
	};

	return (
		<div className={classnames(task.parent ? styles['task--nested'] : null)}>

			{ shouldRenderTask() ? renderTask () : null }

			{ task.children &&
				task.children.map((childTask) =>
					<Task
						filter={filter}
						task={childTask}
						onComplete={onComplete}
						onDelete={onDelete}
						onNest={onNest}
						onUnNest={onUnNest}
						key={childTask.id}
					/>)
			}
		</div>
	);
};

const taskShape = {
	title: PropTypes.string.isRequired,
	completed: PropTypes.bool.isRequired,
	id: PropTypes.number.isRequired,

};

taskShape.children = PropTypes.arrayOf(PropTypes.shape(taskShape));
taskShape.parent = PropTypes.shape(taskShape);
taskShape.previous = PropTypes.shape(taskShape);

Task.propTypes = {
	filter: PropTypes.string,
	task: PropTypes.shape(taskShape).isRequired,
	onDelete: PropTypes.func.isRequired,
	onComplete: PropTypes.func.isRequired,
	onNest: PropTypes.func.isRequired,
	onUnNest: PropTypes.func.isRequired,
};

Task.defaultProps = {
	filter: filters.ALL
};

export default Task;
