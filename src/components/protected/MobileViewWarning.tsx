'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Monitor } from 'lucide-react'

const MOBILE_WARNING_KEY = 'mobile-warning-dismissed'

export function MobileWarning() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if user is on mobile
    const checkIfMobile = () => {
      const isMobileDevice = window.innerWidth < 768 // Tailwind's md breakpoint
      setIsMobile(isMobileDevice)
      return isMobileDevice
    }

    // Check if warning was previously dismissed
    const wasDismissed = localStorage.getItem(MOBILE_WARNING_KEY)

    if (checkIfMobile() && !wasDismissed) {
      // Show warning after a short delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 500)

      return () => clearTimeout(timer)
    }

    // Re-check on resize
    const handleResize = () => {
      const mobile = checkIfMobile()
      if (!mobile && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  const handleDismiss = () => {
    localStorage.setItem(MOBILE_WARNING_KEY, 'true')
    setIsOpen(false)
  }

  const handleContinue = () => {
    setIsOpen(false)
  }

  if (!isMobile) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleContinue()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Monitor className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">
            Best Viewed on Desktop
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            This application is optimized for desktop viewing. For the best experience with
            full features and better navigation, we recommend switching to a desktop or laptop
            computer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-col gap-4 mt-4">
          <Button
            onClick={handleDismiss}
            className="w-full text-white"
            variant="default"
          >
            Got it, don&apos;t show again
          </Button>
          <Button
            onClick={handleContinue}
            className="w-full"
            variant="outline"
          >
            Continue anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}