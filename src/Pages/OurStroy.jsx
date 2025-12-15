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
        <title>About us - Range Of Himalayas</title>
        <meta
          name="description"
          content="Range Of Himalayas – Fresh fruits and naturally dried Himalayan produce sourced directly from mountain farms."
        />
      </Helmet>

      {/* HERO */}
      <section className="text-center px-6 py-24 bg-gradient-to-b from-green-100/50 to-white">
        <span className="px-4 py-1 bg-green-200 text-green-900 rounded-full text-sm font-semibold tracking-wide">
          🌿 Our Story
        </span>

        <h1 className="text-5xl md:text-6xl font-extrabold mt-6 text-gray-900 leading-tight">
          From Himalayan Orchards <br />
          <span className="text-red-600">to Your Table</span>
        </h1>

        <p className="mt-8 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
          We are growers and preservers from Himachal Pradesh—cultivating fresh
          fruits like apples and kiwis, and naturally drying apricots and other
          mountain produce using clean Himalayan air and time-honoured methods.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/viewproducts">
            <button className="bg-red-600 text-white px-8 py-3 rounded-full font-medium text-lg hover:bg-red-700 transition">
              🍎 Shop Himalayan Produce
            </button>
          </Link>

          <button className="border border-gray-300 px-8 py-3 rounded-full font-medium text-lg hover:bg-gray-100 transition">
            🌄 Explore Our Journey
          </button>
        </div>

        {/* Stats */}
        <div className="mt-12 flex justify-center gap-16">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-gray-900">10+</h3>
            <p className="text-gray-600">Years of Experience</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-gray-900">1000+</h3>
            <p className="text-gray-600">Families Served</p>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="bg-gray-50 py-24 px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
          🌱 Our Journey
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            {[
              {
                num: "01",
                title: "Orchard & Hillside Roots",
                desc: "Our journey begins in Himalayan orchards and mountain villages, where fruits grow slowly and naturally."
              },
              {
                num: "02",
                title: "Nature-Led Drying",
                desc: "Excess harvest is gently sun-dried and air-dried—no chemicals, no shortcuts, just patience and clean air."
              },
              {
                num: "03",
                title: "From Hills to Homes",
                desc: "Fresh fruits and dry fruits travel directly from our farms and drying rooms to your home."
              }
            ].map((item) => (
              <div key={item.num}>
                <h3 className="text-3xl font-semibold flex items-center gap-3 text-gray-900">
                  <span className="text-red-600 font-bold text-2xl">
                    {item.num}.
                  </span>
                  {item.title}
                </h3>
                <p className="text-gray-600 text-lg mt-2 ml-10">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <img
              src={ourImage}
              alt="Our Himalayan Journey"
              className="rounded-xl shadow-xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gradient-to-b from-green-50 to-white py-24 px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-6">
          What Makes Us Special
        </h2>
        <p className="text-center max-w-2xl mx-auto text-lg text-gray-600 mb-20">
          Whether fresh or dried, every product reflects Himalayan purity,
          patience, and respect for nature.
        </p>

        <div className="grid md:grid-cols-3 gap-16 max-w-6xl mx-auto">
          {[
            {
              title: "Naturally Grown",
              desc: "Fresh fruits grown without shortcuts, nurtured by mountain climate.",
            },
            {
              title: "Slow & Honest Drying",
              desc: "Dry fruits prepared using traditional sun and air-drying techniques.",
            },
            {
              title: "No Compromise Quality",
              desc: "From harvest to packing, quality is checked at every step.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-8 bg-white rounded-2xl shadow hover:shadow-lg transition text-center"
            >
              <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
              <p className="text-gray-600 mt-3">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="px-4 py-1 bg-green-200 text-green-800 rounded-full text-sm font-semibold">
              Why Choose Us
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-5">
              A Mountain-Rooted Way of Living
            </h2>

            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              At 2,300m elevation, our fruits ripen slowly and our dry fruits
              mature naturally—preserving nutrition, taste, and authenticity.
            </p>

            <div className="mt-10 grid sm:grid-cols-2 gap-6">
              {[
                { icon: "🌤️", title: "Ideal Climate", desc: "Cool Himalayan weather enhances flavour and shelf life." },
                { icon: "💧", title: "Pure Sources", desc: "Snowmelt water and clean mountain air." },
                { icon: "🍎", title: "Fresh & Dried", desc: "Seasonal fruits and carefully preserved dry produce." },
                { icon: "🤝", title: "Trust Over Time", desc: "Built on generations of farming ethics." },
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
              className="rounded-2xl shadow-xl object-cover"
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
