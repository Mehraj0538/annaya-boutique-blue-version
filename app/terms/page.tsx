"use client";

import Link from "next/link";
import ShellLayout from "@/components/ShellLayout";

export default function TermsPage() {
  return (
    <ShellLayout>
      <div className="min-h-screen bg-slate-50 pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-royal mb-6">Terms of Service</h1>
            <div className="w-16 h-1 bg-gold rounded-full mx-auto mb-6" />
            <p className="text-slate-500 font-medium">Last updated: {new Date().toLocaleDateString(undefined, { month: "long", year: "numeric" })}</p>
          </div>
          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-100 prose prose-slate max-w-none">
            <p className="lead text-lg text-slate-600 mb-8">Welcome to Annaya Boutique. By accessing or using our website, you agree to be bound by these Terms of Service. Please read them carefully before making a purchase.</p>
            {[
              { title: "1. General Conditions", body: "We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve transmissions over various networks." },
              { title: "2. Products and Pricing", body: "Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue a product without notice. We have made every effort to display the colors and images of our products accurately, but we cannot guarantee that your device's display of any color will be precise." },
              { title: "3. Accuracy of Billing and Account Information", body: "You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and other information, including your email address and credit card numbers and expiration dates, so that we can complete your transactions and contact you as needed." },
              { title: "4. Returns and Exchanges", body: "Our return and exchange policy strictly outlines the conditions under which items can be returned or exchanged. Items must be unused, in their original packaging, and with all tags intact. Custom-tailored or altered items are generally non-refundable unless defective." },
              { title: "5. Governing Law", body: "These Terms of Service and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of India." },
            ].map(({ title, body }) => (
              <div key={title}>
                <h2 className="text-2xl font-serif font-bold text-royal mt-10 mb-4">{title}</h2>
                <p className="text-slate-600 mb-4">{body}</p>
              </div>
            ))}
            <p className="text-slate-600">For further inquiries regarding our terms, please <Link href="/contact" className="text-royal hover:text-gold font-bold underline underline-offset-4">contact our support team</Link>.</p>
          </div>
        </div>
      </div>
    </ShellLayout>
  );
}
