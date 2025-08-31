import React from 'react';
import cx from 'classnames';
import styles from './index.module.scss';
import Typography from '../typography';

const Input = ({
    label,
    name,
    wrapperClassName,
    isEditable,
    inputClassName,
    labelClassName,
    onChange,
    value,
    type,
    ...rest
}) => {
    if (!isEditable) {
        return (
            <div className={cx(styles.inputContainer, wrapperClassName)}>
                <Typography
                    variant="reg-sm"
                    className={cx(styles.label, labelClassName)}
                    color=""
                >
                    {label}
                </Typography>
                <Typography
                    variant="lg-m"
                    className={cx(styles.label, inputClassName)}
                    color=""
                >
                    {value}
                </Typography>
            </div>
        );
    }
    function handleChange(e) {
        if (type === 'tel') e.target.value = e.target.value.replace(/\D/g, '');
        onChange(e);
    }
    return (
        <div
            className={cx(styles.inputContainer, wrapperClassName)}
            key={`wrapper-${name}`}
        >
            <label htmlFor={name}>
                <Typography
                    variant="reg-sm-m"
                    className={cx(styles.label, labelClassName)}
                    color="#262626"
                >
                    {label}
                </Typography>
            </label>
            <input
                className={cx(styles.inputClass, inputClassName)}
                key={name}
                id={name}
                name={name}
                value={value}
                onChange={handleChange}
                {...rest}
            ></input>
        </div>
    );
};

export default Input;
