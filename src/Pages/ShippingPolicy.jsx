import React from "react";
import {
  Truck,
  ShieldCheck,
  CheckCircle,
  PackageCheck,
  MapPin,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Helmet } from "react-helmet";

const steps = [
  {
    icon: CheckCircle,
    title: "Order Confirmation",
    desc: "An instant confirmation email is sent right after you place your order.",
  },
  {
    icon: PackageCheck,
    title: "Processing",
    desc: "Your order is processed and packed within 24 hours on business days.",
  },
  {
    icon: Truck,
    title: "Tracking",
    desc: "Track your order anytime using your Order ID. You’ll receive email updates at every stage.",
  },
  {
    icon: MapPin,
    title: "Delivery",
    desc: "A final email notification is sent once your order has been successfully delivered.",
  },
];

const deliveryNotes = [
  "Someone must be available to receive the delivery.",
  "A valid ID may be required for delivery verification.",
  "We will attempt delivery up to 2–3 times before returning the order.",
  "Delivery address cannot be updated once the order is placed.",
  "Delivery times are estimated and not guaranteed.",
  "Delays may occur due to weather, festivals, or other unforeseen circumstances.",
];

export default function ShippingPolicy() {
  return (
    <div className="mx-auto bg-[#FFF8E1] px-6 py-12">
      <Helmet>
        <title>Shipping Policy - Range Of Himalayas</title>
        <meta
          name="description"
          content="Learn about Range Of Himalayas' shipping policy — delivery timelines, areas covered, and our commitment to fresh Himalayan produce, delivered Pan India."
        />
        <meta
          name="keywords"
          content="Shipping policy, delivery, Range Of Himalayas, fresh apples, kiwis, Pan India delivery"
        />
        <meta name="author" content="Range Of Himalayas" />
      </Helmet>
      {/* Header Section */}
      <div className="bg-[#FFF8E1] rounded-2xl shadow-md p-8 mb-8 text-center">
        <div className="flex justify-center mb-4">
          <Truck className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Nature’s Freshness, Right to Your Door
        </h1>
      </div>

      {/* Commitment Section */}
      <div className="bg-[#FFF8E1] border border-gray-200 rounded-xl p-6 mb-10 flex items-start gap-4">
        <ShieldCheck className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Our Himalayan Promise
          </h2>
          <p className="text-gray-700 leading-relaxed">
            At Range Of Himalayas, our mission is to offer you premium,
            farm-fresh apples delivered with care and efficiency. From the
            moment you place your order until it reaches your hands, we ensure a
            seamless experience that leaves you with both peace of mind and a
            taste of nature’s purity.
          </p>
        </div>
      </div>

      {/* --- NEW Order Processing Section --- */}
      <div className="bg-[#FFF8E1] rounded-2xl shadow-md p-8 space-y-12 mb-10">
        <section>
          <h2 className="text-2xl font-bold text-gray-900">Order Processing</h2>
          <p className="text-gray-700 mt-2 mb-8">
            Once your order is placed and payment confirmed, our team prepares
            your products with care to ensure they arrive in perfect condition.
          </p>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ icon: Icon, title, desc }, index) => (
              <div
                key={index}
                className="bg-[#FFF8E1] border border-gray-200 rounded-xl p-5 text-center"
              >
                <Icon className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Special Delivery Considerations */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900">
            Special Delivery Considerations
          </h2>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-blue-600" />
              Important Information:
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {deliveryNotes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* --- NEW Order Tracking Section --- */}
      <div className="bg-[#FFF8E1] rounded-2xl shadow-md p-8 mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Order Tracking
        </h2>
        <p className="text-gray-700 mb-6">
          You can track your order in real-time directly on our website using
          your Order ID provided at the time of purchase.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <Clock className="h-6 w-6 text-green-700 mt-1" />
          <p className="text-green-800 text-sm leading-relaxed">
            Most deliveries are completed within the estimated timeframe, but
            please allow for occasional delays due to factors beyond our
            control.
          </p>
        </div>
      </div>

      {/* --- Existing Shipping Policy Section --- */}
      <div className="bg-[#FFF8E1] rounded-2xl shadow-md p-8 space-y-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Truck className="h-7 w-7 text-gray-800" />
          Shipping Policy
        </h2>

        {/* Delivery Areas & Timeframes */}
        <section>
          <h3 className="text-xl font-semibold mb-2">
            Delivery Areas & Timeframes
          </h3>
          <p className="text-gray-700 mb-6">
            We currently deliver across India. Delivery times vary based on your
            location, weather conditions, and product availability.
          </p>

          {/* Delivery Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FFF8E1] border border-gray-200 rounded-xl p-5">
              <h4 className="font-semibold text-gray-900 mb-1">Metro Cities</h4>
              <p className="text-gray-700 mb-2">
                2–4 business days after dispatch
              </p>
              <p className="text-sm text-gray-600">
                Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune
              </p>
            </div>

            <div className="bg-[#FFF8E1] border border-gray-200 rounded-xl p-5">
              <h4 className="font-semibold text-gray-900 mb-1">
                Tier 2 Cities
              </h4>
              <p className="text-gray-700 mb-2">
                3–6 business days after dispatch
              </p>
              <p className="text-sm text-gray-600">
                State capitals and major towns
              </p>
            </div>

            <div className="bg-[#FFF8E1] border border-gray-200 rounded-xl p-5">
              <h4 className="font-semibold text-gray-900 mb-1">Remote Areas</h4>
              <p className="text-gray-700 mb-2">
                5–10 business days after dispatch
              </p>
              <p className="text-sm text-gray-600">
                Rural and remote locations
              </p>
            </div>
          </div>
        </section>

        {/* Shipping Charges */}
        <section>
          <h3 className="text-xl font-semibold mb-2">Shipping Charges</h3>
          <p className="text-green-700 font-medium">
            All our deliveries are free across India. No hidden fees, no extra
            charges — just fresh products delivered with care.
          </p>

          <div className="bg-[#FFF8E1] border border-gray-200 rounded-xl p-4 mt-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              Shipping Rates:
            </h4>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Complimentary standard delivery on all orders</li>
              <li>No additional charges for express or priority delivery</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
