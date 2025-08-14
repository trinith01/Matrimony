"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/services/api";

// Validation schema for the registration form
const registerSchema = z
  .object({
    name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[^0-9]*$/, "Name should not contain letters"),

  email: z
    .string()
    .email("Please enter a valid email address")
    .regex(/^[\w.+-]+@gmail\.com$/, "Email must be a valid gmail address"),
    phone: z.string()
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must not exceed 15 digits")
        .regex(/^[+0-9]+$/, "Phone number can only contain digits and '+' sign"),
    birthDay: z.string().min(1, "Required"),
    birthMonth: z.string().min(1, "Required"),
    birthYear: z.string().min(1, "Required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    gender: z.string().min(1, "Please select your gender"),
    religion: z.string().min(1, "Please select your religion"),
    caste: z.string().min(1, "Please enter your caste"),
    mother_tongue: z.string().min(1, "Please select your mother tongue"),
    occupation: z.string().min(1, "Please enter your occupation"),
    education: z.string().min(1, "Please select your education"),
    income: z.coerce.number().min(1, "Please enter your income"),
    city: z.string().min(1, "Please enter your city"),
    country: z.string().min(1, "Please select your country"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      // Validate that the date is valid
      const day = Number.parseInt(data.birthDay);
      const month = Number.parseInt(data.birthMonth) - 1; // JS months are 0-indexed
      const year = Number.parseInt(data.birthYear);

      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return false;
      }

      const date = new Date(year, month, day);

      // Check if the date is valid and not in the future
      return (
        date.getDate() === day &&
        date.getMonth() === month &&
        date.getFullYear() === year &&
        date <= new Date()
      );
    },
    {
      message: "Please enter a valid date of birth",
      path: ["birthDay"],
    }
  );

export function RegisterForm({ onSwitchToLogin, onRegisterSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailForOtp, setEmailForOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      birthDay: "",
      birthMonth: "",
      birthYear: "",
      password: "",
      confirmPassword: "",
      gender: "",
      religion: "",
      caste: "",
      mother_tongue: "",
      occupation: "",
      education: "",
      income: 0,
      city: "",
      country: "",
    },
  });

  // Generate arrays for days, months, and years
  const days = Array.from({ length: 31 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) =>
    (currentYear - i).toString()
  );

   function onSubmit(values) {
    try {
      // Create a date object from the separate date inputs
      const day = Number.parseInt(values.birthDay);
      const month = Number.parseInt(values.birthMonth) - 1; // JS months are 0-indexed
      const year = Number.parseInt(values.birthYear);
      const date_of_birth = new Date(year, month, day);
      const isoDateOfBirth = date_of_birth.toISOString();

      // Transform the data to match your backend schema
      const formattedData = {
        ...values,
        birthday: isoDateOfBirth,
        password: values.password, // Note: In a real app, you'd hash this on the server
        location: {
          city: values.city,
          country: values.country,
        },
      };

      // Remove fields not needed in the API request
      delete formattedData.confirmPassword;
      delete formattedData.birthDay;
      delete formattedData.birthMonth;
      delete formattedData.birthYear;
      delete formattedData.city;
      delete formattedData.country;

      console.log("Formatted Data:", formattedData);
       // Success
    
       form.reset();

     
      return formattedData;

     
     
    } catch (error) {
      // Handle errors
      console.error("Form submission error", error);
      toast.error("Failed to register. Please try again.");
    }
  }

  async function sendOtp(email) {
    setIsLoading(true);
    try {
      const res = await api.post("/users", { email });
      if (res.data.success) {
        toast.success(res.data.message);
        alert(res.data.message);
        setOtpSent(true);
        setEmailForOtp(email);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error sending OTP", error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyOtp(values) {
    setIsLoading(true);
    const userData = onSubmit(values);
    try {
      const res = await api.post("/users/verify-otp", { email: emailForOtp, otp: otp, userData: userData });
      if (res.data.success) {
        toast.success(res.data.message);
        alert(res.data.message)
        onRegisterSuccess();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP", error);
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Custom password input component
  function PasswordInputComponent({ placeholder, ...props }) {
    const isConfirmField = placeholder.includes("Confirm");
    const showPwd = isConfirmField ? showConfirmPassword : showPassword;
    const setShowPwd = isConfirmField
      ? setShowConfirmPassword
      : setShowPassword;

    return (
      <div className="relative">
        <Input
          type={showPwd ? "text" : "password"}
          placeholder={placeholder}
          {...props}
          className="rounded-lg border-gray-300 focus:border-red-800 focus:ring-red-800 pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 text-red-800 hover:bg-red-800/10"
          onClick={() => setShowPwd(!showPwd)}
        >
          {showPwd ? "Hide" : "Show"}
        </Button>
      </div>
    );
  }

  const nextTab = () => {
    if (activeTab === "personal") {
      // Validate personal fields before moving to next tab
      form
        .trigger([
          "name",
          "email",
          "phone",
          "birthDay",
          "birthMonth",
          "birthYear",
          "password",
          "confirmPassword",
        ])
        .then((isValid) => {
          if (isValid) setActiveTab("background");
        });
    } else if (activeTab === "background") {
      form
        .trigger(["gender", "religion", "caste", "mother_tongue"])
        .then((isValid) => {
          if (isValid) setActiveTab("professional");
        });
    }
  };

  const prevTab = () => {
    if (activeTab === "background") {
      setActiveTab("personal");
    } else if (activeTab === "professional") {
      setActiveTab("background");
    }
  };

  // Update the caste field to dynamically populate options based on the selected religion
  const casteOptions = {
    buddhist: [
      "Mahayana",
      "Nichiren Buddhism",
      "Pure Land Buddhism",
      "Tantrayana",
      "Theravada",
      "Tendai Buddhism",
      "Zen Buddhism",
    ],
    muslim: [
      "Sunni",
      "Shia",
      "Sri Lankan Moors",
      "Malays",
      "Bohra",
      "Memon",
    ],
    christian: [
      "Catholic",
      "Orthodox",
      "Protestant",
      "Ceylon Evangelical Lutheran Church (CELC)",
      "Ceylon Pentecostal Mission (CPM)",
      "Christian Reformed Church of Sri Lanka",
      "Church of South India (Jaffna Diocese)",
      "Jehovah's Witnesses",
      "Methodist Church of Sri Lanka",
      "Presbyterian Church (St. Andrew's Church)",
      "Sri Lanka Baptist Sangamaya",
      "The Church of Ceylon",
      "The Church of Jesus Christ of Latter-day Saints",
      "The Salvation Army",
    ],
    hindu: [
      "Agamudaiyar",
      "Kallar",
      "Karaiyar",
      "Maravar",
      "Mukkuvar",
      "Naidu",
      "Nair",
      "Nalavar",
      "Pallar (Devendra Kula Vellalar)",
      "Devar/Thevar/Mukkulathor",
      "Paraiyar",
      "Reddiyar",
      "Saliyar",
      "Thurumbar",
      "Vellalar",
      "Chakkiliyar",
      "Vannar",
      "Ambattar",
      "Koviyar",
      "Kutthadi",
    ],
  };

  // Update the occupation field to display options classified under various fields
  const classifiedOccupationOptions = {
    "Administration & Corporate": [
      "Administrative Assistant",
      "Business Owner/Entrepreneur",
      "Clerk",
      "Corporate Communication Specialist",
      "Corporate Planner",
      "Executive Assistant",
      "Human Resources Professional",
      "Office Manager",
      "Operations Manager",
      "Project Coordinator",
      "Secretary/Front Office Staff",
      "Senior Management (CXO, Director, VP, AVP, GM, DGM)",
      "Subject Matter Expert",
    ],
    "Agriculture & Environment": [
      "Agricultural Engineer",
      "Agronomist",
      "Aquaculture Specialist",
      "Dairy Farmer",
      "Environmental Scientist",
      "Florist",
      "Forestry Professional",
      "Horticulturist",
      "Hydroponics Expert",
      "Organic Farmer",
      "Veterinarian (Animal Husbandry)",
      "Wildlife Biologist",
    ],
    "Aviation & Marine": [
      "Air Traffic Controller",
      "Airline Pilot",
      "Air Hostess/Flight Attendant",
      "Aircraft Maintenance Technician",
      "Marine Engineer",
      "Merchant Navy Officer",
      "Naval Architect",
      "Sailor",
      "Ship Captain",
    ],
    "Banking, Finance & Insurance": [
      "Actuary",
      "Auditor",
      "Chartered Accountant",
      "Company Secretary",
      "Financial Advisor",
      "Investment Banker",
      "Loan Officer",
      "Stockbroker",
      "Tax Consultant",
      "Wealth Manager",
    ],
    "Beauty, Fashion & Lifestyle": [
      "Cosmetic Surgeon",
      "Fashion Stylist",
      "Image Consultant",
      "Jewelry Designer",
      "Makeup Artist",
      "Perfumer",
      "Spa Manager",
      "Tattoo Artist",
    ],
    "Construction & Real Estate": [
      "Architect",
      "Civil Engineer",
      "Interior Designer",
      "Landscape Architect",
      "Property Developer",
      "Real Estate Agent",
      "Surveyor",
      "Urban Planner",
    ],
    "Creative Arts & Media": [
      "Actor/Model",
      "Animator",
      "Art Curator",
      "Cartoonist",
      "Cinematographer",
      "Content Creator/Influencer",
      "DJ/Music Producer",
      "Film Director",
      "Graphic Designer",
      "Journalist",
      "Photographer/Videographer",
      "Radio Jockey",
      "Screenwriter",
      "Voiceover Artist",
    ],
    "Defense & Law Enforcement": [
      "Air Force Personnel",
      "Army Officer",
      "Coast Guard",
      "Cybercrime Investigator",
      "Firefighter",
      "Forensic Expert",
      "Intelligence Officer",
      "Police Officer",
      "Prison Warden",
    ],
    "Education & Research": [
      "Academic Dean",
      "Career Counselor",
      "Education Consultant",
      "Librarian",
      "Online Educator",
      "Research Scientist",
      "School Principal",
      "Special Education Teacher",
      "Tutor",
    ],
    "Engineering & Technology": [
      "AI/ML Engineer",
      "Aerospace Engineer",
      "Biomedical Engineer",
      "Chemical Engineer",
      "Data Scientist",
      "DevOps Engineer",
      "Electrical Engineer",
      "Robotics Engineer",
      "Software Developer",
      "UI/UX Designer",
    ],
    "Healthcare & Wellness": [
      "Ayurvedic Doctor",
      "Chiropractor",
      "Dentist",
      "Dietitian/Nutritionist",
      "Emergency Medical Technician (EMT)",
      "Midwife",
      "Occupational Therapist",
      "Pediatrician",
      "Psychiatrist",
      "Surgeon",
    ],
    "Hospitality & Tourism": [
      "Bartender",
      "Cruise Ship Staff",
      "Event Planner",
      "Hotel Manager",
      "Sommelier",
      "Tour Guide",
      "Travel Blogger",
    ],
    "Legal & Public Services": [
      "Judge",
      "Legal Advisor",
      "Notary Public",
      "Paralegal",
      "Politician",
      "Public Policy Analyst",
    ],
    "Manufacturing & Trades": [
      "Blacksmith",
      "Carpenter",
      "Electrician",
      "Industrial Designer",
      "Machinist",
      "Quality Control Inspector",
      "Welder",
    ],
    "Retail & Sales": [
      "E-commerce Specialist",
      "Retail Buyer",
      "Sales Engineer",
      "Store Manager",
      "Telemarketer",
    ],
    "Science & Innovation": [
      "Astronomer",
      "Biotechnologist",
      "Geneticist",
      "Nanotechnologist",
      "Nuclear Scientist",
      "Physicist",
    ],
    "Social & Community Services": [
      "NGO Founder",
      "Social Worker",
      "Counselor",
      "Disaster Relief Worker",
      "Fundraiser",
    ],
    "Sports & Fitness": [
      "Athlete",
      "Coach",
      "Fitness Trainer",
      "Sports Physiotherapist",
      "Yoga Instructor",
    ],
    "Transport & Logistics": [
      "Delivery Driver",
      "Fleet Manager",
      "Logistics Coordinator",
      "Truck Driver",
      "Warehouse Supervisor",
    ],
    "Emerging & Niche Fields": [
      "Blockchain Developer",
      "Cryptocurrency Trader",
      "Drone Operator",
      "Ethical Hacker",
      "Game Streamer",
      "Sustainability Consultant",
      "Virtual Reality Designer",
    ],
    "Traditional & Regional Occupations": [
      "Artisan (Potter, Weaver)",
      "Astrologer",
      "Farmer (Regional Crops)",
      "Handicraft Maker",
      "Traditional Healer",
    ],
    "Others": [
      "Freelancer",
      "Homemaker",
      "Retired Professional",
      "Social Media Influencer",
      "Student",
    ],
  };

  // Update the education field to display options classified under various categories
  const classifiedEducationOptions = {
    "Bachelor's - Engineering / Computer Science": [
      "Aeronautical Engineering",
      "B.Arch. - Bachelor of Architecture",
      "BCA - Bachelor of Computer Applications",
      "B.E. - Bachelor of Engineering",
      "B.Plan - Bachelor of Planning",
      "B.Sc. IT/CS - Bachelor of Science in IT/Computer Science",
      "B.Tech - Bachelor of Technology",
      "B.Sc. Engineering (Civil/Mechanical/Electrical) (Sri Lanka)",
      "B.Sc. Information Technology (BIT) (Sri Lanka)",
      "Other Bachelor's Degree in Engineering / Computers",
      "B.S. Eng. - Bachelor of Science in Engineering",
    ],
    "Master's - Engineering / Computer Science": [
      "M.Arch. - Master of Architecture",
      "MCA - Master of Computer Applications",
      "M.E. - Master of Engineering",
      "M.Sc. IT/CS - Master of Science in IT/Computer Science",
      "M.S. Eng. - Master of Science in Engineering",
      "M.Tech. - Master of Technology",
      "PGDCA - Post Graduate Diploma in Computer Applications",
      "M.Sc. Engineering (Sri Lanka)",
      "Other Master's Degree in Engineering / Computers",
    ],
    "Bachelor's - Arts/Science/Commerce": [
      "Aviation Degree",
      "B.A. - Bachelor of Arts",
      "B.Com. - Bachelor of Commerce",
      "B.Ed. - Bachelor of Education",
      "BFA - Bachelor of Fine Arts",
      "BFT - Bachelor of Fashion Technology",
      "BLIS - Bachelor of Library and Information Science",
      "B.M.M. - Bachelor of Mass Media",
      "B.Sc. - Bachelor of Science",
      "B.Sc. Agriculture (Sri Lanka)",
      "B.Sc. Fisheries (Sri Lanka)",
      "B.A. Buddhist Studies (Sri Lanka)",
      "B.A. Sinhala/Tamil Language & Literature (Sri Lanka)",
      "B.S.W. - Bachelor of Social Work",
      "B.Phil. - Bachelor of Philosophy",
      "Other Bachelor's Degree in Arts / Science / Commerce",
    ],
    "Master's - Arts/Science/Commerce": [
      "M.A. - Master of Arts",
      "M.Com. - Master of Commerce",
      "M.Ed. - Master of Education",
      "MFA - Master of Fine Arts",
      "MLIS - Master of Library and Information Science",
      "M.Sc. - Master of Science",
      "M.Sc. Development Studies (Sri Lanka)",
      "M.Sc. Agriculture (Sri Lanka)",
      "M.S.W. - Master of Social Work",
      "M.Phil. - Master of Philosophy",
      "Other Master's Degree in Arts / Science / Commerce",
    ],
    "Bachelor's - Management": [
      "BBA - Bachelor of Business Administration",
      "BFM - Bachelor of Financial Management",
      "BHM - Bachelor of Hotel Management",
      "Other Bachelor's Degree in Management",
      "BHA - Bachelor of Hospital Administration",
    ],
    "Master's - Management": [
      "MBA - Master of Business Administration",
      "MFM - Master of Financial Management",
      "MHM - Master of Hotel Management",
      "MHRM - Master of Human Resource Management",
      "PGDM - Post Graduate Diploma in Management",
      "Other Master's Degree in Management",
      "MHA - Master of Hospital Administration",
    ],
    "Bachelor's - Medicine - General/Dental/Surgeon": [
      "BDS - Bachelor of Dental Surgery",
      "BAMS - Bachelor of Ayurvedic Medicine and Surgery",
      "BHMS - Bachelor of Homeopathic Medicine and Surgery",
      "BSMS - Bachelor of Siddha Medicine and Surgery",
      "BUMS - Bachelor of Unani Medicine and Surgery",
      "BVSC - Bachelor of Veterinary Science",
      "MBBS - Bachelor of Medicine, Bachelor of Surgery",
    ],
    "Master's - Medicine - General/Dental/Surgeon": [
      "MDS - Master of Dental Surgery",
      "MD/MS - Doctor of Medicine / Master of Surgery",
      "MVSC - Master of Veterinary Science",
      "MCh - Master of Chirurgiae",
      "DNB - Diplomate of National Board",
    ],
    "Bachelor's - Pharmacy/Nursing or Health Sciences": [
      "BPharm - Bachelor of Pharmacy",
      "BPT - Bachelor of Physiotherapy",
      "B.Sc. Nursing - Bachelor of Science in Nursing",
      "Other Bachelor's Degree in Pharmacy/Nursing or Health Sciences",
    ],
    "Master's - Pharmacy/Nursing or Health Sciences": [
      "MPharm - Master of Pharmacy",
      "MPT - Master of Physiotherapy",
      "Other Master's Degree in Pharmacy/Nursing or Health Sciences",
    ],
    "Bachelor's - Legal": [
      "BGL - Bachelor of General Laws",
      "BL - Bachelor of Laws",
      "LLB - Bachelor of Legislative Law",
      "Other Bachelor's Degree in Legal",
    ],
    "Master's - Legal": [
      "LLM - Master of Laws",
      "ML - Master of Legal Studies",
      "Other Master's Degree in Legal",
    ],
    "Finance - ICWAI/CA/CS/CFA": [
      "CA - Chartered Accountant",
      "CFA - Chartered Financial Analyst",
      "CS - Company Secretary",
      "ICWA - Cost and Works Accountant",
      "CIMA - Chartered Institute of Management Accountants (Sri Lanka)",
      "Other Degree/Qualification in Finance",
    ],
    "Civil Services": [
      "SLAS - Sri Lanka Administrative Service",
      "SLEngS - Sri Lanka Engineering Services",
      "SLFS - Sri Lanka Foreign Service",
      "SLPS - Sri Lanka Police Service",
      "Other Sri Lanka Civil Services",
    ],
    "Doctorates": [
      "Ph.D. - Doctor of Philosophy",
      "DM - Doctor of Medicine",
      "Postdoctoral Fellow",
      "FNB - Fellow of National Board",
    ],
    "Diploma/Polytechnic": [
      "Diploma",
      "Polytechnic",
      "National Diploma in Technology (NDT) (Sri Lanka)",
      "Diploma in Engineering (SLIATE) (Sri Lanka)",
      "National Diploma in Teaching (Sri Lanka)",
      "Other Diplomas",
    ],
    "Higher Secondary/Secondary": [
      "Higher Secondary School / High School",
      "GCE Advanced Level (A/L) (Sri Lanka)",
      "GCE Ordinary Level (O/L) (Sri Lanka)",
    ],
  };

  return (
    <>
      <div className="w-full max-w-lg mx-auto p-4 sm:p-6 space-y-6">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Create an Account
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Join MatriManda to find your perfect partner
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              if (!otpSent) {
                sendOtp(values.email);
              } else {
                verifyOtp(values);
              }
            })}
            className="space-y-6"
          >
            {!otpSent ? (
              <>
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="flex justify-between bg-transparent border-b border-red-800/20 mb-6 sm:mb-8">
                    {["personal", "background", "professional"].map(
                      (tab, index) => (
                        <TabsTrigger
                          key={tab}
                          value={tab}
                          className={`relative flex-1 py-3 px-2 sm:px-4 text-sm sm:text-base font-medium transition-all duration-300
                    ${
                      activeTab === tab
                        ? "text-red-800 after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-1 after:bg-red-800 after:rounded-t"
                        : "text-gray-600 hover:text-red-800"
                    }`}
                        >
                          <span className="mr-2 hidden sm:inline">
                            {["Personal", "Background", "Professional"][index]}
                          </span>
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-800/10 text-red-800">
                            {index + 1}
                          </span>
                        </TabsTrigger>
                      )
                    )}
                  </TabsList>

                  <TabsContent value="personal" className="mt-0 space-y-4">
                    <Card className="rounded-xl border-none shadow-md">
                      <CardContent className="p-4 sm:p-6 space-y-4">
                        {[
                          {
                            name: "name",
                            label: "Full Name",
                            placeholder: "John Doe",
                          },
                          {
                            name: "email",
                            label: "Email",
                            placeholder: "user123@gmail.com",
                            type: "email",
                          },
                          {
                            name: "phone",
                            label: "Phone Number",
                            placeholder: "+1 (555) 123-4567",
                          },
                        ].map(({ name, label, placeholder, type }) => (
                          <FormField
                            key={name}
                            control={form.control}
                            name={name}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  {label}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type={type || "text"}
                                    placeholder={placeholder}
                                    {...field}
                                    className="rounded-lg border-gray-300 focus:border-red-800 focus:ring-red-800"
                                  />
                                </FormControl>
                                <FormMessage className="text-xs text-red-800" />
                              </FormItem>
                            )}
                          />
                        ))}

                        <div className="space-y-2">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Date of Birth
                          </FormLabel>
                          <div className="grid grid-cols-3 gap-2 sm:gap-3">
                            {["birthDay", "birthMonth", "birthYear"].map(
                              (name, idx) => (
                                <FormField
                                  key={name}
                                  control={form.control}
                                  name={name}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Select
                                          onValueChange={field.onChange}
                                          value={field.value}
                                        >
                                          <SelectTrigger className="rounded-lg border-gray-300 focus:border-red-800 focus:ring-red-800">
                                            <SelectValue
                                              placeholder={
                                                ["Day", "Month", "Year"][idx]
                                              }
                                            />
                                          </SelectTrigger>
                                          <SelectContent
                                            className={
                                              name === "birthYear"
                                                ? "max-h-[200px]"
                                                : ""
                                            }
                                          >
                                            {(name === "birthDay"
                                              ? days
                                              : name === "birthMonth"
                                              ? months
                                              : years
                                            ).map((option) => (
                                              <SelectItem
                                                key={
                                                  typeof option === "string"
                                                    ? option
                                                    : option.value
                                                }
                                                value={
                                                  typeof option === "string"
                                                    ? option
                                                    : option.value
                                                }
                                              >
                                                {typeof option === "string"
                                                  ? option
                                                  : option.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              )
                            )}
                          </div>
                          {(form.formState.errors.birthDay ||
                            form.formState.errors.birthMonth ||
                            form.formState.errors.birthYear) && (
                            <p className="text-xs text-red-800">
                              {form.formState.errors.birthDay?.message ||
                                form.formState.errors.birthMonth?.message ||
                                form.formState.errors.birthYear?.message}
                            </p>
                          )}
                        </div>

                        {["password", "confirmPassword"].map((name) => (
                          <FormField
                            key={name}
                            control={form.control}
                            name={name}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  {name === "password"
                                    ? "Password"
                                    : "Confirm Password"}
                                </FormLabel>
                                <FormControl>
                                  <PasswordInputComponent
                                    placeholder={
                                      name === "password"
                                        ? "Create a password"
                                        : "Confirm your password"
                                    }
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs text-red-800" />
                              </FormItem>
                            )}
                          />
                        ))}

                        <Button
                          type="button"
                          onClick={nextTab}
                          className="w-full bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white rounded-lg shadow-md"
                        >
                          Next
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="background" className="mt-0 space-y-4">
                    <Card className="rounded-xl border-none shadow-md">
                      <CardContent className="p-4 sm:p-6 space-y-4">
                        {[
                          {
                            name: "gender",
                            label: "Gender",
                            options: ["male", "female", "other"],
                          },
                          {
                            name: "religion",
                            label: "Religion",
                            options: [
                              "buddhist",
                              "muslim",
                              "hindu",
                              "christian",
                              
                            ],
                          },
                          {
                            name: "mother_tongue",
                            label: "Mother Tongue",
                            options: [
                              "sinhala",
                              
                              "english",
                              "tamil",
                              "hindi",
                            
                              "other",
                            ],
                          },
                        ].map(({ name, label, options }) => (
                          <FormField
                            key={name}
                            control={form.control}
                            name={name}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  {label}
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="rounded-lg border-gray-300 focus:border-red-800 focus:ring-red-800">
                                      <SelectValue
                                        placeholder={`Select your ${label.toLowerCase()}`}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {options.map((opt) => (
                                      <SelectItem key={opt} value={opt}>
                                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-xs text-red-800" />
                              </FormItem>
                            )}
                          />
                        ))}

                        <FormField
                          control={form.control}
                          name="caste"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Caste
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={!form.watch("religion")}
                              >
                                <FormControl>
                                  <SelectTrigger className="rounded-lg border-gray-300 focus:border-red-800 focus:ring-red-800">
                                    <SelectValue placeholder="Select your caste" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {(casteOptions[form.watch("religion")] || []).map((caste) => (
                                    <SelectItem key={caste} value={caste}>
                                      {caste}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-xs text-red-800" />
                            </FormItem>
                          )}
                        />

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={prevTab}
                            className="w-full sm:w-1/2 text-red-800 border-red-800 hover:bg-red-800/10 rounded-lg"
                          >
                            Previous
                          </Button>
                          <Button
                            type="button"
                            onClick={nextTab}
                            className="w-full sm:w-1/2 bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white rounded-lg shadow-md"
                          >
                            Next
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="professional" className="mt-0 space-y-4">
                    <Card className="rounded-xl border-none shadow-md">
                      <CardContent className="p-4 sm:p-6 space-y-4">
                        <FormField
                          control={form.control}
                          name="education"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Education
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="rounded-lg border-gray-300 focus:border-red-800 focus:ring-red-800">
                                    <SelectValue placeholder="Select your education" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.entries(classifiedEducationOptions).map(([category, educations]) => (
                                    <div key={category}>
                                      <div className="font-bold text-gray-700 px-2 py-1">{category}</div>
                                      {educations.map((education) => (
                                        <SelectItem key={education} value={education}>
                                          {education}
                                        </SelectItem>
                                      ))}
                                    </div>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-xs text-red-800" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="occupation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Occupation
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="rounded-lg border-gray-300 focus:border-red-800 focus:ring-red-800">
                                    <SelectValue placeholder="Select your occupation" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.entries(classifiedOccupationOptions).map(([category, occupations]) => (
                                    <div key={category}>
                                      <div className="font-bold text-gray-700 px-2 py-1">{category}</div>
                                      {occupations.map((occupation) => (
                                        <SelectItem key={occupation} value={occupation}>
                                          {occupation}
                                        </SelectItem>
                                      ))}
                                    </div>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-xs text-red-800" />
                            </FormItem>
                          )}
                        />

                        {[
                          
                          {
                            name: "income",
                            label: "Annual Income",
                            placeholder: "Enter your annual income",
                            type: "number",
                          },
                          {
                            name: "city",
                            label: "City",
                            placeholder: "Enter your city",
                          },
                        ].map(({ name, label, placeholder, type }) => (
                          <FormField
                            key={name}
                            control={form.control}
                            name={name}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  {label}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type={type || "text"}
                                    placeholder={placeholder}
                                    {...field}
                                    className="rounded-lg border-gray-300 focus:border-red-800 focus:ring-red-800"
                                  />
                                </FormControl>
                                <FormMessage className="text-xs text-red-800" />
                              </FormItem>
                            )}
                          />
                        ))}

                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Country
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="rounded-lg border-gray-300 focus:border-red-800 focus:ring-red-800">
                                    <SelectValue placeholder="Select your country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {[ "sri lanka",
                                    "india",
                                    "usa",
                                    "uk",
                                    "canada",
                                    "australia",
                                    "other",
                                  ].map((opt) => (
                                    <SelectItem key={opt} value={opt}>
                                      {opt === "usa"
                                        ? "United States"
                                        : opt === "uk"
                                        ? "United Kingdom"
                                        : opt.charAt(0).toUpperCase() +
                                          opt.slice(1)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-xs text-red-800" />
                            </FormItem>
                          )}
                        />

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={prevTab}
                            className="w-full sm:w-1/2 text-red-800 border-red-800 hover:bg-red-800/10 rounded-lg"
                          >
                            Previous
                          </Button>
                          <Button
                            type="submit"
                            className="w-full sm:w-1/2 bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white rounded-lg shadow-md"
                            disabled={isLoading}
                          >
                            {isLoading ? "Loading..." : "Register"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Enter OTP
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter the OTP sent to your email"
                            {...field}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="rounded-lg border-gray-300 focus:border-red-800 focus:ring-red-800"
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-800" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white rounded-lg shadow-md"
                    disabled={isLoading}
                  >
                    {isLoading?"verfying otp...":"Verify OTP"}
                  </Button>
                </div>
              </>
            )}

            <div className="text-center text-xs sm:text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-red-800 hover:underline font-medium"
              >
                Sign in
              </button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
