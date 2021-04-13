import React, { useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

import TaskCreator from '../components/TaskCreator';
import Task from '../components/Task';
import Filters from '../components/Filters'
import Button from '../components/Button';

import { flattenArrayByProp, findIndex, findById } from '../utils/array';

import { filters } from '../constants/filters';
import styles from './styles.module.scss';


const App = () => {
	const [allComplete, setAllComplete] = useLocalStorage('allComplete', false);
	const [filter, setFilter] = useLocalStorage('filter', filters.ALL);
	const [nextTaskId, setNextTaskId] = useLocalStorage('nextTaskId', 0);
	const [tasksRemaining, setTasksRemaining] = useLocalStorage('tasksRemaining', 0);
	const [tasks, setTasks] = useLocalStorage('tasks', []);

	useEffect(() => {
		setTasksRemaining(
			flattenArrayByProp(tasks, 'children')
				.filter(task => !task.completed).length
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tasks]);

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
		const task = findById(taskId, tasks, 'children');

		completeCascade(task, isComplete);

		setTasks([...tasks]);
	};

	const deleteTask = (taskId) => {
		const newTasks = [...tasks];
		const task = findById(taskId, newTasks, 'children');

		if (task.parent) {
			task.parent.children = task.parent.children.filter(t => t.id !== task.id);
		}
		setTasks(newTasks.filter(t => t.id !== task.id));
	};

	const nestTask = (taskId) => {
		const newTasks = [...tasks];
		const task = findById(taskId, newTasks, 'children');
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
		const task = findById(taskId, newTasks, 'children');

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

	const toggleAll = () => {
		const newTasks = [...tasks];
		const value = !allComplete;

		newTasks.forEach(task => completeCascade(task, value));

		setAllComplete(value);

		setTasks(newTasks);
	};

	const changeFilter = (currentFilter) => setFilter(currentFilter);

	return (
		<div className={styles.todoApp}>
			<header>
				<h1 className={styles.todoApp__title}>todos</h1>
			</header>

			<div className={styles.todoApp__paperContainer}>
				<TaskCreator onCreateTask={createTask} />

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

				<Filters
					filter={filter}
					tasksRemaining={tasksRemaining}
					onChangeFilter={changeFilter}
				/>

				<div className={styles.todoApp__paperContainer__actionBtns}>
					<Button
						onTrigger={toggleAll}
						text="Toggle All"
						key="toggleAll"
					/>
				</div>
			</div>
		</div>
	)};

export default App;
