import React from "react";
import logo from "../assets/logo-himalayas.png";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import ourImage from "../assets/meandyug.png";
import farmImage from "../assets/royal-3.jpg";
import { Helmet } from "react-helmet";

export default function OurStory() {
  return (
    <div className="bg-[#FFF8E1]">
    <Helmet>
        <title>About us - Range Of Himalayas</title>
        <meta
          name="description"
          content="Range Of Himalayas – Fresh apples, juicy kiwis directly sourced from the Himalayan farms."
        />
      </Helmet>
      <section className="text-center px-6 py-16 bg-gradient-to-b from-green-50 to-white">
        <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          🌿 Our Story
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold mt-4 text-gray-900 leading-tight">
          From Himalayan Orchards <br />{" "}
          <span className="text-red-600">to Your Table</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
          We are proud orchard farmers from Himachal Pradesh, cultivating apples
          with love and care. Every fruit is grown in the lap of the Himalayas
          and delivered fresh — carrying purity, tradition, and the essence of
          mindful farming.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/viewproducts">
            <button className="bg-red-600 text-white px-6 py-3 rounded-full font-medium hover:bg-red-700 transition">
              🍎 Shop Our Apples
            </button>
          </a>
          <button className="border border-gray-300 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition">
            🌄 Explore Our Journey
          </button>
        </div>
        <div className="mt-8 flex justify-center gap-10">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">10+</h3>
            <p className="text-gray-600">Years of Farming</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">1000+</h3>
            <p className="text-gray-600">Happy Customers</p>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-20 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          🌱 Our Journey
        </h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            <div>
              <h3 className="text-3xl font-semibold text-gray-900 flex items-center gap-3">
                <span className="text-red-600 font-bold text-2xl">01.</span>
                Orchard Roots
              </h3>
              <p className="text-gray-600 text-xl mt-2 ml-10">
                Our story begins in the pristine apple orchards of Himachal,
                where traditional farming practices meet the richness of nature.
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-semibold text-gray-900 flex items-center gap-3">
                <span className="text-red-600 font-bold text-2xl">02.</span>
                Inspired by Nature
              </h3>
              <p className="text-gray-600 text-xl mt-2 ml-10">
                Inspired by the Himalayas, we committed to growing apples the
                natural way — with no shortcuts, just care, patience, and
                sustainability.
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-semibold text-gray-900 flex items-center gap-3">
                <span className="text-red-600 font-bold text-2xl">03.</span>
                From Farm to Table
              </h3>
              <p className="text-gray-600 text-xl mt-2 ml-10">
                Today, our apples travel directly from our orchards to your
                homes, ensuring freshness, purity, and a taste of the Himalayas
                in every bite.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src={ourImage}
              alt="Our Orchard Journey"
              className="rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>
      </section>
      <section className="bg-gradient-to-b from-green-50 to-white py-20 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6">
          What Sets Us Apart
        </h2>
        <p className="text-center max-w-2xl mx-auto text-lg text-gray-600 mb-16">
          Our orchards thrive on trust, tradition, and a deep bond with nature.
        </p>
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto text-center">
          <div>
            <div className="flex justify-center mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900">
              Farm with Transparency
            </h3>
            <p className="text-gray-600 mt-2">
              From blossom to harvest, every step of our orchard life is shared
              with you.
            </p>
          </div>
          <div>
            <div className="flex justify-center mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900">
              Crafted with Care
            </h3>
            <p className="text-gray-600 mt-2">
              Every apple is grown with patience, precision, and respect for
              nature — ensuring purity you can taste in every bite.
            </p>
          </div>
          <div>
            <div className="flex justify-center mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900">
              Harvesting Relationships
            </h3>
            <p className="text-gray-600 mt-2">
              More than apples, we cultivate trust, collaboration, and shared
              joy.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
              A Different Way of Farming
            </h2>
            <p className="mt-6 text-lg text-gray-600">
              Our orchards thrive in the lap of the Himalayas, where the
              climate, water, and community values come together to create
              apples that are as pure as the mountains themselves.
            </p>
            <div className="mt-10 grid sm:grid-cols-2 gap-6">
              <div className="p-5 bg-white rounded-xl shadow hover:shadow-md transition">
                <div className="text-green-600 text-2xl mb-3">🌤️</div>
                <h3 className="font-semibold text-gray-900">Perfect Climate</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Cool Himalayan temperatures nurture apples with rich flavor.
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl shadow hover:shadow-md transition">
                <div className="text-blue-600 text-2xl mb-3">💧</div>
                <h3 className="font-semibold text-gray-900">Pure Water</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Irrigated with fresh snowmelt straight from the Himalayas.
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl shadow hover:shadow-md transition">
                <div className="text-red-600 text-2xl mb-3">🍎</div>
                <h3 className="font-semibold text-gray-900">Quality First</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Each apple is hand-picked and carefully inspected.
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl shadow hover:shadow-md transition">
                <div className="text-yellow-600 text-2xl mb-3">🤝</div>
                <h3 className="font-semibold text-gray-900">
                  Community Values
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Grown with respect for tradition, people, and nature.
                </p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src={farmImage}
              alt="Orchard"
              className="h-full rounded-xl shadow-lg object-cover"
            />
            <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-full shadow text-sm font-medium flex items-center gap-2">
              🌿 2,300m Himalayan Elevation
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
