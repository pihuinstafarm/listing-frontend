import React from 'react'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

function CustomizedTextField({
    fullWidth = false,
    required = false,
    disabled = false,
    autofocus = false,
    type = 'text',
    placeholder,
    width,
    height,
    suffix,
    prefix,
    label,
    value,
    className,
    style,
    inputRef,
    onChange,
}) {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    return (
        <TextField
            disabled={disabled}
            inputRef={inputRef}
            type={type}
            data-testid="text-field"
            fullWidth={fullWidth}
            placeholder={placeholder}
            required={required}
            value={value}
            label={label}
            variant="outlined"
            autoComplete="off" 
            InputProps={{
                startAdornment: suffix ? (
                    <InputAdornment position="start">{suffix}</InputAdornment>
                ) : null,
                endAdornment: prefix ? (
                    <InputAdornment position="end">{prefix}</InputAdornment>
                ) : null,
            }}
            sx={{
                opacity: disabled ? '0.4' : '1',
                width: width ? `${width}px` : 'auto',
                height: height ? `${height}px` : '40px',
                backgroundColor: '#fff',
                borderRadius: '8px !important',
                border: '1px solid #8C684D',
                letterSpacing: '0.8px !important',
                '& .MuiFormLabel-root': {
                    color: '#8C684D !important',
                    fontSize: {
                        xs: '14px',
                        md: '16px',
                    },
                    lineHeight: '16px',
                    '@media(minWidth: 780px)': {
                        border: '1px solid red',
                    },
                },
                '& .MuiOutlinedInput-root': {
                    height: height ? `${height}px` : '50px',
                    borderRadius: '8px !important',
                    fontSize: {
                        xs: '14px',
                        md: '16px',
                    },
                },
                '& .Mui-focused': {
                    color: '#8C684D !important',
                    // padding: '4px 12px',
                },
                '& .MuiInputLabel-shrink': {
                    color: '#8C684D !important',
                    backgroundColor: '#fff',
                    padding: '4px 12px',
                    borderRadius: '10px',
                    fontSize: {
                        xs: '14px',
                        md: '16px',
                    },
                    letterSpacing: '0.8px !important',
                },
                '& .MuiInputBase-input': {
                    color: '#8C684D',
                    height: '0px!important',
                    letterSpacing: '0.8px !important',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                    color: '#8C684D',
                },
                '& .MuiTypography-root': {
                    color: '#8C684D !important',
                    fontSize: {
                        xs: '14px',
                        md: '16px',
                    },
                    letterSpacing: '0.8px !important',
                },
                ...style,
            }}
            className={className}
            onChange={onChange}
        />
    )
}

export default CustomizedTextField
