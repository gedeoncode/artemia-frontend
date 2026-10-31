"use client";
import React, { useState } from "react";
import {
  ChevronDown,
  Package,
  CheckCircle,
  Truck,
  DollarSign,
  Home,
  Car,
  Box,
} from "lucide-react";
import { useBecomeSeller } from "@/hooks/registration/useBecomeSeller";
import Link from "next/link";
import { Button } from "@/components/ui/button/Button";
import Image from "next/image";
import { faqs, steps, benefits } from "./data";

export default function SellOnArtemiaPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const becomeSeller = useBecomeSeller();
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="px-4 py-20 bg-white">
        <div className="grid items-center max-w-6xl gap-12 mx-auto md:grid-cols-2">
          <div>
            <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-6xl">
              Grow Your Business on Artemia
            </h1>

            <p className="mb-8 text-xl leading-relaxed text-gray-600 md:text-2xl">
              List and sell real estate, vehicles, and consumer goods all in one
              marketplace. We provide the tools to help you reach buyers and
              manage your shop.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                aria-label="Create seller account"
                onClick={() => becomeSeller()}
              >
                Become a Seller
              </Button>
              <Button variant="outline" aria-label="Read seller documentation">
                View Documentation
              </Button>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="overflow-hidden bg-white border border-gray-100 shadow-xl rounded-2xl">
              <Image
                src="/images/become-seller-hero-img1.png"
                alt="Artemia Seller Dashboard Overview"
                width={720}
                height={1400}
                priority
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Sell on Artemia */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-4 text-4xl font-bold text-center text-gray-900">
            Everything You Need to Sell Successfully
          </h2>
          <p className="max-w-2xl mx-auto mb-12 text-lg text-center text-gray-600">
            Built-in tools to help you manage your shop and reach more
            customers.
          </p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="p-8 transition-shadow bg-white shadow-sm rounded-xl hover:shadow-md"
              >
                <div className="mb-4 text-blue-600">{benefit.icon}</div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="mb-4 leading-relaxed text-gray-600">
                  {benefit.description}
                </p>
                <Link
                  href={benefit.link}
                  className="inline-flex items-center font-medium text-blue-600 hover:text-blue-700"
                >
                  Learn more →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Selling Works */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-4 text-4xl font-bold text-center text-gray-900">
            How to Start Selling
          </h2>
          <p className="max-w-2xl mx-auto mb-16 text-lg text-center text-gray-600">
            Five simple steps to launch your shop on Artemia.
          </p>
          <div className="grid gap-8 md:grid-cols-5">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-blue-600 bg-blue-100 rounded-full">
                  {step.icon}
                </div>
                <div className="flex items-center justify-center w-8 h-8 mx-auto mb-4 font-bold text-white bg-blue-600 rounded-full">
                  {step.number}
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="mb-3 text-sm leading-relaxed text-gray-600">
                  {step.description}
                </p>
                <Link
                  href={step.link}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View guide →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selling Modes */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-4 text-4xl font-bold text-center text-gray-900">
            Two Selling Modes Based on Your Product
          </h2>
          <p className="max-w-2xl mx-auto mb-16 text-lg text-center text-gray-600">
            Artemia automatically assigns the right selling mode based on your
            product category to ensure proper handling and payment flow.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            {/* PAP Mode */}
            <div className="overflow-hidden transition-colors bg-white border-2 border-gray-200 shadow-lg rounded-xl">
              <div className="p-6 text-white bg-gradient-to-r from-purple-600 to-purple-500">
                <h3 className="mb-1 text-2xl font-bold">
                  PAP (Pay at Publication)
                </h3>
                <p className="text-sm text-purple-100">
                  For high-value listings where you handle fulfillment directly.
                </p>
              </div>

              <div className="p-8">
                <div className="mb-6">
                  <h4 className="flex items-center mb-3 font-semibold text-gray-900">
                    <Package className="w-5 h-5 mr-2 text-purple-600" />
                    How It Works
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Pay a one-time fee to publish your listing</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>You manage all delivery and logistics</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>You communicate directly with buyers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>You handle payment outside the platform</span>
                    </li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="flex items-center mb-3 font-semibold text-gray-900">
                    <CheckCircle className="w-5 h-5 mr-2 text-purple-600" />
                    Used For These Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center px-3 py-1 text-sm text-purple-700 bg-purple-100 rounded-full">
                      <Home className="w-4 h-4 mr-1" /> Real Estate
                    </span>
                    <span className="flex items-center px-3 py-1 text-sm text-purple-700 bg-purple-100 rounded-full">
                      <Car className="w-4 h-4 mr-1" /> Vehicles
                    </span>
                    <span className="px-3 py-1 text-sm text-purple-700 bg-purple-100 rounded-full">
                      Professional Services
                    </span>
                  </div>
                </div>

                <div className="p-4 mb-6 rounded-lg bg-purple-50">
                  <p className="text-sm leading-relaxed text-gray-700">
                    <strong>Important:</strong> With PAP, you're responsible for
                    all fulfillment. Artemia does not handle shipping, tracking,
                    or logistics for these products.
                  </p>
                </div>

                <div className="mb-6 space-y-2">
                  <Link
                    href="/docs/pap-mode"
                    className="block text-sm font-medium text-blue-600"
                  >
                    → How PAP works
                  </Link>
                  <Link
                    href="/docs/pap-categories"
                    className="block text-sm font-medium text-blue-600"
                  >
                    → View PAP categories
                  </Link>
                </div>

                <Button variant="secondary" className="w-full">
                  Learn About PAP
                </Button>
              </div>
            </div>

            {/* PAL Mode */}
            <div className="overflow-hidden bg-white border-2 border-blue-500 shadow-lg rounded-xl">
              <div className="p-6 text-white bg-gradient-to-r from-blue-600 to-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold">PAL (Pay at Delivery)</h3>
                  <span className="px-3 py-1 text-xs font-bold text-blue-600 bg-white rounded-full">
                    RECOMMENDED
                  </span>
                </div>
                <p className="text-sm text-blue-100">
                  Artemia manages shipping and payments. No upfront listing
                  cost.
                </p>
              </div>

              <div className="p-8">
                <div className="mb-6">
                  <h4 className="flex items-center mb-3 font-semibold text-gray-900">
                    <Truck className="w-5 h-5 mr-2 text-blue-600" />
                    How It Works
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>
                        List products for free—pay only when you make a sale
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>
                        Artemia handles all shipping and delivery tracking
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>
                        Payment is automatically released after delivery
                        confirmation
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="flex items-center mb-3 font-semibold text-gray-900">
                    <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                    Used For These Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full">
                      <Box className="w-4 h-4 mr-1" /> Retail Products
                    </span>
                    <span className="px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full">
                      Electronics
                    </span>
                    <span className="px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full">
                      Consumer Goods
                    </span>
                  </div>
                </div>

                <div className="p-4 mb-6 border border-blue-200 rounded-lg bg-blue-50">
                  <h5 className="flex items-center mb-2 text-sm font-semibold text-gray-900">
                    <DollarSign className="w-4 h-4 mr-1 text-blue-600" />
                    How You're Charged
                  </h5>
                  <p className="text-sm leading-relaxed text-gray-700">
                    We deduct a commission only when your product sells and is
                    delivered. Exact rates are shown before you publish each
                    listing.
                  </p>
                </div>

                <div className="mb-6 space-y-2">
                  <Link
                    href="/docs/pal-mode"
                    className="block text-sm font-medium text-blue-600"
                  >
                    → How PAL works
                  </Link>
                  <Link
                    href="/docs/commission"
                    className="block text-sm font-medium text-blue-600"
                  >
                    → Calculate your fees
                  </Link>
                </div>

                <Button className="w-full">Learn About PAL</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fees & Payments Transparency */}
      <section className="px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="mb-4 text-4xl font-bold text-center text-gray-900">
            Clear, Predictable Pricing
          </h2>
          <p className="mb-12 text-lg text-center text-gray-600">
            No hidden fees or surprises. You'll always know what you're paying.
          </p>

          <div className="grid gap-6 mb-8 md:grid-cols-2">
            <div className="p-8 border-2 border-green-200 bg-green-50 rounded-xl">
              <CheckCircle className="w-12 h-12 mb-4 text-green-600" />
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Free to Register
              </h3>
              <p className="leading-relaxed text-gray-600">
                Creating your seller account and setting up your shop costs
                nothing.
              </p>
            </div>
            <div className="p-8 border-2 border-green-200 bg-green-50 rounded-xl">
              <CheckCircle className="w-12 h-12 mb-4 text-green-600" />
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                No Monthly Fees
              </h3>
              <p className="leading-relaxed text-gray-600">
                We don't charge subscription fees. You only pay when you publish
                or sell.
              </p>
            </div>
          </div>

          <div className="p-8 mb-6 border border-blue-200 bg-blue-50 rounded-xl">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              What You Pay
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>PAL Commission:</strong> Deducted only after your
                  product is delivered to the customer.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>PAP Listing Fee:</strong> A one-time fee when you
                  publish, based on your product category.
                </span>
              </li>
            </ul>
          </div>

          <div className="flex justify-center space-x-6 text-center">
            <Link href="/docs/fees" className="font-medium text-blue-600">
              → View all fees
            </Link>
            <Link
              href="/docs/payment-timing"
              className="font-medium text-blue-600"
            >
              → When you get paid
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="mb-4 text-4xl font-bold text-center text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="mb-12 text-lg text-center text-gray-600">
            Quick answers to help you get started selling.
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden bg-white rounded-lg shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex items-center justify-between w-full px-6 py-5 text-left transition-colors hover:bg-gray-50"
                >
                  <span className="pr-8 font-semibold text-gray-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${openFaq === index ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5">
                    <p className="mb-3 leading-relaxed text-gray-600">
                      {faq.answer}
                    </p>
                    <Link
                      href={faq.link}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Read more →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 text-white bg-gradient-to-r from-blue-600 to-blue-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">
            Ready to Start Selling?
          </h2>
          <p className="mb-8 text-xl opacity-90">
            Join thousands of sellers on Artemia. Set up your shop in under 5
            minutes.
          </p>
          <Button className="mb-6 text-blue-600 bg-white border-none hover:bg-gray-100">
            Create Your Seller Account
          </Button>
          <div className="block">
            <Link
              href="/docs"
              className="inline-flex items-center text-lg text-white hover:underline"
            >
              → Browse seller documentation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
