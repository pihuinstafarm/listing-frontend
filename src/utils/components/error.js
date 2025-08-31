import React from 'react'
import { Snackbar, Alert, AlertTitle } from '@mui/material'

function Error({ error, resetError }) {
    return (
        <Snackbar
            open={error?.length ? true : false}
            autoHideDuration={6000}
            onClose={resetError}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert onClose={resetError} severity="error" sx={{ width: '100%' }}>
                <AlertTitle>Error</AlertTitle>
                {error}
            </Alert>
        </Snackbar>
    )
}

export default Error
