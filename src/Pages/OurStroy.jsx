import React from "react";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import ourImage from "../assets/meandyug.png";
import farmImage from "../assets/royal-3.jpg";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Droplets,
  TreeDeciduous,
  Users,
  Heart,
  User,
  LogOut,
} from "lucide-react";
export default function OurStory() {
  return (
    <div className="bg-[#FFFDF7] overflow-x-hidden">
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
            <span className="text-amber-700 text-xs font-black uppercase tracking-[0.2em]">
              Our Heritage
            </span>
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
            <span className="text-[#B23A2E] not-italic font-black uppercase tracking-tighter">
              to Your Table
            </span>
          </motion.h2>

          {/* Story Text */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-10 max-w-2xl mx-auto text-lg md:text-xl text-stone-600 font-light leading-relaxed"
          >
            We are mountain growers and preservers from{" "}
            <span className="text-stone-900 font-medium">Himachal Pradesh</span>
            . By cultivating apples and kiwis and slow-drying apricots in the
            high-altitude sun, we capture the soul of the mountains in every
            bite.
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
              <span className="text-4xl font-black text-stone-900">
                8,000 ft
              </span>
              <p className="text-stone-500 uppercase text-[10px] font-bold tracking-widest mt-2">
                Altitude Growth
              </p>
            </div>
            <div className="flex flex-col items-center border-y md:border-y-0 md:border-x border-stone-200 py-8 md:py-0">
              <span className="text-4xl font-black text-stone-900">
                10+ Years
              </span>
              <p className="text-stone-500 uppercase text-[10px] font-bold tracking-widest mt-2">
                Mountain Farming
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-black text-stone-900">
                100% Raw
              </span>
              <p className="text-stone-500 uppercase text-[10px] font-bold tracking-widest mt-2">
                Sun-Dried Purity
              </p>
            </div>
          </motion.div>
        </div>

        {/* Visual Flourish: A faint mountain silhouette at the bottom */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-stone-200/50 to-transparent pointer-events-none" />
      </section>

      {/* JOURNEY */}
      <section className="bg-white py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <span className="text-[#B23A2E] font-black uppercase tracking-[0.3em] text-xs">
              The Process
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-stone-900 mt-4 tracking-tighter">
              A Journey of{" "}
              <span className="italic font-serif font-light text-stone-500">
                Patience.
              </span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* LEFT SIDE: Animated Timeline Steps */}
            <div className="relative pl-8 md:pl-12">
              {/* The Vertical Line Connecting Steps */}
              <div className="absolute left-0 top-2 bottom-2 w-[1px] bg-stone-200">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="w-full bg-[#B23A2E]"
                />
              </div>

              <div className="space-y-20">
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
                    title: "From Orchard to Table",
                    desc: "Fresh fruits and carefully prepared dry fruits travel directly from our hills to your kitchen, maintaining peak purity.",
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={item.num}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                    className="relative group"
                  >
                    {/* The Dot on the Timeline */}
                    <div className="absolute -left-[33px] md:-left-[49px] top-2 w-4 h-4 rounded-full bg-white border-2 border-[#B23A2E] z-10 group-hover:scale-125 transition-transform" />

                    <div className="flex flex-col">
                      <span className="text-[#B23A2E] font-black text-sm tracking-widest mb-2">
                        STEP {item.num}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-black text-stone-900 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-stone-500 text-lg mt-4 leading-relaxed max-w-md font-light">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE: Styled Image Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="sticky top-32"
            >
              <div className="relative p-4 bg-stone-50 border border-stone-200 rounded-2xl shadow-2xl">
                <img
                  src={ourImage}
                  alt="Our Himalayan Journey"
                  className="rounded-xl w-full h-[500px] object-cover filter contrast-[1.1] sepia-[0.1]"
                />
                {/* Decorative Label on Image */}
                <div className="absolute -bottom-6 -right-6 bg-stone-900 text-white p-6 rounded-xl hidden md:block shadow-2xl">
                  <p className="text-xs uppercase tracking-[0.3em] font-bold text-stone-400">
                    Location
                  </p>
                  <p className="text-lg font-serif italic mt-1">
                    Himachal Pradesh, India
                  </p>
                </div>
              </div>

              {/* Subtle Backdrop Glow */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-stone-100/50 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHAT MAKES US SPECIAL */}
      <section className="relative py-32 px-6 bg-[#FAF9F6]">
        {/* Decorative Background Blur */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-100/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header with Luxury Typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-6xl font-black text-stone-900 tracking-tighter mb-6">
              The{" "}
              <span className="italic font-serif font-light text-stone-500 underline decoration-red-200 underline-offset-8">
                Difference
              </span>{" "}
              is Altitude.
            </h2>
            <p className="max-w-xl mx-auto text-stone-500 text-lg md:text-xl font-light leading-relaxed">
              Fresh or dried, every product reflects Himalayan purity, slow
              processes, and respect for nature.
            </p>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Naturally Grown Fruits",
                tag: "Zero Shortcuts",
                icon: "🏔️",
                desc: "Apples and kiwis grown without shortcuts, shaped entirely by the harsh yet rewarding Himalayan climate.",
              },
              {
                title: "Slow-Dried Heritage",
                tag: "Sun & Air Only",
                icon: "☀️",
                desc: "Apricots and wild fruits preserved using traditional methods—no sulfur, no machines, just mountain sun.",
              },
              {
                title: "Honest Quality Control",
                tag: "Batch Sorted",
                icon: "⚖️",
                desc: "Every single batch is sorted by hand, checked for purity, and packed with the care of a family orchard.",
              },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                whileHover={{ y: -10 }}
                className="group relative p-10 bg-white border border-stone-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all duration-500"
              >
                {/* Icon Circle */}
                <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:bg-[#B23A2E] group-hover:rotate-12 transition-all duration-500">
                  <span className="group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                </div>

                {/* Benefit Tag */}
                <span className="inline-block px-3 py-1 bg-stone-100 text-stone-500 text-[10px] font-black uppercase tracking-widest rounded-full mb-4 group-hover:bg-red-50 group-hover:text-[#B23A2E] transition-colors">
                  {item.tag}
                </span>

                <h3 className="text-2xl font-black text-stone-900 mb-4 tracking-tight leading-tight">
                  {item.title}
                </h3>

                <p className="text-stone-500 leading-relaxed font-light">
                  {item.desc}
                </p>

                {/* Subtle Decorative Number */}
                <span className="absolute top-10 right-10 text-stone-50 font-black text-6xl group-hover:text-stone-100 transition-colors pointer-events-none">
                  0{idx + 1}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* WHY US */}
      <section className="relative py-32 px-6 bg-white overflow-hidden">
        {/* Abstract Mountain Path (Decorative Background SVG) */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-stone-50/50 -skew-x-12 translate-x-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10">
          {/* LEFT CONTENT: Story & Features */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1 rounded-full bg-[#B23A2E]/10 text-[#B23A2E] text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                The Terroir
              </span>
              <h2 className="text-5xl md:text-7xl font-black text-stone-900 leading-[0.9] tracking-tighter">
                Rooted in the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-900 via-stone-700 to-stone-400">
                  Himalayas.
                </span>
              </h2>
              <p className="mt-8 text-xl text-stone-500 font-light leading-relaxed max-w-xl">
                At{" "}
                <span className="text-stone-900 font-semibold italic">
                  2,300m elevation
                </span>
                , nature moves at its own pace. Fruits ripen slowly in the thin
                mountain air, concentrating sugars and nutrients to create an
                <span className="text-stone-900 font-medium">
                  {" "}
                  unmatched intensity of flavor.
                </span>
              </p>
            </motion.div>

            {/* Feature Grid: Refined Glass Cards */}
            <div className="mt-16 grid sm:grid-cols-2 gap-4">
              {[
                {
                  icon: <Sun className="w-5 h-5" />,
                  title: "High-Altitude Climate",
                  desc: "Natural UV rays enhance flavor profile and nutrients.",
                },
                {
                  icon: <Droplets className="w-5 h-5" />,
                  title: "Pure Snowmelt",
                  desc: "Irrigated by the mineral-rich waters of the peaks.",
                },
                {
                  icon: <TreeDeciduous className="w-5 h-5" />,
                  title: "Seasonal Harvest",
                  desc: "Only picked at the absolute peak of ripeness.",
                },
                {
                  icon: <Users className="w-5 h-5" />,
                  title: "Generational Trust",
                  desc: "Honest farming values passed down through decades.",
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 rounded-3xl border border-stone-100 bg-stone-50/50 hover:bg-white hover:shadow-2xl hover:shadow-stone-200/50 transition-all duration-500 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#B23A2E] mb-4 group-hover:bg-[#B23A2E] group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm uppercase tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-stone-500 text-xs mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT CONTENT: Dynamic Image Composition */}
          <div className="relative">
            {/* Main Image with "Floating" effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10 p-4 bg-white shadow-[0_50px_100px_rgba(0,0,0,0.1)] rounded-[2.5rem]"
            >
              <img
                src={farmImage}
                alt="Himalayan Orchard"
                className="rounded-[2rem] w-full aspect-[4/5] object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
              />

              {/* Floating Elevation Tag */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-8 -left-8 bg-stone-900 text-white p-8 rounded-3xl shadow-2xl"
              >
                <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 mb-1">
                  Current Altitude
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black">2,300</span>
                  <span className="text-lg font-serif italic text-stone-400">
                    meters
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 border-[20px] border-stone-100 rounded-full -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-stone-100 rounded-full -z-20" />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
