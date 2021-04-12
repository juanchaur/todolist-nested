/* eslint-disable no-debugger */


import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import useLocalStorage from '../hooks/useLocalStorage';
import TaskCreator from '../components/TaskCreator';
import Task from "../components/Task";

import { filters } from '../utils/filters';
import styles from './styles.module.scss';


const App = () => {
	const [allComplete, setAllComplete] = useState(false);
	const [filter, setFilter] = useState(filters.ALL);
	const [nextTaskId, setNextTaskId] = useState(0);
	const [tasksRemaining, setTasksRemaining] = useState(0);
	const [tasks, setTasks] = useLocalStorage('tasks', []);

	const hasChildren = (currentTask) => Array.isArray(currentTask.children) && currentTask.children.length > 0;

	const flattenTasks = (currentTasks) => {
		let result = [];

		currentTasks.forEach(currentTask => {
			result.push(currentTask);

			if (hasChildren(currentTask)) {
				result = result.concat(flattenTasks(currentTask.children));
			}
		});

		return result;
	};

	useEffect(() => {
		setTasksRemaining(flattenTasks(tasks).filter(task => !task.completed).length);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tasks]);

	const findTaskById = (id, parent) => {
		// eslint-disable-next-line no-restricted-syntax
		for (const task of parent) {
			if (task.id === id) {
				return task;
			}

			const found = findTaskById(id, task.children);
			if (found) {
				return found;
			}
		}

		return undefined;
	};

	const findIndex = (task, parent) => parent.findIndex(currentTask => currentTask === task);

	const findPreviousTask = (task, parentTasks) => {
		const parents = task.parent ? task.parent.children : parentTasks;
		const currentTaskIndex = findIndex(task, parents);
		return currentTaskIndex > 0 ? parents[currentTaskIndex - 1] : undefined;
	};

	const createTask = (title) => {
		const newTasks = [...tasks];
		const newTask = {
			title,
			completed: false,
			parent: undefined,
			previous: undefined,
			children: [],
			id: nextTaskId
		};

		newTasks.push(newTask);
		newTask.previous = findPreviousTask(newTask, newTasks);

		setTasks(newTasks);
		setNextTaskId(nextTaskId + 1);
	};

	const completeCascade = (task, isComplete) => {
		// eslint-disable-next-line no-param-reassign
		task.completed = isComplete;

		if (task.children) {
			task.children.forEach((child) => {
				completeCascade(child, isComplete);
			})
		}
	};

	const completeTask = (taskId, isComplete) => {
		const task = findTaskById(taskId, tasks);

		completeCascade(task, isComplete);

		setTasks([...tasks]);
	};

	const deleteTask = (taskId) => {
		const newTasks = [...tasks];
		const task = findTaskById(taskId, newTasks);

		if (task.parent) {
			task.parent.children = task.parent.children.filter(t => t.id !== task.id);
		}
		setTasks(newTasks.filter(t => t.id !== task.id));
	};

	const nestTask = (taskId) => {
		const newTasks = [...tasks];
		const task = findTaskById(taskId, newTasks);
		const previous = findPreviousTask(task, newTasks);

		if (previous) {
			const currentParents = task.parent ? task.parent.children :  newTasks;
			const currentTaskIndex = findIndex(task, currentParents);
			const newParent = previous;

			newParent.children.push(task);

			currentParents.splice(currentTaskIndex, 1);
			task.parent = newParent;
			task.previous = findPreviousTask(task, newParent);

			setTasks(newTasks);
		}
	};

	const unNestTask = (taskId) => {
		const newTasks = [...tasks];
		const task = findTaskById(taskId, newTasks);

		if (task.parent) {
			const currentTaskIndex = findIndex(task, task.parent.children);
			const newParent = task.parent.parent ? task.parent.parent.children :  newTasks;
			const currentParentIndex = findIndex(task.parent, newParent);

			if (newParent) {
				newParent.splice(currentParentIndex + 1, 0, task);
			}

			task.parent.children.splice(currentTaskIndex, 1);

			task.parent = task.parent.parent;
			task.previous = findPreviousTask(task, newParent);

			setTasks(newTasks);
		}
	};

	const changeFilter = (currentFilter) => setFilter(currentFilter);

	const isFilterActive = (currentFilter) => filter === currentFilter;

	const toggleAll = () => {
		const value = !allComplete;

		tasks.forEach(task => completeCascade(task, value));

		setAllComplete(value);
	};


	return (
		<div className={styles.mainContainer}>
			<div>
				<h1 className={styles.title}>todos</h1>
			</div>

			<div className={styles.todosContainer}>
				<div>
					<TaskCreator onCreateTask={createTask} />
				</div>
				<div>
					{ tasks.map((task, index) => (
						<Task
							filter={filter}
							task={task}
							onComplete={completeTask}
							onDelete={deleteTask}
							onNest={nestTask}
							onUnNest={unNestTask}
							key={index}
						/>
					)) }
				</div>

				<div className={styles.statusBar}>
					<span className="total-task-left">{tasksRemaining} items left</span>
					<div className={styles.filters}>

						<button
							className={classnames(styles.btn, isFilterActive(filters.ALL) ? styles.active : null)}
							onClick={() => changeFilter(filters.ALL)}>All</button>
						<button
							className={classnames(styles.btn, isFilterActive(filters.PENDING) ? styles.active : null)}
							onClick={() => changeFilter(filters.PENDING)}
						>Pending</button>
						<button
							className={classnames(styles.btn, isFilterActive(filters.COMPLETED) ? styles.active : null)}
							onClick={() => changeFilter(filters.COMPLETED)}
						>Completed</button>
					</div>
				</div>
				<div className={styles.actionBtns}>
					<button
						className={styles.btn}
						onClick={toggleAll}
					>Toggle All</button>
				</div>
			</div>
		</div>
	)};

export default App;
