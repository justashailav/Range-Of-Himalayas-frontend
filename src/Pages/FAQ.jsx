import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqCategories = [
  {
    heading: "🧺 About Our Products",
    faqs: [
      {
        question: "Are your apples and kiwis organic or naturally grown?",
        answer:
          "Yes, all our fruits are naturally grown in the pristine Himalayan valleys without artificial ripening or harmful chemicals.",
      },
      {
        question: "Where are your fruits sourced from?",
        answer:
          "All our fruits are grown in our own orchards nestled in the pristine valleys of Himachal Pradesh. This allows us to maintain full control over quality, freshness, and natural growing practices — straight from our farms to your table.",
      },
      {
        question: "How fresh are the fruits when delivered?",
        answer:
          "Our fruits are freshly picked from our orchards, carefully packed the same day, and shipped promptly so they reach you naturally fresh and full of flavor — just as they are from the Himalayas.",
      },
    ],
  },
  {
    heading: "🚚 Ordering & Shipping",
    faqs: [
      {
        question: "How long does delivery take?",
        answer:
          "Typically, orders reach you within 2–5 business days, depending on your location.",
      },
      {
        question: "Do you ship across India?",
        answer: "Yes, we deliver pan-India via trusted courier partners.",
      },
      {
        question: "How can I track my order?",
        answer:
          "You can track your order using your ORDER ID by visiting our website’s “Track your Order” section.",
      },
    ],
  },
  {
    heading: "🔄 Returns & Replacements",
    faqs: [
      {
        question: "What if my fruits arrive damaged or spoiled?",
        answer:
          "We offer a 100% replacement guarantee. Just share photos of the damaged items within 24 hours of delivery, and we'll make it right.",
      },
    ],
  },
  {
    heading: "🍏 Product Care & Storage",
    faqs: [
      {
        question: "Are your apples wax-free?",
        answer:
          "Absolutely. Our apples are 100% wax-free and naturally shiny. We never use synthetic coatings.",
      },
      {
        question: "How should I store fruits after delivery?",
        answer:
          "Store them in a cool, dry place or refrigerate in the fruit drawer to retain crispness for up to four weeks.",
      },
    ],
  },
  {
    heading: "💳 Payments",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept secure online payments through Razorpay — including all major debit/credit cards, UPI, and Net Banking.",
      },
    ],
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState({});

  const toggleFAQ = (catIdx, faqIdx) => {
    setOpenIndex((prev) => ({
      ...prev,
      [catIdx]: prev[catIdx] === faqIdx ? null : faqIdx,
    }));
  };

  return (
    <section className="bg-gradient-to-b from-[#FFF8E1] to-white py-16 px-6 sm:px-10">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          🌿 Frequently Asked Questions
        </span>
        <h2 className="text-4xl font-extrabold text-[#3B2F2F] mt-4 mb-3">
          Your Questions, Answered
        </h2>
        <p className="text-gray-600 text-lg">
          Everything you need to know about our fruits, delivery, and story.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-10">
        {faqCategories.map((cat, catIdx) => (
          <div key={catIdx}>
            <h3 className="text-2xl font-bold text-[#6B3E26] mb-4">
              {cat.heading}
            </h3>

            <div className="space-y-3">
              {cat.faqs.map((faq, faqIdx) => {
                const isOpen = openIndex[catIdx] === faqIdx;

                return (
                  <motion.div
                    key={faqIdx}
                    layout
                    transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => toggleFAQ(catIdx, faqIdx)}
                      className="w-full flex justify-between items-center px-6 py-4 text-left hover:bg-[#FFF4E6] transition-colors"
                    >
                      <span className="font-semibold text-[#3B2F2F] text-lg">
                        {faq.question}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.35 }}
                      >
                        <ChevronDown className="text-[#3B2F2F]" />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          layout
                          initial={{ opacity: 0, scaleY: 0.9 }}
                          animate={{ opacity: 1, scaleY: 1 }}
                          exit={{ opacity: 0, scaleY: 0.9 }}
                          transition={{
                            duration: 0.45,
                            ease: [0.25, 0.1, 0.25, 1],
                          }}
                          className="origin-top px-6 pb-4 text-gray-700 text-base leading-relaxed bg-white"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
