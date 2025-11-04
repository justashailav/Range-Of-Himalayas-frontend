import React from "react";
import {
  CheckCircle,
  Phone,
  FileText,
  ShieldCheck,
  RefreshCcw,
  AlertTriangle,
} from "lucide-react";
import { Helmet } from "react-helmet";

export default function RefundPolicy() {
  return (
    <div className="mx-auto  bg-[#FFF8E1] px-6 py-12">
     <Helmet>
        <title>Refund & Return Policy - Range Of Himalayas</title>
        <meta
          name="description"
          content="Range Of Himalayas refund, return, and cancellation policy. Learn how we ensure customer satisfaction with clear and transparent return and refund procedures for fresh Himalayan produce."
        />
      </Helmet>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-green-600" />
          Returns Policy
        </h1>
      </div>
      
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-10 flex items-start gap-4">
        <CheckCircle className="h-8 w-8 text-green-600 mt-1" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            100% Satisfaction Guarantee
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Your satisfaction matters to us. If for any reason you’re not happy
            with your purchase, our transparent return and refund policy ensures
            a smooth resolution.
          </p>
        </div>
      </div>
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Return Eligibility
        </h2>
        <p className="text-gray-700 mb-6">
          Due to the perishable nature of our products, returns are accepted
          only under specific circumstances.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <h3 className="font-semibold text-green-800 mb-3">
              ✅ Eligible for Returns:
            </h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>The product arrives damaged, spoiled, or defective</li>
              <li>
                The item is not as described or differs significantly from your
                order
              </li>
              <li>An incorrect product is delivered</li>
              <li>
                There are quality issues such as mold, rot, or excessive
                bruising
              </li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <h3 className="font-semibold text-red-800 mb-3">
              ❌ Not Eligible for Returns:
            </h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>
                Personal taste preferences — as natural produce can vary
                slightly in sweetness or texture.
              </li>
              <li>
                Minor natural marks or imperfections that occur in organically
                grown fruits.
              </li>
              <li>Products already consumed beyond a reasonable sample.</li>
              <li>Requests made more than 24 hours after delivery.</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Return Process
        </h2>
        <p className="text-gray-700 mb-6">
          To request a return, please submit a return request through our
          website within <strong>24 hours of delivery</strong>. Once your
          request is received, our quality assurance team will carefully review
          the case and determine whether it qualifies for a refund or
          replacement.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "Submit Request",
              desc: "File your return request on our website within 24 hours of delivery",
              icon: FileText,
            },
            {
              step: "Share Details",
              desc: "Upload clear photos,vedios and  a brief description of the issue",
              icon: Phone,
            },
            {
              step: "Team Review",
              desc: "Our support team examines your claim within 24–48 hours",
              icon: ShieldCheck,
            },
            {
              step: "Outcome",
              desc: "Your request will be approved or rejected based on evaluation",
              icon: RefreshCcw,
            },
          ].map(({ step, desc, icon: Icon }, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm"
            >
              <div className="p-3 rounded-full bg-green-100 w-fit mx-auto mb-3">
                <Icon className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{step}</h4>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-6 flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
          <p className="text-gray-800 text-sm leading-relaxed">
            <strong>Important Note:</strong> Please do not discard the products
            until our team has completed the review. Clear photographic evidence
            is required for all return requests.
          </p>
        </div>
      </section>

      {/* Refund Policy */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Refund Policy
        </h2>
        <p className="text-gray-700 mb-6">
          Once your return is approved, we process refunds promptly to ensure
          you receive your money back as quickly as possible.
        </p>

        {/* Timeline */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Refund Timeline:</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Return approval: 1–2 business days after claim submission</li>
            <li>Refund processing: 2–3 business days after approval</li>
            <li>
              Credit/debit card refunds: 5–7 business days to reflect in account
            </li>
            <li>UPI/wallet refunds: 1–3 business days to reflect</li>
            <li>Store credit: Immediately available upon approval</li>
          </ul>
        </div>

        {/* Refund Methods */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Refund Methods:</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Original payment method (default option)</li>
            <li>Store credit (with 5% bonus value)</li>
            <li>Replacement products (when available)</li>
          </ul>
        </div>
      </section>

      {/* Cancellation Policy */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Cancellation Policy
        </h2>
        <p className="text-gray-700 mb-6">
          We understand that circumstances may change after placing an order.
          Our cancellation policy is designed to be flexible while accounting
          for the preparation work that begins shortly after orders are placed.
        </p>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            Order Cancellation:
          </h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              Orders can be cancelled within 1 hour of placement with full
              refund
            </li>
            <li>Cancellation only possible before order processing begins</li>
            <li>Once packed or shipped, orders cannot be cancelled</li>
            <li>
              To cancel after dispatch, the order must be refused through
              courier or customer service
            </li>
            <li>
              Refunds for cancelled orders processed within 5–7 business days
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
