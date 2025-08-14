"use client";

import { useState } from "react";
import { PlanForm } from "@/components/plan-form";
import { PlanTable } from "@/components/plan-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import api from "@/services/api";
import { toast } from "sonner";

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get("/plan");

        setPlans(response.data);
        console.log("plans", response.data);
      } catch (error) {
        console.log("Error fetching plans:", error);
      }
    };

    fetchPlans();
  }, []);

  const handleAddPlan = async (newPlan) => {
    try {
      const addPlan = async () => {
        try {
          const response = await api.post("/plan", newPlan);
          toast.success(response.data.message);
          console.log(response.data);
        } catch (error) {
          console.log("Error adding plan:", error);
        }
      };
      addPlan();
    } catch (error) {
      console.log("Error adding plan:", error);
    }
    setPlans([...plans, { ...newPlan, id: Date.now().toString() }]);
    setIsAddOpen(false);
  };

  const handleUpdatePlan = async (updatedPlan) => {
    try {
      const updatePlan = async () => {
        try {
          const response = await api.put(
            `/plan/${updatedPlan._id}`,
            updatedPlan
          );
          console.log(response.data);
        } catch (error) {
          console.error("Error updating plan:", error);
        }
      };
      updatePlan();
    } catch (error) {
      console.error("Error updating plan:", error);
    }
    setPlans(
      plans.map((plan) => (plan._id === updatedPlan._id ? updatedPlan : plan))
    );
    setIsUpdateOpen(false);
    setCurrentPlan(null);
  };

  const handleDeletePlan = async (id) => {
    try {
      const res = await api.delete(`/plan/${id}`);
      toast.success(res.data.message);
      console.log(res.data);
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
    // Call the API to delete the plan
    setPlans(plans.filter((plan) => plan._id !== id));
  };

  const openUpdateDialog = (plan) => {
    setCurrentPlan(plan);
    setIsUpdateOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Subscription Plans</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Plan</DialogTitle>
              <DialogDescription>
                Create a new subscription plan with the details below.
              </DialogDescription>
            </DialogHeader>
            <PlanForm
              onSubmit={handleAddPlan}
              onCancel={() => setIsAddOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <PlanTable
        plans={plans}
        onDelete={handleDeletePlan}
        onUpdate={openUpdateDialog}
      />

      {/* Update Plan Dialog */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Plan</DialogTitle>
            <DialogDescription>
              Update the details for this subscription plan.
            </DialogDescription>
          </DialogHeader>
          {currentPlan && (
            <PlanForm
              initialData={currentPlan}
              onSubmit={handleUpdatePlan}
              onCancel={() => setIsUpdateOpen(false)}
              isUpdate
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
