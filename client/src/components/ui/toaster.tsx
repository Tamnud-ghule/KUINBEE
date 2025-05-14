// File: client/src/components/ui/Toaster.tsx
import React from "react"
import { ToastProvider, ToastViewport } from "@radix-ui/react-toast"

export function Toaster() {
  return (
    <>
      <ToastProvider>
        <ToastViewport />
      </ToastProvider>
      <style>{`
        .ToastViewport {
          position: fixed;
          bottom: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          padding: var(--space-2);
          gap: 10px;
          width: 390px;
          max-width: 100vw;
          margin: 0;
          list-style: none;
          z-index: 2147483647;
          outline: none;
        }
      `}</style>
    </>
  )
}