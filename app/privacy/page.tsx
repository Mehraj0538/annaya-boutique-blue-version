export const dynamic = "force-static";

import Link from "next/link";
import ShellLayout from "@/components/ShellLayout";

export default function PrivacyPage() {
  return (
    <ShellLayout>
      <div className="min-h-screen bg-slate-50 pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-royal mb-6">Privacy Policy</h1>
            <div className="w-16 h-1 bg-gold rounded-full mx-auto mb-6" />
            <p className="text-slate-500 font-medium">Last updated: {new Date().toLocaleDateString(undefined, { month: "long", year: "numeric" })}</p>
          </div>
          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-100 prose prose-slate max-w-none">
            <p className="lead text-lg text-slate-600 mb-8">At Annaya Boutique, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or make a purchase.</p>
            {[
              { title: "1. Information We Collect", body: "We collect information you provide directly to us, such as when you create an account, make a purchase, subscribe to our newsletter, or contact customer support. This may include your name, email address, phone number, shipping and billing addresses, and payment information." },
              { title: "2. How We Use Your Information", body: "We use the information we collect to process and fulfill your orders, maintain and manage your account, respond to your questions and customer service requests, communicate about products and promotions (if opted in), and detect and prevent fraudulent transactions." },
              { title: "3. Data Sharing and Disclosure", body: "We do not sell your personal information. We may share your data with trusted third-party service providers (such as payment processors and shipping aggregators) strictly for the purpose of fulfilling your orders and running our business operations." },
              { title: "4. Security", body: "We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no electronic transmission or storage is 100% secure." },
            ].map(({ title, body }) => (
              <div key={title}>
                <h2 className="text-2xl font-serif font-bold text-royal mt-10 mb-4">{title}</h2>
                <p className="text-slate-600 mb-4">{body}</p>
              </div>
            ))}
            <h2 className="text-2xl font-serif font-bold text-royal mt-10 mb-4">5. Contact Us</h2>
            <p className="text-slate-600 mb-8">If you have any questions or concerns about this Privacy Policy, please <Link href="/contact" className="text-royal hover:text-gold font-bold underline underline-offset-4">contact us</Link>.</p>
          </div>
        </div>
      </div>
    </ShellLayout>
  );
}
