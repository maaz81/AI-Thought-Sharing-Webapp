import React from "react";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "month",
      description: "Perfect for getting started with Post Share.",
      features: [
        "Unlimited post creation",
        "Basic community access",
        "Like & comment on posts",
      ],
      buttonText: "Get Started",
      buttonColor: "bg-gray-800 hover:bg-gray-900",
    },
    {
      name: "Pro",
      price: "$5",
      period: "month",
      description:
        "Great for active users who want AI assistance for better content.",
      features: [
        "Everything in Free",
        "AI-powered title suggestions",
        "AI-generated descriptions (3 versions)",
        "Smart hashtag/tag suggestions",
      ],
      buttonText: "Upgrade to Pro",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Premium",
      price: "$50",
      period: "year",
      description:
        "Best for professionals & businesses who want full power & savings.",
      features: [
        "Everything in Pro",
        "Advanced analytics dashboard",
        "Priority support",
        "Extra monthly AI credits",
      ],
      buttonText: "Go Premium",
      buttonColor: "bg-yellow-500 hover:bg-yellow-600",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8 dark:bg-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">Pricing Plans</h2>
        <p className="mt-4 text-lg text-gray-600">
          Choose the plan that fits your needs. Upgrade anytime.
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between border hover:shadow-xl transition-shadow"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
              <p className="mt-4 text-gray-600">{plan.description}</p>
              <div className="mt-6">
                <span className="text-4xl font-extrabold dark:text-black">{plan.price}</span>
                <span className="text-gray-600 ">/{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-3 text-gray-600">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    ✅ <span className="ml-2">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <button
                className={`w-full text-white py-3 px-6 rounded-lg font-semibold ${plan.buttonColor}`}
              >
                {plan.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
