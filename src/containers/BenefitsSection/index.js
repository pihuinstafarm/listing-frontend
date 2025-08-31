import React from 'react';

// MUI Icons (Note: In a real project, you would import these from @mui/icons-material)
// For this demo, I'll create similar icon components
const LocationOnIcon = ({ sx }) => (
    <svg viewBox="0 0 24 24" style={sx} fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="white" />
    </svg>
);

const AutoAwesomeIcon = ({ sx }) => (
    <svg viewBox="0 0 24 24" style={sx} fill="currentColor">
        <path d="m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" fill="white" />
    </svg>
);

const LocalOfferIcon = ({ sx }) => (
    <svg viewBox="0 0 24 24" style={sx} fill="currentColor">
        <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" fill="white" />
    </svg>
);

const VerifiedUserIcon = ({ sx }) => (
    <svg viewBox="0 0 24 24" style={sx} fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="white" />
        <path d="M10 17l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="white" />
    </svg>
);

const BoltIcon = ({ sx }) => (
    <svg viewBox="0 0 24 24" style={sx} fill="currentColor">
        <path d="M11 21h-1l1-7H7.5c-.88 0-.33-.75-.31-.78C8.48 10.94 10.42 7.54 13.01 3h1l-1 7h3.51c.4 0 .62.19.4.66C12.97 17.55 11 21 11 21z" fill="white" />
    </svg>
);

const SupportAgentIcon = ({ sx }) => (
    <svg viewBox="0 0 24 24" style={sx} fill="currentColor">
        <path d="M21 12.22C21 6.73 16.74 3 12 3c-4.69 0-9 3.65-9 9.28-.6.34-1 .98-1 1.72v2c0 1.1.9 2 2 2h1v-6.1c0-3.87 3.13-7 7-7s7 3.13 7 7V19h-8v2h8c1.1 0 2-.9 2-2v-1.22c.59-.31 1-.92 1-1.64v-2.3c0-.7-.41-1.31-1-1.62z" fill="white" />
        <circle cx="9" cy="13" r="1" />
        <circle cx="15" cy="13" r="1" />
        <path d="M18 11.03C17.52 8.18 15.04 6 12.05 6c-3.03 0-6.29 2.51-6.03 6.45 2.47-1.01 4.33-3.21 4.86-5.89 1.31 2.63 4 4.44 7.12 4.47z" fill="white" />
    </svg>
);

// Define the benefits data with updated content
const benefitsData = [
    {
        icon: <LocationOnIcon sx={{ fontSize: 32 }} />,
        title: "Locations",
        description: "Farmhouses at all the best locations in and around Hyderabad, perfect for getaways, celebrations & retreats."
    },
    {
        icon: <AutoAwesomeIcon sx={{ fontSize: 32 }} />,
        title: "Seamless User Experience",
        description: "A hassle free experience with our seamless website design, ensuring quick navigation & instant confirmations."
    },
    {
        icon: <LocalOfferIcon sx={{ fontSize: 32 }} />,
        title: "Competitive Pricing",
        description: "Get top rated stays with premium amenities at the most budget friendly prices."
    },
    {
        icon: <VerifiedUserIcon sx={{ fontSize: 32 }} />,
        title: "Verified Properties",
        description: "Offering verified properties for a safe, reliable and unforgettable stay."
    },
    {
        icon: <BoltIcon sx={{ fontSize: 32 }} />,
        title: "Instant Booking",
        description: "Book your perfect farmhouse in just a few clicks with our hassle free instant booking feature."
    },
    {
        icon: <SupportAgentIcon sx={{ fontSize: 32 }} />,
        title: "24/7 Support",
        description: "Get 24/7 support to solve all your queries."
    }
];

const BenefitsSection = () => {
    return (
        <section className="inner_section py-20 relative overflow-hidden">
            <div className="relative z-10">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h4 className="text-4xl md:text-3xl vsm:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                        Why Choose InstaFarms for FarmHouses in Hyderabad?

                    </h4>
                    <p className="text-[18px] mb:text-[14px] vsm:text-[12px] text-gray-600 max-w-5xl vsm:max-w-lg mx-auto leading-relaxed">
                        We are dedicated to providing you with a seamless and memorable experience from start to finish.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-3 md:grid-cols-2 vsm:grid-cols-1 gap-8">
                    {benefitsData.map((benefit, index) => (
                        <div
                            key={index}
                            className="group relative bg-gray-50/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                            style={{
                                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`
                            }}
                        >
                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-[#8C684D] opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>

                            {/* Icon */}
                            <div className="relative z-10 mb-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8C684D] rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    {benefit.icon}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                <h6 className="text-xl font-bold text-[#8C684D] mb-4 transition-colors duration-300">
                                    {benefit.title}
                                </h6>
                                <p className="text-gray-600 leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>

                            {/* Decorative corner */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-100/50 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </section>
    );
};

export default BenefitsSection;