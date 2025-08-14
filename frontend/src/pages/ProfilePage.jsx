import { NavigationBar } from "@/components/navigation-bar"
import { ProfileDashboard } from "@/components/profile-dashboard"

// Current user dynamic variables


// Sample user profile data
const userProfile = {
  _id: "67d2c0a894d5fc8d2f1a4610",
  name: "John Doe",
  email: "johndoe@example.com",
  phone: "+94123456789",
  gender: "Male",
  religion: "Buddhism",
  caste: "Sinhala",
  mother_tongue: "Sinhala",
  occupation: "Software Engineer",
  education: "BSc in IT",
  income: 150000,
  location: {
    city: "Colombo",
    country: "Sri Lanka",
  },
  profile_photo: "/placeholder.svg?height=400&width=300",
  gallery: [
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
  ],
  videos: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
  verified: true,
  account_status: "active",
  subscription_plan: "premium",
  subscription_expires: "2023-12-31T00:00:00Z",
  interests_sent: [
    {
      id: "67d2c0a894d5fc8d2f1a4612",
      name: "Sarah Johnson",
      photo: "/placeholder.svg?height=100&width=100",
      status: "pending",
      sent_date: "2023-05-15T00:00:00Z",
    },
    {
      id: "67d2c0a894d5fc8d2f1a4613",
      name: "Emily Davis",
      photo: "/placeholder.svg?height=100&width=100",
      status: "accepted",
      sent_date: "2023-05-10T00:00:00Z",
    },
  ],
  interests_received: [
    {
      id: "67d2c0a894d5fc8d2f1a4614",
      name: "Michael Brown",
      photo: "/placeholder.svg?height=100&width=100",
      status: "pending",
      sent_date: "2023-05-18T00:00:00Z",
    },
    {
      id: "67d2c0a894d5fc8d2f1a4615",
      name: "Jessica Wilson",
      photo: "/placeholder.svg?height=100&width=100",
      status: "rejected",
      sent_date: "2023-05-05T00:00:00Z",
    },
    {
      id: "67d2c0a894d5fc8d2f1a4616",
      name: "David Miller",
      photo: "/placeholder.svg?height=100&width=100",
      status: "pending",
      sent_date: "2023-05-20T00:00:00Z",
    },
  ],
  contacts: [
    {
      id: "67d2c0a894d5fc8d2f1a4617",
      name: "Emily Davis",
      photo: "/placeholder.svg?height=100&width=100",
      last_message: "Looking forward to our meeting!",
      last_active: "2023-05-21T10:30:00Z",
    },
    {
      id: "67d2c0a894d5fc8d2f1a4618",
      name: "Robert Taylor",
      photo: "/placeholder.svg?height=100&width=100",
      last_message: "Hello, nice to meet you!",
      last_active: "2023-05-20T15:45:00Z",
    },
  ],
  shortlisted_profiles: ["67d2c0a894d5fc8d2f1a4615"],
  visibility: "public",
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-10T00:00:00Z",
  birthday: "1990-05-15",
  age: 33,
  about:
    "I'm a software engineer with a passion for technology and innovation. I enjoy hiking, reading, and spending time with family and friends. Looking for a partner who shares similar interests and values.",
  height: 175,
  marital_status: "Never Married",
  drinking: "Occasionally",
  smoking: "Never",
  diet: "Non-vegetarian",
  hobbies: ["Reading", "Hiking", "Photography", "Cooking"],
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
     
      <main className="container mx-auto py-6 px-4">
        <ProfileDashboard user={userProfile} />
      </main>
    </div>
  )
}

