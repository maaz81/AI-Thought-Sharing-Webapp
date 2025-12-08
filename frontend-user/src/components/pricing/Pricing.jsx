import React from "react";
import { FiCheck, FiZap, FiAward, FiStar, FiBarChart2, FiHeadphones, FiCreditCard } from "react-icons/fi";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      icon: FiStar,
      price: "$0",
      period: "month",
      description: "Perfect for getting started with Post Share.",
      features: [
        "Unlimited post creation",
        "Basic community access",
        "Like & comment on posts",
        "Basic analytics",
        "Standard support"
      ],
      buttonText: "Get Started",
      popular: false,
      accentColor: "from-brand-primary/20 to-brand-accent/10",
      textColor: "text-brand-primary",
      borderColor: "border-brand-border dark:border-brandDark-border",
      buttonStyle: "bg-brand-bg dark:bg-brandDark-bg text-brand-text dark:text-brandDark-text hover:bg-brand-surface dark:hover:bg-brandDark-surface border-2 border-brand-border dark:border-brandDark-border"
    },
    {
      name: "Pro",
      icon: FiZap,
      price: "$5",
      period: "month",
      description: "Great for active users who want AI assistance for better content.",
      features: [
        "Everything in Free",
        "AI-powered title suggestions",
        "AI-generated descriptions",
        "Smart hashtag/tag suggestions",
        "Advanced analytics",
        "Priority email support"
      ],
      buttonText: "Upgrade to Pro",
      popular: true,
      accentColor: "from-brand-primary/30 to-brand-accent/20",
      textColor: "text-brand-primary",
      borderColor: "border-brand-primary/30",
      buttonStyle: "bg-gradient-to-r from-brand-primary to-brand-primaryHover hover:from-brand-primaryHover hover:to-brand-primary text-white"
    },
    {
      name: "Premium",
      icon: FiAward,
      price: "$50",
      period: "year",
      description: "Best for professionals & businesses who want full power & savings.",
      features: [
        "Everything in Pro",
        "Advanced analytics dashboard",
        "Priority 24/7 support",
        "Extra monthly AI credits",
        "Custom branding options",
        "Team collaboration features"
      ],
      buttonText: "Go Premium",
      popular: false,
      accentColor: "from-brand-accent/20 to-brand-primary/10",
      textColor: "text-brand-accent",
      borderColor: "border-brand-accent/30",
      buttonStyle: "bg-gradient-to-r from-brand-accent to-brand-accent/80 hover:from-brand-accent/80 hover:to-brand-accent text-white"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-bg via-white to-brand-bg/50 dark:from-brandDark-bg dark:via-brandDark-surface dark:to-brandDark-bg/30 transition-colors duration-300">
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 mb-6">
            <FiCreditCard className="text-2xl text-brand-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-brand-text dark:text-brandDark-text mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-brand-muted dark:text-brandDark-muted mb-8">
            Choose the plan that fits your needs. No hidden fees, cancel anytime.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-brand-surface dark:bg-brandDark-surface rounded-xl p-1">
            <button className="px-6 py-3 rounded-lg font-medium text-brand-text dark:text-brandDark-text bg-brand-bg dark:bg-brandDark-bg">
              Monthly
            </button>
            <button className="px-6 py-3 rounded-lg font-medium text-brand-muted dark:text-brandDark-muted hover:text-brand-text dark:hover:text-brandDark-text">
              Yearly <span className="ml-2 px-2 py-1 text-xs bg-state-success/20 text-state-success rounded-full">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div
                key={index}
                className={`relative bg-brand-surface dark:bg-brandDark-surface rounded-2xl border-2 ${plan.borderColor} shadow-soft hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-gradient-to-r from-brand-primary to-brand-primaryHover text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.accentColor} mb-4`}>
                      <Icon className={`text-2xl ${plan.textColor}`} />
                    </div>
                    <h3 className={`text-2xl font-bold ${plan.textColor} mb-2`}>
                      {plan.name}
                    </h3>
                    <p className="text-brand-muted dark:text-brandDark-muted">
                      {plan.description}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-brand-text dark:text-brandDark-text">
                        {plan.price}
                      </span>
                      <span className="text-lg text-brand-muted dark:text-brandDark-muted ml-2">
                        /{plan.period}
                      </span>
                    </div>
                    {plan.period === "year" && (
                      <div className="mt-2 text-sm text-state-success font-medium">
                        Equivalent to $4.17/month
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-state-success/10 flex items-center justify-center mr-3 mt-0.5">
                          <FiCheck className="text-state-success text-sm" />
                        </div>
                        <span className="text-brand-text dark:text-brandDark-text">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 ${plan.buttonStyle}`}
                  >
                    {plan.buttonText}
                  </button>
                </div>

                {/* Additional Info */}
                <div className="border-t border-brand-border dark:border-brandDark-border bg-brand-bg/30 dark:bg-brandDark-bg/30 p-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center text-sm text-brand-muted dark:text-brandDark-muted">
                      <FiCheck className="mr-2 text-state-success" />
                      <span>No credit card required to start</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <h3 className="text-2xl font-bold text-brand-text dark:text-brandDark-text text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: "Can I switch plans later?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                q: "Is there a free trial?",
                a: "All plans start with a 14-day free trial. No credit card required."
              },
              {
                q: "How does billing work?",
                a: "Billing is automatic and recurring. You can cancel anytime from your account settings."
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 30-day money-back guarantee for annual plans."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-brand-surface dark:bg-brandDark-surface rounded-xl p-6 border border-brand-border dark:border-brandDark-border">
                <h4 className="font-semibold text-brand-text dark:text-brandDark-text mb-2">
                  {faq.q}
                </h4>
                <p className="text-sm text-brand-muted dark:text-brandDark-muted">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="max-w-4xl mx-auto mt-20 text-center">
          <div className="bg-gradient-to-r from-brand-primary/5 to-brand-accent/5 rounded-2xl p-8 border border-brand-border/50 dark:border-brandDark-border/50">
            <FiBarChart2 className="text-4xl text-brand-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-brand-text dark:text-brandDark-text mb-3">
              Need a custom plan for your team?
            </h3>
            <p className="text-brand-muted dark:text-brandDark-muted mb-6 max-w-2xl mx-auto">
              We offer custom enterprise solutions with advanced features, dedicated support, and volume discounts.
            </p>
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-primaryHover hover:from-brand-primaryHover hover:to-brand-primary text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
              <FiHeadphones className="mr-2" />
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}