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
      <section className="bg-[#0D0D0D] py-20 md:py-32 px-4 sm:px-8 lg:px-16 border-t border-white/5 overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        
        {/* TOP SECTION: Adaptive Layout */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20 md:mb-32">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-px w-8 bg-[#F08C7D]" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#F08C7D]">
                Information Bureau
              </span>
            </motion.div>
            
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.85]">
              Archive <br />
              <span className="font-serif italic capitalize tracking-normal text-stone-500 ml-4 md:ml-12">
                Inquiries
              </span>
            </h2>
          </div>

          <div className="lg:text-right">
            <p className="text-stone-500 text-xs md:text-sm uppercase tracking-[0.2em] max-w-xs lg:ml-auto leading-relaxed">
              Detailed protocols regarding our <br className="hidden md:block" /> 
              high-altitude harvests and logistics.
            </p>
          </div>
        </div>

        {/* MAIN CONTENT: Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT: Category Navigation (Hidden on Mobile, Sticky on Desktop) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-32 h-fit">
            <nav className="flex flex-col gap-6">
              {faqCategories.map((cat, idx) => (
                <button
                  key={idx}
                  className="text-left group flex items-center gap-4"
                  onClick={() => {/* Add scroll-to-section logic here */}}
                >
                  <span className="text-[10px] font-serif italic text-stone-600 group-hover:text-[#F08C7D] transition-colors">
                    0{idx + 1}
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-stone-500 group-hover:text-white transition-colors">
                    {cat.heading}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* RIGHT: The FAQ Accordion */}
          <div className="lg:col-span-9 space-y-24">
            {faqCategories.map((cat, catIdx) => (
              <div key={catIdx} className="group/section">
                
                {/* Category Header */}
                <div className="flex items-baseline gap-4 mb-10">
                  <span className="text-[10px] font-serif italic text-[#F08C7D]/50">0{catIdx + 1}</span>
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.5em]">
                    {cat.heading}
                  </h3>
                  <div className="h-px flex-1 bg-white/5 group-hover/section:bg-[#F08C7D]/20 transition-colors duration-700" />
                </div>

                <div className="divide-y divide-white/5">
                  {cat.faqs.map((faq, faqIdx) => {
                    const isOpen = openIndex[catIdx] === faqIdx;

                    return (
                      <motion.div key={faqIdx} layout className="overflow-hidden">
                        <button
                          onClick={() => toggleFAQ(catIdx, faqIdx)}
                          className="w-full flex justify-between items-center py-8 md:py-10 text-left group/btn"
                        >
                          <span className={`text-lg md:text-2xl uppercase tracking-tight transition-all duration-500 max-w-[85%] ${
                            isOpen ? "text-white translate-x-4" : "text-stone-500 group-hover/btn:text-stone-200"
                          }`}>
                            {faq.question}
                          </span>
                          
                          <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                            <span className={`absolute h-[1px] w-6 bg-[#F08C7D] transition-transform duration-700 ${isOpen ? "rotate-0 opacity-100" : "rotate-90 opacity-40"}`} />
                            <span className={`absolute h-[1px] w-6 bg-[#F08C7D] transition-all duration-700 ${isOpen ? "opacity-100" : "opacity-40"}`} />
                          </div>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0, y: -10 }}
                              animate={{ height: "auto", opacity: 1, y: 0 }}
                              exit={{ height: 0, opacity: 0, y: -10 }}
                              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            >
                              <div className="pb-12 pl-4 md:pl-20 max-w-3xl">
                                <p className="text-stone-400 text-base md:text-lg leading-relaxed font-serif italic">
                                  {faq.answer}
                                </p>
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: 40 }}
                                  className="h-px bg-[#F08C7D]/40 mt-6" 
                                />
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
        </div>
      </div>
    </section>
    </div>
  );
}
