"use client"

import { useEffect, useState } from "react"
import { FaCheckCircle, FaSpinner } from "react-icons/fa"
import "./SuccessModal.css"

const SuccessModal = ({ message, onClose, duration = 1000, loadingDuration = 500 }) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Primero mostrar el spinner por loadingDuration
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
    }, loadingDuration)

    // Después de mostrar el éxito, cerrar el modal después de duration
    const closeTimer = setTimeout(() => {
      onClose()
    }, loadingDuration + duration)

    return () => {
      clearTimeout(loadingTimer)
      clearTimeout(closeTimer)
    }
  }, [onClose, duration, loadingDuration])

  return (
    <div className="success-modal-overlay">
      <div className="success-modal">
        {isLoading ? (
          <>
            <FaSpinner className="loading-icon" />
            <p>Procesando...</p>
          </>
        ) : (
          <>
            <FaCheckCircle className="success-icon" />
            <p>{message}</p>
          </>
        )}
      </div>
    </div>
  )
}

export default SuccessModal

