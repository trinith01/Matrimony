import { useState, useRef } from "react";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Switch from "react-switch";

function PriceCards() {
  const [isYearly, setYearly] = useState(false);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 300 : 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const pricingData = [
    {
      name: "Free Plan",
      priceMonthly: "Free",
      priceYearly: "Free",
      features: [
        "Create a basic profile",
        "Browse profiles",
        "Send 3 interests/day",
        "Basic search filters",
        "5 profile views/day",
      ],
      buttonText: "Get Started",
      highlighted: false,
    },
    {
      name: "Basic Plan",
      priceMonthly: "LKR 600",
      priceYearly: "LKR 6,000",
      features: [
        "Ad-free experience",
        "Unlimited browsing",
        "View photos & basic contact info",
        "Send 10 interests/day",
        "Advanced filters",
        "Basic horoscope matching",
        "Priority support",
      ],
      buttonText: "Choose Plan",
      highlighted: false,
    },
    {
      name: "Premium Plan",
      priceMonthly: "LKR 2,500",
      priceYearly: "LKR 25,000",
      features: [
        "All Basic Plan features",
        "Unlimited messaging",
        "Highlighted profile",
        "Full contact details",
        "Advanced horoscope reports",
        "Verification badge",
        "5 profile boosts/month",
        "Exclusive webinars",
      ],
      buttonText: "Choose Plan",
      highlighted: true,
    },
    {
      name: "VIP Plan",
      priceMonthly: "LKR 3,500",
      priceYearly: "LKR 35,000",
      features: [
        "All Premium Plan features",
        "Dedicated consultant",
        "Top search priority",
        "VIP event invitations",
        "Free photo shoot",
        "Background checks",
        "Money-back guarantee",
      ],
      buttonText: "Choose Plan",
      highlighted: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 relative">
      {/* Toggle Switch */}
      <div className="flex justify-center items-center mb-8">
        <span className="text-lg font-medium text-[#1d3557] mr-4">
          {isYearly ? "Yearly" : "Monthly"}
        </span>
        <Switch
          onChange={() => setYearly(!isYearly)}
          checked={isYearly}
          uncheckedIcon={false}
          checkedIcon={false}
          height={24}
          width={48}
          onColor="#e63946"
        />
      </div>

      {/* Scroll Buttons */}
      <button
        className="hidden lg:block absolute top-1/2 -left-6 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="w-6 h-6 text-[#1d3557]" />
      </button>
      <button
        className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
        onClick={() => scroll("right")}
      >
        <ChevronRight className="w-6 h-6 text-[#1d3557]" />
      </button>

      {/* Scrollable Cards */}
      <div className="overflow-x-auto no-scrollbar">
        <div ref={scrollRef} className="flex space-x-6 px-4">
          {pricingData.map((card, index) => (
            <div
              key={card.name}
              className={`flex-shrink-0 w-[300px] rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:-translate-y-2 ${
                card.highlighted
                  ? "bg-gradient-to-b from-[#e63946] to-[#d00000] text-white"
                  : "bg-white text-[#1d3557]"
              }`}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.2}s forwards`,
              }}
            >
              <h3
                className={`text-xl font-semibold mb-4 ${
                  card.highlighted ? "text-white" : "text-[#1d3557]"
                }`}
              >
                {card.name}
              </h3>
              <div className="mb-6">
                <span
                  className={`text-3xl font-bold ${
                    card.highlighted ? "text-white" : "text-[#e63946]"
                  }`}
                >
                  {isYearly ? card.priceYearly : card.priceMonthly}
                </span>
                {card.priceMonthly !== "Free" && (
                  <span className="text-sm ml-2">
                    {isYearly ? "/year" : "/mo"}
                  </span>
                )}
              </div>
              {isYearly && card.priceMonthly !== "Free" && (
                <div className="mb-4 text-sm font-medium text-yellow-300">
                  Save 17% with yearly billing
                </div>
              )}
              <ul className="space-y-3 mb-6">
                {card.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm">
                    <CheckCircle
                      className={`w-5 h-5 mr-2 ${
                        card.highlighted ? "text-white" : "text-[#e63946]"
                      }`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                  card.highlighted
                    ? "bg-white text-[#e63946] hover:bg-gray-100"
                    : "bg-[#e63946] text-white hover:bg-[#d00000]"
                }`}
              >
                {card.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Scroll Indicator */}
      <div className="text-center mt-4 lg:hidden">
        <span className="text-sm text-gray-500">Swipe to explore plans</span>
      </div>
    </div>
  );
}

export default PriceCards;
