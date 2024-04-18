import React, { useState, useEffect } from 'react'

export function useContainerDimensions(myRef: React.RefObject<HTMLDivElement>) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const getDimensions = () => ({
    width: (myRef && myRef.current?.offsetWidth) || 0,
    height: (myRef && myRef.current?.offsetHeight) || 0,
  })

  const handleResize = () => {
    setDimensions(getDimensions())
  }

  useEffect(() => {
    if (myRef && myRef.current) {
      setDimensions(getDimensions())
    }

    if (window) {
      handleResize()
      myRef.current?.addEventListener('resize', handleResize)
    }

    return () => {
      myRef.current?.removeEventListener('resize', handleResize)
    }
  }, [myRef])

  return dimensions
}
