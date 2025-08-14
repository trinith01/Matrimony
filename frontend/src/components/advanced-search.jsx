"use client";

import { useState, useContext } from "react";
import { AuthContext } from "@/lib/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, Filter, Search } from "lucide-react";

export function AdvancedSearch({ onFilterChange }) {
  const { user: authUser } = useContext(AuthContext);
  // Debug logs
  console.log("authUser in AdvancedSearch:", authUser);
  // Free user: subscription_plan is "free" (case-insensitive), undefined, or null
  const isFreeUser = authUser?.subscription_plan?.name === "Free";
  console.log("isFreeUser:", isFreeUser);
  console.log("subscription_plan:", authUser?.subscription_plan);

  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    ageRange: [18, 70],
    religion: "",
    location: "",
    education: "",
    occupation: "",
    income: "",
  });

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    // Map "any" to "" for compatibility with HomePage.jsx
    const formattedFilters = {
      ...newFilters,
      religion: newFilters.religion === "any" ? "" : newFilters.religion,
      location: newFilters.location === "any" ? "" : newFilters.location,
      education: newFilters.education === "any" ? "" : newFilters.education,
      occupation: newFilters.occupation === "any" ? "" : newFilters.occupation,
      income: newFilters.income === "any" ? "" : newFilters.income,
    };
    onFilterChange(formattedFilters);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Map "any" to "" for compatibility with HomePage.jsx
    const formattedFilters = {
      ...filters,
      religion: filters.religion === "any" ? "" : filters.religion,
      location: filters.location === "any" ? "" : filters.location,
      education: filters.education === "any" ? "" : filters.education,
      occupation: filters.occupation === "any" ? "" : filters.occupation,
      income: filters.income === "any" ? "" : filters.income,
    };
    onFilterChange(formattedFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      ageRange: [18, 70],
      religion: "",
      location: "",
      education: "",
      occupation: "",
      income: "",
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <Card className="w-full rounded-2xl border-none shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-800 to-red-600 p-4 sm:p-5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Advanced Search
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleExpand}
          className="text-white hover:bg-red-700/30 rounded-full px-3 sm:px-4"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
              <span className="text-sm sm:text-base">Hide</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
              <span className="text-sm sm:text-base">Show</span>
            </>
          )}
        </Button>
      </div>

      {/* Filters Content */}
      {isExpanded && (
        <CardContent className="p-4 sm:p-6 bg-white">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {/* Age Range - Always visible */}
              <div className="space-y-3">
                <Label className="text-sm sm:text-base font-medium text-gray-700">
                  Age Range
                </Label>
                <div className="pt-2">
                  <Slider
                    defaultValue={[18, 70]}
                    max={70}
                    min={18}
                    step={1}
                    value={filters.ageRange}
                    onValueChange={(value) =>
                      handleFilterChange("ageRange", value)
                    }
                    className="my-4 [&>span]:bg-red-800"
                  />
                  <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                    <span>{filters.ageRange[0]} yrs</span>
                    <span>{filters.ageRange[1]} yrs</span>
                  </div>
                </div>
              </div>

              {/* Location - Always visible */}
              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-sm sm:text-base font-medium text-gray-700"
                >
                  Location
                </Label>
                <Select
                  value={filters.location}
                  onValueChange={(value) =>
                    handleFilterChange("location", value)
                  }
                >
                  <SelectTrigger
                    id="location"
                    className="rounded-lg border-gray-300"
                  >
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="Colombo">Colombo</SelectItem>
                    <SelectItem value="Kandy">Kandy</SelectItem>
                    <SelectItem value="Galle">Galle</SelectItem>
                    <SelectItem value="Jaffna">Jaffna</SelectItem>
                    <SelectItem value="Batticaloa">Batticaloa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Religion - Always visible */}
              <div className="space-y-2">
                <Label
                  htmlFor="religion"
                  className="text-sm sm:text-base font-medium text-gray-700"
                >
                  Religion
                </Label>
                <Select
                  value={filters.religion}
                  onValueChange={(value) =>
                    handleFilterChange("religion", value)
                  }
                >
                  <SelectTrigger
                    id="religion"
                    className="rounded-lg border-gray-300"
                  >
                    <SelectValue placeholder="Select religion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="Buddhism">Buddhism</SelectItem>
                    <SelectItem value="Hinduism">Hinduism</SelectItem>
                    <SelectItem value="Islam">Islam</SelectItem>
                    <SelectItem value="Christianity">Christianity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Education - Hidden for Free users */}
              {!isFreeUser && (
                <div className="space-y-2">
                  <Label
                    htmlFor="education"
                    className="text-sm sm:text-base font-medium text-gray-700"
                  >
                    Education
                  </Label>
                  <Select
                    value={filters.education}
                    onValueChange={(value) =>
                      handleFilterChange("education", value)
                    }
                  >
                    <SelectTrigger
                      id="education"
                      className="rounded-lg border-gray-300"
                    >
                      <SelectValue placeholder="Select education" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="High School">High School</SelectItem>
                      <SelectItem value="Diploma">Diploma</SelectItem>
                      <SelectItem value="Bachelor's Degree">
                        Bachelor's Degree
                      </SelectItem>
                      <SelectItem value="Master's Degree">
                        Master's Degree
                      </SelectItem>
                      <SelectItem value="PhD">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Occupation - Hidden for Free users */}
              {!isFreeUser && (
                <div className="space-y-2">
                  <Label
                    htmlFor="occupation"
                    className="text-sm sm:text-base font-medium text-gray-700"
                  >
                    Occupation
                  </Label>
                  <Select
                    value={filters.occupation}
                    onValueChange={(value) =>
                      handleFilterChange("occupation", value)
                    }
                  >
                    <SelectTrigger
                      id="occupation"
                      className="rounded-lg border-gray-300"
                    >
                      <SelectValue placeholder="Select occupation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="IT & Software">
                        IT & Software
                      </SelectItem>
                      <SelectItem value="Medical & Healthcare">
                        Medical & Healthcare
                      </SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Business & Finance">
                        Business & Finance
                      </SelectItem>
                      <SelectItem value="Government">Government</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Income - Hidden for Free users */}
              {!isFreeUser && (
                <div className="space-y-2">
                  <Label
                    htmlFor="income"
                    className="text-sm sm:text-base font-medium text-gray-700"
                  >
                    Annual Income
                  </Label>
                  <Select
                    value={filters.income}
                    onValueChange={(value) =>
                      handleFilterChange("income", value)
                    }
                  >
                    <SelectTrigger
                      id="income"
                      className="rounded-lg border-gray-300"
                    >
                      <SelectValue placeholder="Select income range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="0-100000">Below 100,000</SelectItem>
                      <SelectItem value="100000-300000">
                        100,000 - 300,000
                      </SelectItem>
                      <SelectItem value="300000-500000">
                        300,000 - 500,000
                      </SelectItem>
                      <SelectItem value="500000-1000000">
                        500,000 - 1,000,000
                      </SelectItem>
                      <SelectItem value="1000000+">Above 1,000,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end mt-6 gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto text-red-800 border-red-800 hover:bg-red-800/10 hover:text-red-900 rounded-lg text-sm sm:text-base transition-colors duration-200"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white rounded-lg text-sm sm:text-base transition-all duration-200 shadow-md"
              >
                <Search className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </form>
        </CardContent>
      )}
    </Card>
  );
}
