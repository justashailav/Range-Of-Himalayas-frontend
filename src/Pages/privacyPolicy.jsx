import React from "react";
import { Helmet } from "react-helmet";

const sections = [
  {
    id: 1,
    title: "Introduction",
    content: (
      <>
        <p className="text-gray-700">
          Range of Himalayas (“we”, “our”, or “us”) operates the website{" "}
          <a
            href="https://www.rangeofhimalayas.co.in"
            target="_blank"
            rel="noreferrer"
            className="text-green-700 font-medium hover:underline"
          >
            www.rangeofhimalayas.co.in
          </a>
          , mobile applications, and related services. This Privacy Policy
          explains how we collect, use, and protect your personal information.
          By using our services, you agree to the practices described below.
        </p>
      </>
    ),
  },
  {
    id: 2,
    title: "Information We Collect",
    content: (
      <>
        <h3 className="font-semibold text-gray-900 mt-4 mb-2 text-lg">
          2.1 Personal Information
        </h3>
        <p className="text-gray-700">
          We collect personal information that you voluntarily provide when you
          create an account, place an order, or contact us for support. This may
          include:
        </p>
        <ul className="list-disc ml-6 text-gray-700 mt-2 space-y-1">
          <li>Full name, email address, and phone number</li>
          <li>Billing and shipping address</li>
          <li>Order details and payment information (processed securely)</li>
          <li>Photos or documents provided for return requests</li>
        </ul>

        <h3 className="font-semibold text-gray-900 mt-4 mb-2 text-lg">
          2.2 Automatically Collected Information
        </h3>
        <ul className="list-disc ml-6 text-gray-700 space-y-1">
          <li>Device details (type, browser, operating system)</li>
          <li>IP address and approximate location</li>
          <li>Pages visited, time spent, and interactions on our site</li>
          <li>Cookies and analytics information</li>
        </ul>

        <h3 className="font-semibold text-gray-900 mt-4 mb-2 text-lg">
          2.3 Information from Third Parties
        </h3>
        <p className="text-gray-700">
          We may receive information from payment gateways, courier partners, or
          social media accounts if you interact with us there.
        </p>
      </>
    ),
  },
  {
    id: 3,
    title: "How We Use Your Information",
    content: (
      <>
        <div className="grid md:grid-cols-2 gap-6 mt-3">
          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <h4 className="font-semibold text-green-800 mb-2">
              Service & Order Processing
            </h4>
            <ul className="list-disc ml-5 text-gray-700 space-y-1 text-sm">
              <li>Process and fulfill your orders efficiently</li>
              <li>Send order confirmations and updates via email</li>
              <li>Provide customer service and handle return requests</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <h4 className="font-semibold text-green-800 mb-2">
              Improving Our Services
            </h4>
            <ul className="list-disc ml-5 text-gray-700 space-y-1 text-sm">
              <li>Analyze website performance and user feedback</li>
              <li>Enhance shopping experience and security</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <h4 className="font-semibold text-green-800 mb-2">
              Communication & Marketing
            </h4>
            <ul className="list-disc ml-5 text-gray-700 space-y-1 text-sm">
              <li>Send transactional emails about your orders</li>
              <li>
                Send promotional updates only if you’ve opted in (you can opt
                out anytime)
              </li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <h4 className="font-semibold text-green-800 mb-2">
              Security & Compliance
            </h4>
            <ul className="list-disc ml-5 text-gray-700 space-y-1 text-sm">
              <li>Detect and prevent fraud or misuse</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 4,
    title: "Your Rights & Choices",
    content: (
      <>
        <p className="text-gray-700">
          You have certain rights regarding your personal data, including:
        </p>
        <ul className="list-disc ml-6 text-gray-700 mt-2 space-y-1">
          <li>Right to access and receive a copy of your data</li>
          <li>Right to request correction or deletion of data</li>
          <li>Right to withdraw consent for marketing communications</li>
          <li>Right to object to processing for legitimate reasons</li>
        </ul>
        <p className="text-gray-700 mt-3">
          To exercise your rights, please contact us using the details below. We
          will verify your request and respond within a reasonable timeframe.
        </p>
      </>
    ),
  },
  {
    id: 5,
    title: "Data Retention & Storage",
    content: (
      <p className="text-gray-700">
        We retain your personal data only as long as necessary to fulfill your
        orders, comply with legal obligations, and improve our services. Data
        used for analytics is stored in anonymized form wherever possible.
      </p>
    ),
  },
  {
    id: 6,
    title: "Sharing & Disclosure",
    content: (
      <>
        <p className="text-gray-700">
          We do not sell or rent your personal information. We may share limited
          data with trusted third parties who assist in:
        </p>
        <ul className="list-disc ml-6 text-gray-700 mt-2 space-y-1">
          <li>Processing secure payments (e.g., Razorpay)</li>
          <li>Delivering your orders (courier/logistics partners)</li>
          <li>Providing analytics and website improvements</li>
          <li>Complying with legal requirements or court orders</li>
        </ul>
      </>
    ),
  },
  {
    id: 7,
    title: "Children’s Privacy",
    content: (
      <p className="text-gray-700">
        Our services are not directed to children under 18. We do not knowingly
        collect personal information from minors. If we discover such data, we
        will delete it promptly.
      </p>
    ),
  },
  {
    id: 8,
    title: "Changes to This Policy",
    content: (
      <p className="text-gray-700">
        We may update this Privacy Policy periodically to reflect changes in our
        operations or legal requirements. Any updates will be posted on this
        page with an updated "Last Revised" date.
      </p>
    ),
  },
  {
    id: 9,
    title: "Contact Us",
    content: (
      <div className="text-gray-700">
        <p>If you have any questions or concerns, reach out to us at:</p>
        <div className="mt-2 space-y-1">
          <p>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:contactrangeofhimalayas@gmail.co.in"
              className="text-green-700 hover:underline"
            >
              contactrangeofhimalayas@gmail.co.in
            </a>
          </p>
          <p>
            <strong>Phone:</strong>{" "}
            <a href="tel:+916230867344" className="text-green-700 hover:underline">
              +91 62308 67344
            </a>
          </p>
          <p>
            <strong>Service Area:</strong> Pan-India
          </p>
        </div>
      </div>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <section className="bg-[#FFF8E1] py-16 px-6 sm:px-10">
    <Helmet>
        <title>Privacy Policy | Range of Himalayas</title>
        <meta
          name="description"
          content="Read the Privacy Policy of Range of Himalayas — learn how we collect, use, and protect your personal data when you shop for fresh apples, kiwis, and Himalayan produce."
        />
        <link rel="canonical" href="https://www.rangeofhimalayas.co.in/privacy-policy" />
      </Helmet>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            🔒 Privacy Policy
          </div>
          <h1 className="text-4xl font-extrabold text-[#1A3C34] mt-4 mb-2">
            Your Privacy Matters to Us
          </h1>
          
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6"
            >
              <h2 className="flex items-center gap-2 text-2xl font-bold text-[#184d3b] mb-3">
                <span className="bg-green-50 text-green-800 font-semibold rounded-md px-3 py-1 text-sm">
                  {section.id}
                </span>
                {section.title}
              </h2>
              <div className="text-gray-700 leading-relaxed">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        <footer className="text-center text-gray-500 text-sm mt-12">
          © {new Date().getFullYear()} Range of Himalayas. All rights reserved.
        </footer>
      </div>
    </section>
  );
}
