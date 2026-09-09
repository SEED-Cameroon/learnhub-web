import { useState } from "react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "0 FCFA",
    description: "Get started with basic learning features.",
    features: [
      "Access selected courses",
      "Track your learning progress",
      "Join the community",
    ],
  },
  {
    name: "Student",
    price: "5,000 FCFA",
    description: "Perfect for students who want more learning resources.",
    features: [
      "Access all courses",
      "Full learning progress tracking",
      "Community access",
      "Certificates",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "10,000 FCFA",
    description: "Advanced learning experience for serious learners.",
    features: [
      "Everything in Student",
      "Premium learning resources",
      "Priority support",
      "Advanced certificates",
    ],
  },
];

function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Mobile Money");
  const [message, setMessage] = useState("");

  const handleSubscribe = (plan) => {
    setSelectedPlan(plan);
    setMessage("");
  };

  const handlePayment = (event) => {
    event.preventDefault();

    setMessage(
      `Demo payment initiated for the ${selectedPlan.name} plan. No real payment was processed.`
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* NAVBAR */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            to="/dashboard"
            className="text-2xl font-extrabold text-blue-600"
          >
            LearnHub
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link
              to="/dashboard"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              Dashboard
            </Link>

            <Link
              to="/courses"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              Courses
            </Link>

            <Link
              to="/my-courses"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              My Courses
            </Link>

            <Link
              to="/profile"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              Profile
            </Link>

            <Link
              to="/community"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              Community
            </Link>

            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
              Subscription
            </span>
          </div>
        </div>
      </nav>

      {/* HEADER */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            LearnHub Plans
          </p>

          <h1 className="mt-3 text-4xl font-extrabold text-slate-900 md:text-5xl">
            Choose the right plan for your learning journey
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            Upgrade your learning experience with flexible plans designed for
            students.
          </p>
        </div>

        {/* PLANS */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                plan.popular
                  ? "border-blue-500 ring-2 ring-blue-100"
                  : "border-slate-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute right-5 top-5 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                  MOST POPULAR
                </div>
              )}

              <h2 className="text-2xl font-bold text-slate-900">
                {plan.name}
              </h2>

              <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
                {plan.description}
              </p>

              <div className="mt-6">
                <span className="text-3xl font-extrabold text-slate-900">
                  {plan.price}
                </span>

                {plan.price !== "0 FCFA" && (
                  <span className="text-sm text-slate-500"> / month</span>
                )}
              </div>

              <div className="my-6 border-t border-slate-100" />

              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-slate-700"
                  >
                    <span className="mt-0.5 font-bold text-green-600">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => handleSubscribe(plan)}
                className={`mt-8 w-full rounded-xl px-5 py-3 font-bold transition ${
                  plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {plan.price === "0 FCFA" ? "Get Started" : "Choose Plan"}
              </button>
            </div>
          ))}
        </div>

        {/* PAYMENT DEMO */}
        {selectedPlan && (
          <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
            <div className="mb-6">
              <p className="text-sm font-semibold text-blue-600">
                SUBSCRIPTION CHECKOUT
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                {selectedPlan.name} Plan
              </h2>

              <p className="mt-1 text-slate-600">
                Amount:{" "}
                <span className="font-bold text-slate-900">
                  {selectedPlan.price}
                </span>
              </p>
            </div>

            {message && (
              <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
                {message}
              </div>
            )}

            <form onSubmit={handlePayment} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Payment Method
                </label>

                <select
                  value={paymentMethod}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option>Mobile Money</option>
                  <option>MTN Mobile Money</option>
                  <option>Orange Money</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Mobile Number
                </label>

                <input
                  type="tel"
                  placeholder="Demo number only"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-800">
                  Demo Payment
                </p>

                <p className="mt-1">
                  This is a frontend demonstration. No real transaction will
                  take place.
                </p>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white transition hover:bg-blue-700"
              >
                Continue to Payment
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default Subscription;