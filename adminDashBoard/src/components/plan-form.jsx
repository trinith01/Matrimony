"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

// Default empty plan
const emptyPlan = {
  name: "",
  monthly_price: 0,
  yearly_price: 0,
  blurred_profile_photos: false,
  ads_free: false,
  interests_per_day: 3,
  profile_views_per_day: 5,
  horoscope_matching: "no",
  priority_customer_support: false,
  profile_verification_badge: false,
  profile_boosts_per_month: 0,
  access_to_webinars: false,
  consultant: false,
  offline_events: false,
  photo_shoot: false,
  background_checks: false,
  money_back_guarantee: false,
  checkable_contact_details: [],
  filters: [{ age: "", religion: "", district: "" }],
}

export function PlanForm({ initialData = emptyPlan, onSubmit, onCancel, isUpdate = false }) {
  const [formData, setFormData] = useState(initialData)

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleCheckboxChange = (field, checked) => {
    setFormData({ ...formData, [field]: checked })
  }

  const handleContactDetailsChange = (detail, checked) => {
    let updatedDetails = [...formData.checkable_contact_details]

    if (checked && !updatedDetails.includes(detail)) {
      updatedDetails.push(detail)
    } else if (!checked && updatedDetails.includes(detail)) {
      updatedDetails = updatedDetails.filter((item) => item !== detail)
    }

    setFormData({ ...formData, checkable_contact_details: updatedDetails })
  }

  const handleFilterChange = (index, field, value) => {
    const updatedFilters = [...formData.filters]
    updatedFilters[index] = { ...updatedFilters[index], [field]: value }
    setFormData({ ...formData, filters: updatedFilters })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Plan Name</Label>
            <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
          </div>

          <div>
            <Label htmlFor="monthly_price">Monthly Price ($)</Label>
            <Input
              id="monthly_price"
              type="number"
              step="0.01"
              value={formData.monthly_price}
              onChange={(e) => handleChange("monthly_price", Number.parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          <div>
            <Label htmlFor="yearly_price">Yearly Price ($)</Label>
            <Input
              id="yearly_price"
              type="number"
              step="0.01"
              value={formData.yearly_price}
              onChange={(e) => handleChange("yearly_price", Number.parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          <div>
            <Label htmlFor="interests_per_day">Interests Per Day</Label>
            <Input
              id="interests_per_day"
              type="number"
              value={formData.interests_per_day}
              onChange={(e) => handleChange("interests_per_day", Number.parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div>
            <Label htmlFor="profile_views_per_day">Profile Views Per Day</Label>
            <Input
              id="profile_views_per_day"
              type="number"
              value={formData.profile_views_per_day}
              onChange={(e) => handleChange("profile_views_per_day", Number.parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div>
            <Label htmlFor="profile_boosts_per_month">Profile Boosts Per Month</Label>
            <Input
              id="profile_boosts_per_month"
              type="number"
              value={formData.profile_boosts_per_month}
              onChange={(e) => handleChange("profile_boosts_per_month", Number.parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div>
            <Label htmlFor="horoscope_matching">Horoscope Matching</Label>
            <Select
              value={formData.horoscope_matching}
              onValueChange={(value) => handleChange("horoscope_matching", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="blurred_profile_photos"
                  checked={formData.blurred_profile_photos}
                  onCheckedChange={(checked) => handleCheckboxChange("blurred_profile_photos", checked)}
                />
                <Label htmlFor="blurred_profile_photos">Blurred Profile Photos</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ads_free"
                  checked={formData.ads_free}
                  onCheckedChange={(checked) => handleCheckboxChange("ads_free", checked)}
                />
                <Label htmlFor="ads_free">Ads Free</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="priority_customer_support"
                  checked={formData.priority_customer_support}
                  onCheckedChange={(checked) => handleCheckboxChange("priority_customer_support", checked)}
                />
                <Label htmlFor="priority_customer_support">Priority Customer Support</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="profile_verification_badge"
                  checked={formData.profile_verification_badge}
                  onCheckedChange={(checked) => handleCheckboxChange("profile_verification_badge", checked)}
                />
                <Label htmlFor="profile_verification_badge">Profile Verification Badge</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="access_to_webinars"
                  checked={formData.access_to_webinars}
                  onCheckedChange={(checked) => handleCheckboxChange("access_to_webinars", checked)}
                />
                <Label htmlFor="access_to_webinars">Access to Webinars</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consultant"
                  checked={formData.consultant}
                  onCheckedChange={(checked) => handleCheckboxChange("consultant", checked)}
                />
                <Label htmlFor="consultant">Consultant</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="offline_events"
                  checked={formData.offline_events}
                  onCheckedChange={(checked) => handleCheckboxChange("offline_events", checked)}
                />
                <Label htmlFor="offline_events">Offline Events</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="photo_shoot"
                  checked={formData.photo_shoot}
                  onCheckedChange={(checked) => handleCheckboxChange("photo_shoot", checked)}
                />
                <Label htmlFor="photo_shoot">Photo Shoot</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="background_checks"
                  checked={formData.background_checks}
                  onCheckedChange={(checked) => handleCheckboxChange("background_checks", checked)}
                />
                <Label htmlFor="background_checks">Background Checks</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="money_back_guarantee"
                  checked={formData.money_back_guarantee}
                  onCheckedChange={(checked) => handleCheckboxChange("money_back_guarantee", checked)}
                />
                <Label htmlFor="money_back_guarantee">Money Back Guarantee</Label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Checkable Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contact_phone"
                  checked={formData.checkable_contact_details.includes("phone")}
                  onCheckedChange={(checked) => handleContactDetailsChange("phone", checked)}
                />
                <Label htmlFor="contact_phone">Phone</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contact_email"
                  checked={formData.checkable_contact_details.includes("email")}
                  onCheckedChange={(checked) => handleContactDetailsChange("email", checked)}
                />
                <Label htmlFor="contact_email">Email</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contact_social"
                  checked={formData.checkable_contact_details.includes("social")}
                  onCheckedChange={(checked) => handleContactDetailsChange("social", checked)}
                />
                <Label htmlFor="contact_social">Social Media</Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">Filters</h3>
        {formData.filters.map((filter, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor={`age-${index}`}>Age Range</Label>
              <Input
                id={`age-${index}`}
                value={filter.age}
                onChange={(e) => handleFilterChange(index, "age", e.target.value)}
                placeholder="e.g., 18-30"
              />
            </div>

            <div>
              <Label htmlFor={`religion-${index}`}>Religion</Label>
              <Input
                id={`religion-${index}`}
                value={filter.religion}
                onChange={(e) => handleFilterChange(index, "religion", e.target.value)}
                placeholder="e.g., Any, Hindu, Christian"
              />
            </div>

            <div>
              <Label htmlFor={`district-${index}`}>District</Label>
              <Input
                id={`district-${index}`}
                value={filter.district}
                onChange={(e) => handleFilterChange(index, "district", e.target.value)}
                placeholder="e.g., Any, North, South"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isUpdate ? "Update Plan" : "Create Plan"}</Button>
      </div>
    </form>
  )
}
