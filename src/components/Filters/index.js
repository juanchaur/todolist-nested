import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import { filters } from '../../constants/filters';

import styles from './styles.module.scss';


const Filters = ({ tasksRemaining, filter, onChangeFilter }) => {
	const isFilterActive = (currentFilter) => filter === currentFilter;

	return (
		<div className={styles.filtersContainer}>
			<span>{tasksRemaining} items left</span>
			<div className={styles.filtersContainer__filterGroup}>

				{ Object.keys(filters).map((currentFilter, index) => (
					<Button
						isActive={isFilterActive(currentFilter)}
						onTrigger={() => onChangeFilter(currentFilter)}
						text={currentFilter}
						key={index}
					/>
				)) }
			</div>
		</div>
	);
};

Filters.propTypes = {
	tasksRemaining: PropTypes.number.isRequired,
	filter: PropTypes.string,
	onChangeFilter: PropTypes.func.isRequired
};

Filters.defaultProps = {
	filter: filters.ALL
};


export default Filters;
