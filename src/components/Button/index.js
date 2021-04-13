import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './styles.module.scss';

const Button = ({ text, onTrigger, isActive }) => {
	return (
		<button
			className={classnames(styles.btn, isActive ? styles['btn--active'] : null)}
			onClick={onTrigger}>{text}</button>
	);
};

Button.propTypes = {
	text: PropTypes.string.isRequired,
	isActive: PropTypes.bool,
	onTrigger: PropTypes.func.isRequired,
};

Button.defaultProps = {
	isActive: false
};

export default Button;
