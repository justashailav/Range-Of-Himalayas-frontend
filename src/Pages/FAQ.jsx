import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Helmet } from "react-helmet";

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
    <div>
      <Helmet>
        <title>FAQ – Range Of Himalayas</title>
        <meta
          name="description"
          content="Find answers to the most frequently asked questions about our Himalayan fruits, delivery, storage tips, ordering process, and more."
        />
        <meta property="og:title" content="FAQ – Range Of Himalayas" />
        <meta
          property="og:description"
          content="Everything you need to know about our fruits, delivery, packing, and services."
        />
      </Helmet>
      <section className="bg-[#0D0D0D] py-24 px-6 sm:px-10 border-t border-white/5">
  {/* HEADER: Minimalist & Centered */}
  <div className="max-w-4xl mx-auto text-center mb-20">
    <motion.span 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-[10px] font-black uppercase tracking-[0.5em] text-[#F08C7D] mb-4 block"
    >
      Information Bureau
    </motion.span>
    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mt-4 mb-6">
      Archive <span className="font-serif italic capitalize tracking-normal text-stone-400">Inquiries</span>
    </h2>
    <div className="h-px w-12 bg-[#F08C7D]/40 mx-auto mb-6" />
    <p className="text-stone-500 text-sm uppercase tracking-widest max-w-lg mx-auto">
      Details regarding our high-altitude harvests, transit logistics, and botanical heritage.
    </p>
  </div>

  {/* FAQ BODY */}
  <div className="max-w-3xl mx-auto space-y-16">
    {faqCategories.map((cat, catIdx) => (
      <div key={catIdx} className="space-y-6">
        {/* Category Heading with thin line */}
        <div className="flex items-center gap-4">
          <h3 className="text-[11px] font-black text-stone-500 uppercase tracking-[0.4em] whitespace-nowrap">
            {cat.heading}
          </h3>
          <div className="h-[1px] w-full bg-white/5" />
        </div>

        <div className="space-y-2">
          {cat.faqs.map((faq, faqIdx) => {
            const isOpen = openIndex[catIdx] === faqIdx;

            return (
              <motion.div
                key={faqIdx}
                layout
                className={`overflow-hidden transition-all duration-500 border-b border-white/5 ${
                  isOpen ? "bg-white/[0.02]" : "bg-transparent"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(catIdx, faqIdx)}
                  className="w-full flex justify-between items-center py-6 text-left outline-none group"
                >
                  <span className={`text-base md:text-lg uppercase tracking-wider transition-colors duration-300 ${
                    isOpen ? "text-[#F08C7D] font-bold" : "text-stone-300 group-hover:text-white"
                  }`}>
                    {faq.question}
                  </span>
                  
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    {/* Minimalist plus-to-minus icon */}
                    <span className={`absolute h-px w-5 bg-stone-500 transition-transform duration-500 ${isOpen ? "rotate-0" : "rotate-90"}`} />
                    <span className="absolute h-px w-5 bg-stone-500" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="pb-8 pr-12 text-stone-400 text-sm leading-relaxed font-serif italic">
                        {faq.answer}
                      </div>
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
    </div>
  );
}
