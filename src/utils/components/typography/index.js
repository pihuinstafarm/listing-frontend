import React from 'react';
import cx from 'classnames';
import styles from './index.module.scss';

const Typography = ({ variant, className, color, children }) => {
    return (
        <p className={cx(styles[variant], styles[color], className)}>
            {children}
        </p>
    );
};

export default Typography;
