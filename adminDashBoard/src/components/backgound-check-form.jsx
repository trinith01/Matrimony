"use client"



import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"



export function BackgroundCheckDialog({ open, onClose, onSave, initialData, isReviewed }) {
  const [formData, setFormData] = useState(initialData)

  // Update form data when initialData changes
  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    console.log("formdata", formData)
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isReviewed ? "Edit Background Check Details" : "Enter Background Check Details"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="maritalStatus">Marital Status</Label>
              <Input
                id="maritalStatus"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                placeholder="Enter marital status"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="criminalStatus">Criminal Status</Label>
              <Input
                id="criminalStatus"
                name="criminalStatus"
                value={formData.criminalStatus}
                onChange={handleChange}
                placeholder="Enter criminal status"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="marriedStatus">Employeement Details</Label>
              <Input
                id="marriedStatus"
                name="employmentCheck"
                value={formData.employmentCheck}
                onChange={handleChange}
                placeholder="Enter married status"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{isReviewed ? "Update Details" : "Save Details"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
