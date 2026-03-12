import React from "react";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import ourImage from "../assets/meandyug.png";
import farmImage from "../assets/royal-3.jpg";
import { Helmet } from "react-helmet";

export default function OurStory() {
  return (
    <div className="bg-[#FFFDF7]">
      <Helmet>
        <title>About Us – Range Of Himalayas</title>
        <meta
          name="description"
          content="Range Of Himalayas – Fresh fruits and naturally dried Himalayan dry fruits, grown and prepared with traditional mountain wisdom."
        />
      </Helmet>

      {/* HERO */}
      <section className="relative px-6 py-32 overflow-hidden bg-[#FCFAF7]">
  {/* Background Decorative Element - Subtle topographical lines or mist effect */}
  <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
  
  <div className="max-w-6xl mx-auto text-center relative z-10">
    {/* Animated Badge */}
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 border border-stone-200 shadow-sm"
    >
      <span className="text-amber-700 text-xs font-black uppercase tracking-[0.2em]">Our Heritage</span>
    </motion.div>

    {/* Main Headline */}
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="text-5xl md:text-7xl font-serif mt-8 text-stone-900 tracking-tight italic"
    >
      From Himalayan Orchards <br />
      <span className="text-[#B23A2E] not-italic font-black uppercase tracking-tighter">to Your Table</span>
    </motion.h2>

    {/* Story Text */}
    <motion.p 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 }}
      className="mt-10 max-w-2xl mx-auto text-lg md:text-xl text-stone-600 font-light leading-relaxed"
    >
      We are mountain growers and preservers from <span className="text-stone-900 font-medium">Himachal Pradesh</span>. 
      By cultivating apples and kiwis and slow-drying apricots in the high-altitude sun, 
      we capture the soul of the mountains in every bite.
    </motion.p>

    {/* CTAs */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.6 }}
      className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
    >
      <Link to="/viewproducts">
        <button className="w-full sm:w-auto bg-stone-900 text-white px-10 py-4 rounded-full font-bold hover:bg-[#B23A2E] transition-all duration-300 shadow-xl hover:-translate-y-1">
          Explore the Harvest
        </button>
      </Link>
      <button className="w-full sm:w-auto border border-stone-300 px-10 py-4 rounded-full font-bold text-stone-900 hover:bg-white transition-all duration-300">
        Our Journey
      </button>
    </motion.div>

    {/* Stats Grid - Now more "Gallery" style */}
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.8 }}
      className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-stone-200 pt-16"
    >
      <div className="flex flex-col items-center">
        <span className="text-4xl font-black text-stone-900">8,000 ft</span>
        <p className="text-stone-500 uppercase text-[10px] font-bold tracking-widest mt-2">Altitude Growth</p>
      </div>
      <div className="flex flex-col items-center border-y md:border-y-0 md:border-x border-stone-200 py-8 md:py-0">
        <span className="text-4xl font-black text-stone-900">10+ Years</span>
        <p className="text-stone-500 uppercase text-[10px] font-bold tracking-widest mt-2">Mountain Farming</p>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-4xl font-black text-stone-900">100% Raw</span>
        <p className="text-stone-500 uppercase text-[10px] font-bold tracking-widest mt-2">Sun-Dried Purity</p>
      </div>
    </motion.div>
  </div>

  {/* Visual Flourish: A faint mountain silhouette at the bottom */}
  <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-stone-200/50 to-transparent pointer-events-none" />
</section>

      {/* JOURNEY */}
      <section className="bg-gray-50 py-28 px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-20">
          🌱 Our Journey
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            {[
              {
                num: "01",
                title: "Mountain Orchard Roots",
                desc: "Our story begins in high-altitude Himalayan orchards where fruits grow slowly, shaped by cold winds and clean air.",
              },
              {
                num: "02",
                title: "Natural Drying Wisdom",
                desc: "Excess harvest is preserved through traditional sun and air drying—no chemicals, no machines, only patience.",
              },
              {
                num: "03",
                title: "Orchard & Drying House to Home",
                desc: "Fresh fruits and carefully prepared dry fruits travel directly from our hills to your kitchen.",
              },
            ].map((item) => (
              <div key={item.num}>
                <h3 className="text-3xl font-semibold flex items-center gap-4 text-gray-900">
                  <span className="text-red-600 font-bold text-2xl">
                    {item.num}.
                  </span>
                  {item.title}
                </h3>
                <p className="text-gray-600 text-lg mt-3 ml-12">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <img
              src={ourImage}
              alt="Our Himalayan Journey"
              className="rounded-2xl shadow-xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* WHAT MAKES US SPECIAL */}
      <section className="bg-gradient-to-b from-green-50 to-white py-28 px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-8">
          What Makes Us Different
        </h2>
        <p className="text-center max-w-2xl mx-auto text-lg text-gray-600 mb-20">
          Fresh or dried, every product reflects Himalayan purity, slow processes,
          and respect for nature.
        </p>

        <div className="grid md:grid-cols-3 gap-14 max-w-6xl mx-auto">
          {[
            {
              title: "Naturally Grown Fruits",
              desc: "Apples and kiwis grown without shortcuts, shaped by Himalayan climate.",
            },
            {
              title: "Slow-Dried Dry Fruits",
              desc: "Apricots and other fruits preserved using traditional sun & air drying.",
            },
            {
              title: "Honest Quality Control",
              desc: "Every batch is sorted, checked, and packed with care.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-10 bg-white rounded-3xl shadow-sm hover:shadow-lg transition text-center"
            >
              <h3 className="text-xl font-bold text-gray-900">
                {item.title}
              </h3>
              <p className="text-gray-600 mt-4">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-gray-50 py-28 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <span className="px-5 py-1.5 bg-green-200 text-green-800 rounded-full text-sm font-semibold">
              Why Choose Us
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6">
              Rooted in the Himalayas
            </h2>

            <p className="mt-8 text-lg text-gray-600 leading-relaxed">
              At 2,300m elevation, fruits ripen slowly and dry fruits mature
              naturally—locking in flavour, nutrition, and authenticity.
            </p>

            <div className="mt-12 grid sm:grid-cols-2 gap-6">
              {[
                { icon: "🌤️", title: "High-Altitude Climate", desc: "Naturally enhances taste and shelf life." },
                { icon: "💧", title: "Pure Himalayan Sources", desc: "Snowmelt water and clean mountain air." },
                { icon: "🍑", title: "Fresh & Dry Produce", desc: "Seasonal fruits and preserved dry fruits." },
                { icon: "🤝", title: "Generational Trust", desc: "Built on honesty and farming values." },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <img
              src={farmImage}
              alt="Himalayan Orchard"
              className="rounded-3xl shadow-xl object-cover"
            />
            <div className="absolute bottom-4 right-4 bg-white px-5 py-2 rounded-full shadow text-sm font-medium flex items-center gap-2">
              🌿 2,300m Himalayan Elevation
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
