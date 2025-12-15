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
      <section className="text-center px-6 py-28 bg-gradient-to-b from-green-100/40 to-white">
        <span className="px-5 py-1.5 bg-green-200 text-green-900 rounded-full text-sm font-semibold tracking-wide">
          🌿 Our Story
        </span>

        <h1 className="text-5xl md:text-6xl font-extrabold mt-8 text-gray-900 leading-tight">
          From Himalayan Orchards <br />
          <span className="text-red-600">to Your Table</span>
        </h1>

        <p className="mt-10 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
          We are mountain growers and preservers from Himachal Pradesh—cultivating
          fresh fruits like apples and kiwis, and preparing dry fruits such as
          apricots using slow, natural drying methods guided by Himalayan air,
          sunlight, and time.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center">
          <Link to="/viewproducts">
            <button className="bg-red-600 text-white px-9 py-3.5 rounded-full font-semibold text-lg hover:bg-red-700 transition">
              🍎 Explore Our Produce
            </button>
          </Link>

          <button className="border border-gray-300 px-9 py-3.5 rounded-full font-semibold text-lg hover:bg-gray-100 transition">
              🌄 Our Himalayan Journey
          </button>
        </div>

        {/* STAT */}
        <div className="mt-14 flex justify-center">
          <div className="text-center">
            <h3 className="text-5xl font-bold text-gray-900">10+</h3>
            <p className="text-gray-600 mt-1">Years of Mountain Farming</p>
          </div>
        </div>
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
