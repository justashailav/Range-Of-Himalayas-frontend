// import React from "react";
// import logo from "../assets/logo-himalayas.png";
// import Footer from "./Footer";
// import { Link } from "react-router-dom";
// import ourImage from "../assets/meandyug.png";
// import farmImage from "../assets/royal-3.jpg";
// import { Helmet } from "react-helmet";

// export default function OurStory() {
//   return (
//     <div className="bg-[#FFFDF7]">
//       <Helmet>
//         <title>About us - Range Of Himalayas</title>
//         <meta
//           name="description"
//           content="Range Of Himalayas – Fresh apples & kiwis sourced directly from Himalayan orchards."
//         />
//       </Helmet>

//       {/* HERO */}
//       <section className="text-center px-6 py-24 bg-gradient-to-b from-green-100/50 to-white">
//         <span className="px-4 py-1 bg-green-200 text-green-900 rounded-full text-sm font-semibold tracking-wide">
//           🌿 Our Story
//         </span>

//         <h1 className="text-5xl md:text-6xl font-extrabold mt-6 text-gray-900 leading-tight">
//           From Himalayan Orchards <br />
//           <span className="text-red-600">to Your Table</span>
//         </h1>

//         <p className="mt-8 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
//           We are proud orchard farmers from Himachal Pradesh, nurturing apples
//           and kiwis with pure Himalayan water, clean air, and traditional
//           farming values.
//         </p>

//         <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
//           <Link to="/viewproducts">
//             <button className="bg-red-600 text-white px-8 py-3 rounded-full font-medium text-lg hover:bg-red-700 transition">
//               🍎 Shop Fresh Apples
//             </button>
//           </Link>

//           <button className="border border-gray-300 px-8 py-3 rounded-full font-medium text-lg hover:bg-gray-100 transition">
//             🌄 Explore Our Journey
//           </button>
//         </div>

//         {/* Stats */}
//         <div className="mt-12 flex justify-center gap-16">
//           <div className="text-center">
//             <h3 className="text-4xl font-bold text-gray-900">10+</h3>
//             <p className="text-gray-600">Years of Farming</p>
//           </div>
//           <div className="text-center">
//             <h3 className="text-4xl font-bold text-gray-900">1000+</h3>
//             <p className="text-gray-600">Happy Customers</p>
//           </div>
//         </div>
//       </section>

//       {/* JOURNEY */}
//       <section className="bg-gray-50 py-24 px-6">
//         <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
//           🌱 Our Journey
//         </h2>

//         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
//           <div className="space-y-10">
//             {[
//               {
//                 num: "01",
//                 title: "Orchard Roots",
//                 desc: "Our story begins in the traditional apple orchards of Himachal, where nature guides every harvest."
//               },
//               {
//                 num: "02",
//                 title: "Inspired by Nature",
//                 desc: "We grow fruits the natural way — driven by purity, patience, and sustainability."
//               },
//               {
//                 num: "03",
//                 title: "Farm to Home",
//                 desc: "We deliver apples directly from our orchards to your doorstep—fresh and untouched."
//               }
//             ].map((item) => (
//               <div key={item.num}>
//                 <h3 className="text-3xl font-semibold flex items-center gap-3 text-gray-900">
//                   <span className="text-red-600 font-bold text-2xl">
//                     {item.num}.
//                   </span>{" "}
//                   {item.title}
//                 </h3>
//                 <p className="text-gray-600 text-lg mt-2 ml-10">{item.desc}</p>
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-center">
//             <img
//               src={ourImage}
//               alt="Our Orchard Journey"
//               className="rounded-xl shadow-xl object-cover"
//             />
//           </div>
//         </div>
//       </section>

//       {/* FEATURES */}
//       <section className="bg-gradient-to-b from-green-50 to-white py-24 px-6">
//         <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-6">
//           What Makes Us Special
//         </h2>
//         <p className="text-center max-w-2xl mx-auto text-lg text-gray-600 mb-20">
//           Our orchards thrive on purity, tradition, and our deep connection with the Himalayas.
//         </p>

//         <div className="grid md:grid-cols-3 gap-16 max-w-6xl mx-auto">
//           {[
//             {
//               title: "Transparent Farming",
//               desc: "Every step, from blossom to harvest, is nurtured with honesty.",
//             },
//             {
//               title: "Crafted with Care",
//               desc: "Each apple is hand-grown, naturally enriched, and quality checked.",
//             },
//             {
//               title: "Harvesting Trust",
//               desc: "We grow relationships as sincerely as we grow apples.",
//             },
//           ].map((item) => (
//             <div
//               key={item.title}
//               className="p-8 bg-white rounded-2xl shadow hover:shadow-lg transition text-center"
//             >
//               <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
//               <p className="text-gray-600 mt-3">{item.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* WHY US */}
//       <section className="bg-gray-50 py-24 px-6">
//         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
//           <div>
//             <span className="px-4 py-1 bg-green-200 text-green-800 rounded-full text-sm font-semibold">
//               Why Choose Us
//             </span>

//             <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-5">
//               A Different Way of Farming
//             </h2>

//             <p className="mt-6 text-lg text-gray-600 leading-relaxed">
//               Nestled at 2,300m elevation, our orchards grow in the cleanest
//               climate with natural Himalayan snowmelt—producing unmatched quality.
//             </p>

//             <div className="mt-10 grid sm:grid-cols-2 gap-6">
//               {[
//                 { icon: "🌤️", title: "Perfect Climate", desc: "Cool Himalayan temperatures shape rich, flavorful apples." },
//                 { icon: "💧", title: "Pure Water", desc: "Irrigated with untouched Himalayan snowmelt." },
//                 { icon: "🍎", title: "Quality First", desc: "Hand-picked and precision-sorted with care." },
//                 { icon: "🤝", title: "Community Values", desc: "Rooted in tradition, integrity & mountain ethics." },
//               ].map((item) => (
//                 <div
//                   key={item.title}
//                   className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
//                 >
//                   <div className="text-3xl mb-2">{item.icon}</div>
//                   <h3 className="font-bold text-gray-900">{item.title}</h3>
//                   <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="relative">
//             <img
//               src={farmImage}
//               alt="Orchard"
//               className="rounded-2xl shadow-xl object-cover"
//             />
//             <div className="absolute bottom-4 right-4 bg-white px-5 py-2 rounded-full shadow text-sm font-medium flex items-center gap-2">
//               🌿 2,300m Himalayan Elevation
//             </div>
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// }

import React from "react";
import logo from "../assets/logo-himalayas.png";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import ourImage from "../assets/meandyug.png";
import farmImage from "../assets/ad3.jpg";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

export default function OurStory() {
  // Soft fade + slide variants
  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut", delay },
    }),
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: (delay = 0) => ({
      opacity: 1,
      transition: { duration: 0.65, ease: "easeOut", delay },
    }),
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: (delay = 0) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut", delay },
    }),
  };

  return (
    <div className="bg-[#FFFDF7]">
      <Helmet>
        <title>About us - Range Of Himalayas</title>
        <meta
          name="description"
          content="Range Of Himalayas – Fresh apples & kiwis sourced directly from Himalayan orchards."
        />
      </Helmet>

      {/* HERO */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="text-center px-6 py-24 bg-gradient-to-b from-green-100/50 to-white"
      >
        <motion.span
          variants={fadeIn}
          custom={0}
          className="px-4 py-1 bg-green-200 text-green-900 rounded-full text-sm font-semibold"
        >
          🌿 Our Story
        </motion.span>

        <motion.h1
          variants={fadeUp}
          custom={0.05}
          className="text-5xl md:text-6xl font-extrabold mt-6 text-gray-900"
        >
          From Himalayan Orchards
          <br />
          <span className="text-red-600">to Your Table</span>
        </motion.h1>

        <motion.p
          variants={fadeIn}
          custom={0.12}
          className="mt-8 max-w-3xl mx-auto text-xl text-gray-600"
        >
          We are orchard farmers from Himachal Pradesh, growing apples and kiwis
          naturally with Himalayan water, clean air, and traditional farming
          values.
        </motion.p>
      </motion.section>

      {/* JOURNEY SECTION */}
      <section className="bg-gray-50 py-24 px-6">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16"
        >
          🌱 Our Journey
        </motion.h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* TEXT STEPS */}
          <div className="space-y-10">
            {[
              {
                num: "01",
                title: "Orchard Roots",
                desc: "Our story began in the traditional Himachal orchards where every harvest is guided by nature.",
              },
              {
                num: "02",
                title: "Inspired by Nature",
                desc: "We grow fruits with purity, patience and sustainable farming practices.",
              },
              {
                num: "03",
                title: "Farm to Home",
                desc: "Fresh apples delivered directly from our orchards to your doorstep.",
              },
            ].map((item, idx) => (
              <motion.div
                key={item.num}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={idx * 0.1}
              >
                <h3 className="text-3xl font-semibold flex items-center gap-3 text-gray-900">
                  <span className="text-red-600 font-bold text-2xl">
                    {item.num}.
                  </span>
                  {item.title}
                </h3>
                <p className="text-gray-600 text-lg mt-2 ml-10">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* IMAGE */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
            custom={0}
            className="flex justify-center"
          >
            <img
              src={ourImage}
              alt="Our Orchard Journey"
              className="rounded-xl shadow-xl object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* IMAGE FULL WIDTH SECTION */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="py-20 px-6 bg-white"
      >
        <motion.div
          variants={scaleIn}
          custom={0.1}
          className="max-w-5xl mx-auto relative"
        >
          <img
            src={farmImage}
            alt="Orchard"
            className="rounded-2xl shadow-xl w-full object-cover"
          />
        </motion.div>
      </motion.section>

      {/* PRELAUNCH CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="px-6 py-20 bg-[#FFF3EA] text-center"
      >
        <motion.h2
          variants={fadeIn}
          custom={0.05}
          className="text-4xl font-bold text-[#D84C3C] mb-4"
        >
          🍎 Be Part of Our First Harvest
        </motion.h2>

        <motion.p
          variants={fadeIn}
          custom={0.1}
          className="text-gray-700 max-w-2xl mx-auto text-lg mb-8"
        >
          Our apples will soon be available for preorder. Join the prelaunch
          list to get early access, exclusive pricing, and behind-the-scenes
          orchard updates.
        </motion.p>

        <motion.a
          href="https://forms.gle/5M73wYV9Je6SJtow9"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="bg-[#D84C3C] text-white px-10 py-3 rounded-full text-lg font-semibold hover:bg-[#b53e30] transition"
          >
            Join Prelaunch Waitlist 🚀
          </motion.button>
        </motion.a>
      </motion.section>

      <Footer />
    </div>
  );
}
