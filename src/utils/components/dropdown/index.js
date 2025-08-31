import React, { useRef, useEffect, useState } from 'react';
import cx from 'classnames';
import Typography from '../typography';
import ChevronDownIcon from './assets/ChevronDownIcon';
import styles from './index.module.scss';

function DropDown({
    label,
    wrapperClassName,
    labelClassName,
    value,
    options,
    onClick,
    isEditable = true,
    dropdownWrapperClassName,
    dropdownClassName,
    classname
}) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (dropdownRef?.current) {
            window.addEventListener('mousedown', (e) => {
                if (!dropdownRef?.current?.contains(e.target)) {
                    setOpen(false);
                }
            });
        }
    }, []);

    function handleClick(e) {
        if (e.target?.nodeName.toLowerCase() === 'p') {
            onClick(e.target?.textContent);
            setOpen(false);
        }
    }

    if (!isEditable) {
        return (
            <div
                className={cx(
                    styles.wrapper,
                    styles.disabledwrapper,
                    wrapperClassName
                )}
            >
                <Typography
                    variant="reg-sm"
                    className={cx(styles.label, labelClassName)}
                    color=""
                >
                    {label}
                </Typography>
                <Typography
                    variant="lg-m"
                    className={cx(styles.label, labelClassName)}
                    color=""
                >
                    {value}
                </Typography>
            </div>
        );
    }

    return (
        <div
            className={cx(
                styles.wrapper,
                styles.enabledWrapper,
                wrapperClassName
            )}
            ref={dropdownRef}
        >
            <Typography
                variant="reg-sm-b"
                className={cx(styles.label, labelClassName)}
                color=""
            >
                {label}
            </Typography>
            <div
                id="clickbox"
                className={cx(
                    styles.button,
                    { [styles.disable]: !value },
                    classname
                )}
                onClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                    setOpen(!open);
                }}
            >
                <p className={cx(styles.value, { [styles.disable]: !value })}>
                    {value ? value : 'Select'}
                </p>
                <div className={cx(styles.icon, { [styles.rotate]: open })}>
                    <ChevronDownIcon />
                </div>
            </div>
            <div
                className={cx(styles.dropdownWrapper, dropdownWrapperClassName)}
            >
                <div
                    className={cx(
                        styles.dropdown,
                        { [styles.enable]: open },
                        dropdownClassName
                    )}
                    onClick={handleClick}
                >
                    {options?.map(({ value: option, id }) => (
                        <Typography
                            key={id}
                            variant="reg"
                            className={cx(
                                styles.option,
                                { [styles.visible]: open },
                                { [styles.selected]: value === option },
                                labelClassName
                            )}
                            color=""
                        >
                            {option}
                        </Typography>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DropDown;
