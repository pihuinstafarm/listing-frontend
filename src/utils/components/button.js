import React from 'react'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

const variants = {
    primary: '#3b4a5d',
    secondary: '#f07f6d',
    alert: '#F64E60',
}

function CustomizedButton({
    disabled = false,
    loading = false,
    dataTestId = 'button',
    label,
    variant = 'primary',
    width,
    className,
    onClick,
    children,
}) {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const border = !disabled ? '1px solid ' + variants[variant] : ''

    return (
        <Button
            data-testid={dataTestId}
            disabled={disabled}
            className={className}
            variant="contained"
            sx={{
                width: width ? `${width}px` : 'auto',
                minWidth: 0,
                height: {
                    xs: '32px',
                    md: '40px',
                },
                border,
                color: variants[variant],
                borderRadius: isMobile ? '6px' : '10px !important',
                backgroundColor: '#fff',
                fontFamily: 'LexendDeca',
                fontSize: {
                    xs: '10px',
                    md: '12px',
                },
                letterSpacing: '0.8px',
                transition: 'all 0.15s ease-in',
                scale: '1',
                textTransform: 'none',
                boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.3)',
                '&:hover': {
                    backgroundColor: '#fff',
                    border,
                    scale: '1.02',
                },
            }}
            onClick={onClick}
        >
            {loading ? (
                <CircularProgress
                    data-testid="loader"
                    size={isMobile ? 12 : 20}
                    color="primary"
                    thickness={4}
                    sx={{
                        '& .MuiCircularProgress-colorPrimary': {
                            color: '#F07F6D !important',
                        },
                    }}
                />
            ) : label ? (
                label
            ) : (
                children
            )}
        </Button>
    )
}

export default CustomizedButton
