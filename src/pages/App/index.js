import React, { useState, useEffect } from 'react';
import classnames from 'classnames';

import TaskCreator from '../../components/TaskCreator';
import styles from './styles.module.scss';
import Task from "../../components/Task";

const App = () => {
	const [tasksRemaining, setTasksRemaining] = useState(0);
	const [tasks, setTasks] = useState([
		{
			title: "Grab some Pizza",
			completed: true,
			children: []
		},
		{
			title: "Do your workout",
			completed: true,
			children: []
		},
		{
			title: "Hangout with friends",
			completed: false,
			children: []
		}
	]);

	useEffect(() => {
		setTasksRemaining(tasks.filter(task => !task.completed).length)
	});

	const createTask = (title) => {
		const newTasks = [...tasks, { title, completed: false, children: [] }];

		setTasks(newTasks);
	};

	const completeTask = (value, index) => {
		const newTasks = [...tasks];
		newTasks[index].completed = value;
		setTasks(newTasks);
	};

	const removeTask = index => {
		const newTasks = [...tasks];
		newTasks.splice(index, 1);
		setTasks(newTasks);
	};

	const renderTasks = () => {
		return (
			tasks.map((task, index) => (
				<Task
					task={task}
					index={index}
					onComplete={completeTask}
					onDelete={removeTask}
					onNest={() => {
						console.log(task);
						console.log(index);
					}}
					key={index}
				/>
			))
		);
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
					{ renderTasks() }
				</div>

				<div className={styles.statusBar}>
					<span className="total-task-left">{tasksRemaining} items left</span>
					<div className={styles.filters}>
						<button className={classnames(styles.btn, styles.active)}>All</button>
						<button className={styles.btn}>Pending</button>
						<button className={styles.btn}>Completed</button>
					</div>
				</div>
				<div className={styles.actionBtns}>
					<button className={styles.btn}>Toggle All</button>
					<button className={styles.btn}>Clear completed</button>
				</div>
			</div>
		</div>
	)};

export default App;
