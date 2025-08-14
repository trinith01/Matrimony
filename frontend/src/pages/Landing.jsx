import React from "react";
import { useNavigate } from "react-router-dom";
import Masonry from "react-masonry-css";
import {
  Search,
  Heart,
  Shield,
  Users,
  Star,
  Calendar,
  MessageSquare,
  Lock,
  Headphones,
} from "lucide-react";
import "../styles/Landing.css";

// Images (adjust paths as needed)
import bannerImg from "../images/banner1.jpg";
import stepsImg from "../images/stepsImg.jpg";
import call from "../images/call.jpg";
import gallery1 from "../images/gallery1.jpg";
import gallery_1 from "../images/gallery_1.jpg";
import gallery_2 from "../images/gallery_2.jpg";
import gallery2 from "../images/gallery2.jpg";
import gallery3 from "../images/gallery3.jpg";
import gallery_3 from "../images/gallery_3.jpg";

const Landing = () => {
  const navigate = useNavigate();
  const images = [
    {
      src: gallery1,
      alt: "Wedding Moment 1",
      caption: "A Joyful Union",
      height: "250px",
    },
    {
      src: gallery_1,
      alt: "Wedding Moment 2",
      caption: "Moments of Love",
      height: "350px",
    },
    {
      src: gallery2,
      alt: "Wedding Moment 4",
      caption: "Forever Begins",
      height: "300px",
    },
    {
      src: gallery_2,
      alt: "Wedding Moment 3",
      caption: "Pure Happiness",
      height: "350px",
    },
    {
      src: gallery3,
      alt: "Wedding Moment 5",
      caption: "Vows Exchanged",
      height: "250px",
    },
    {
      src: gallery_3,
      alt: "Wedding Moment 6",
      caption: "Eternal Bond",
      height: "300px",
    },
  ];

  const breakpointColumnsObj = {
    default: 3, // 3 columns on desktop (1024px+)
    1024: 3, // Ensure 3 columns at lg breakpoint
    768: 2, // 2 columns on tablet
    640: 1, // 1 column on mobile
  };

  // Handler for button click
  const handleStartJourney = () => {
    navigate("/landing"); // Navigate to /login route
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[70vh] sm:h-[80vh] min-h-[500px] overflow-hidden">
        <img
          src={bannerImg}
          alt="Hero Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 animate-fade-in-down">
            Discover Your Soulmate
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 max-w-xl animate-fade-in-up">
            Join the most trusted matrimonial platform to find your perfect
            match with ease.
          </p>
          <button
            className="px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold bg-red-800 text-white rounded-full hover:bg-red-900 transition-all duration-300 animate-bounce"
            onClick={handleStartJourney} // Add onClick handler
          >
            Start Your Journey
          </button>
        </div>
      </section>

      {/* Steps Section */}
      <section className="max-w-6xl mx-auto py-12 sm:py-16 px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 items-center">
          <div className="w-full lg:w-1/2">
            <img
              src={stepsImg}
              alt="Steps"
              className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-lg"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1d3557] mb-6 text-center lg:text-left">
              Begin Your Love Story <span className="text-red-800">Today</span>
            </h2>
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
              <h3 className="text-xl sm:text-2xl font-semibold text-red-800 mb-6 text-center">
                Three Simple Steps
              </h3>
              <div className="space-y-6">
                {[
                  {
                    icon: (
                      <Users className="w-6 h-6 sm:w-8 sm:h-8 text-red-800" />
                    ),
                    title: "Create Your Profile",
                  },
                  {
                    icon: (
                      <Search className="w-6 h-6 sm:w-8 sm:h-8 text-red-800" />
                    ),
                    title: "Explore Matches",
                  },
                  {
                    icon: (
                      <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-800" />
                    ),
                    title: "Connect & Engage",
                  },
                ].map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center animate-fade-in"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="bg-red-100 rounded-full p-2 sm:p-3 mr-4">
                      {step.icon}
                    </div>
                    <h4 className="text-base sm:text-lg md:text-xl font-semibold text-[#1d3557]">
                      {step.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-gray-100 to-white py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-red-800" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold ml-3 sm:ml-4 text-[#1d3557]">
              Seamless Connectivity
            </h2>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-12">
            Advanced tools and secure communication to connect you with your
            ideal partner.
          </p>
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            <div className="w-full lg:w-1/2 bg-white rounded-2xl shadow-lg p-6 sm:p-8 relative">
              <div className="h-20 sm:h-24 bg-gradient-to-r from-red-800 to-red-900 rounded-t-2xl absolute top-0 left-0 w-full"></div>
              <div className="pt-24 sm:pt-28">
                <h3 className="text-xl sm:text-2xl font-bold text-white absolute top-6 sm:top-8 left-6 sm:left-8">
                  Smart Search Tools
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-6 sm:mb-8">
                  {[
                    {
                      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
                      title: "Verified Profiles",
                    },
                    {
                      icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />,
                      title: "Secure Authentication",
                    },
                    {
                      icon: <Star className="w-5 h-5 sm:w-6 sm:h-6" />,
                      title: "Save Favorites",
                    },
                    {
                      icon: <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />,
                      title: "Auto-Matchmaking",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-xl p-3 sm:p-4 flex flex-col items-center"
                    >
                      <div className="bg-red-800 text-white p-2 rounded-lg mb-2">
                        {item.icon}
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-[#1d3557]">
                        {item.title}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-100 rounded-xl p-3 sm:p-4">
                  <h4 className="font-semibold text-[#1d3557] mb-2 text-sm sm:text-base">
                    Filter Your Way
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Age",
                      "Location",
                      "Religion",
                      "Language",
                      "Education",
                      "Profession",
                      "Interests",
                    ].map((filter) => (
                      <span
                        key={filter}
                        className="bg-red-800 text-white text-xs px-2 sm:px-3 py-1 rounded-full"
                      >
                        {filter}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8">
              <img
                src={call}
                alt="Communication"
                className="w-full h-[300px] sm:h-[350px] lg:h-[400px] object-cover rounded-2xl shadow-lg"
              />
              <div className="text-center">
                <div className="flex items-center justify-center mb-4 sm:mb-6">
                  <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-red-800" />
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold ml-3 sm:ml-4 text-[#1d3557]">
                    Premium Matchmaking
                  </h2>
                </div>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl mx-auto">
                  Expert-driven technology to find your perfect match
                  effortlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="max-w-6xl mx-auto py-12 sm:py-16 px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1d3557] text-center mb-8 sm:mb-12">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              icon: <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-red-800" />,
              title: "Trusted Profiles",
              desc: "Every profile is verified for authenticity and trust.",
            },
            {
              icon: <Search className="w-8 h-8 sm:w-10 sm:h-10 text-red-800" />,
              title: "Fast Matches",
              desc: "Connect with compatible partners quickly.",
            },
            {
              icon: <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-red-800" />,
              title: "Top Privacy",
              desc: "Your data is safeguarded with top-tier security.",
            },
            {
              icon: (
                <Headphones className="w-8 h-8 sm:w-10 sm:h-10 text-red-800" />
              ),
              title: "24/7 Support",
              desc: "Our team is always here to assist you.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="relative bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-center border border-red-800/20 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-3 sm:mb-4">
                <div className="bg-red-100 rounded-full p-3 sm:p-4 inline-flex items-center justify-center">
                  {item.icon}
                </div>
              </div>
              <h4 className="text-base sm:text-lg md:text-xl font-semibold text-[#1d3557] mb-2">
                {item.title}
              </h4>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section - Updated for Web View */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-b from-gray-100 to-red-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1d3557] mb-4 animate-fade-in-down">
            Cherished Moments
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl mx-auto mb-8 sm:mb-12 animate-fade-in-up">
            Celebrate the love stories that inspire us all.
          </p>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="masonry-grid"
            columnClassName="masonry-grid_column"
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="masonry-item relative overflow-hidden rounded-xl shadow-lg group hover:shadow-xl transition-all duration-300"
                style={{ height: image.height }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-red-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center border border-red-800/50">
                  <p className="text-white text-sm sm:text-base md:text-lg font-semibold px-4 py-2 rounded-lg">
                    {image.caption}
                  </p>
                </div>
              </div>
            ))}
          </Masonry>
        </div>
      </section>

      {/* Happy Stories Section */}
      <section className="max-w-6xl mx-auto py-12 sm:py-16 px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1d3557] text-center mb-8 sm:mb-12">
          Love Stories
        </h2>
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative">
          <div className="relative">
            <img
              src={gallery_3}
              alt="Happy Couple"
              className="w-48 h-48 sm:w-64 sm:h-64 object-cover rounded-full shadow-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <Heart className="w-32 h-32 sm:w-48 sm:h-48 text-red-800" />
            </div>
          </div>
          <div className="text-center md:text-left max-w-md">
            <h4 className="text-xl sm:text-2xl font-semibold text-[#1d3557] mb-4">
              A Love Meant to Be 💖
            </h4>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              "We bonded over our shared passions for travel and music. Our
              chats were effortless, leading to a magical first date. Six months
              later, I proposed at our favorite café. Now, we’re happily
              married!"
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              — Aarav & Meera, Married 2024
            </p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-[#1d3557] text-white py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h5 className="text-lg sm:text-xl font-semibold mb-4">
                About Us
              </h5>
              <p className="text-sm sm:text-base text-gray-300">
                India’s premier matrimonial service, connecting hearts with
                trust and care.
              </p>
            </div>
            <div>
              <h5 className="text-lg sm:text-xl font-semibold mb-4">
                Quick Links
              </h5>
              <ul className="space-y-2">
                {["Home", "Search", "Success Stories", "Contact Us"].map(
                  (link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm sm:text-base text-gray-300 hover:text-red-800 transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h5 className="text-lg sm:text-xl font-semibold mb-4">
                Contact Us
              </h5>
              <p className="text-sm sm:text-base text-gray-300">
                India
                <br />
                Phone: #<br />
                Email: #
              </p>
            </div>
          </div>
          <hr className="my-6 sm:my-8 border-gray-600" />
          <p className="text-center text-xs sm:text-sm text-gray-300">
            © {new Date().getFullYear()} Matrimony Service. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
