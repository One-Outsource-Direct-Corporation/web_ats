// src/components/ShareModal.tsx

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ShareModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  link: string
}

export function ShareModal({ open, onOpenChange, link }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Published Position</DialogTitle>
          <DialogDescription>Here's a shareable link to this job post:</DialogDescription>
        </DialogHeader>

        <Input readOnly value={link} className="bg-gray-100" />
        <Button onClick={handleCopy} className="mt-2 bg-[#0056d2]">
          {copied ? "Copied!" : "Copy Link"}
        </Button>
        <p className="text-xs text-gray-500 text-center mt-1">
          This link is public and anyone with it can view the job posting.
        </p>
      </DialogContent>
    </Dialog>
  )
}
