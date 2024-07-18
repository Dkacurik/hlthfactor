import React, { useContext } from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { Context } from '../context'

const LoaderPage = () => {
  const context = useContext(Context)

  if (!context) {
    throw new Error('useClient must be used within a ClientProvider')
  }

  const { isLoad } = context

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      {isLoad && (
        <div style={{ textAlign: 'center' }}>
          <CircularProgress size={80} thickness={4} className="text-primary" />
          <Typography variant="h6" style={{ marginTop: 20 }}>
            Načítavam...
          </Typography>
        </div>
      )}
    </div>
  )
}

export default LoaderPage
