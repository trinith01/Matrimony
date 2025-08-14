"use client"

import { Check, Pencil, Trash2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function PlanTable({ plans, onDelete, onUpdate }) {
  // Boolean features to display as badges
  const booleanFeatures = [
    { key: "blurred_profile_photos", label: "Blurred Photos" },
    { key: "ads_free", label: "Ads Free" },
    { key: "priority_customer_support", label: "Priority Support" },
    { key: "profile_verification_badge", label: "Verification Badge" },
    { key: "access_to_webinars", label: "Webinars Access" },
    { key: "consultant", label: "Consultant" },
    { key: "offline_events", label: "Offline Events" },
    { key: "photo_shoot", label: "Photo Shoot" },
    { key: "background_checks", label: "Background Checks" },
    { key: "money_back_guarantee", label: "Money Back Guarantee" },
  ]

  // Numeric features to display in the table
  const numericFeatures = [
    { key: "interests_per_day", label: "Interests/Day" },
    { key: "profile_views_per_day", label: "Profile Views/Day" },
    { key: "profile_boosts_per_month", label: "Boosts/Month" },
  ]

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px] font-bold">Plan Name</TableHead>
              <TableHead className="w-[120px] font-bold">Monthly Price</TableHead>
              <TableHead className="w-[120px] font-bold">Yearly Price</TableHead>
              <TableHead className="font-bold">Features</TableHead>
              {numericFeatures.map((feature) => (
                <TableHead key={feature.key} className="text-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="cursor-help">{feature.label}</TooltipTrigger>
                      <TooltipContent>
                        <p>{feature.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan._id}>
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell>Rs.{plan.monthly_price.toFixed(2)}</TableCell>
                <TableCell>Rs.{plan.yearly_price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1.5 max-w-md">
                    {booleanFeatures.map((feature) => (
                      <Badge
                        key={feature.key}
                        variant={plan[feature.key] ? "default" : "outline"}
                        className={
                          plan[feature.key]
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-100"
                        }
                      >
                        {plan[feature.key] ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                        {feature.label}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                {numericFeatures.map((feature) => (
                  <TableCell key={feature.key} className="text-center">
                    {plan[feature.key]}
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => onUpdate(plan)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => onDelete(plan._id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
