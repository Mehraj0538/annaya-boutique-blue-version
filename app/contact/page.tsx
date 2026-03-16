"use client";

import { Mail, Phone, MapPin, Send } from "lucide-react";
import ShellLayout from "@/components/ShellLayout";

export default function ContactPage() {
  return (
    <ShellLayout>
      <div className="min-h-screen bg-slate-50 pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-royal mb-6">Contact Us</h1>
            <div className="w-16 h-1 bg-gold rounded-full mx-auto mb-6" />
            <p className="text-slate-600 text-lg leading-relaxed">We&apos;d love to hear from you. Whether you have a question about our products, need assistance with an order, or just want to share your feedback, our team is here to help.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-royal mb-6">Get in Touch</h2>
              {[{ icon: Phone, label: "Phone / WhatsApp", href: "tel:+917494954286", value: "+91 74949 54286", sub: "Mon-Sat: 10am to 7pm (IST)" },
                { icon: Mail, label: "Email", href: "mailto:ananyaboutqiue9495@gmail.com", value: "ananyaboutqiue9495@gmail.com", sub: "We typically reply within 24 hours" },
                { icon: MapPin, label: "Location", href: null, value: "Mumbai", sub: "Maharashtra, India" }
              ].map(({ icon: Icon, label, href, value, sub }) => (
                <div key={label} className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-md transition-shadow flex items-start gap-4">
                  <div className="w-12 h-12 bg-royal/10 text-royal rounded-full flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</h3>
                    {href ? <a href={href} className="text-lg font-bold text-slate-900 hover:text-royal transition-colors">{value}</a> : <p className="text-lg font-bold text-slate-900">{value}</p>}
                    <p className="text-slate-500 text-sm mt-1">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-slate-100">
              <h2 className="text-2xl font-serif font-bold text-royal mb-6">Send us a Message</h2>
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Message sending is not currently active. Please contact us via phone or email."); }}>
                <div className="grid md:grid-cols-2 gap-6">
                  {[["Your Name", "text", "E.g. John Doe"], ["Email Address", "email", "john@example.com"]].map(([label, type, placeholder]) => (
                    <div key={label} className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
                      <input required type={type} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-royal/50 focus:ring-4 focus:ring-royal/10 transition-all font-medium" placeholder={placeholder} />
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</label>
                  <input required type="text" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-royal/50 focus:ring-4 focus:ring-royal/10 transition-all font-medium" placeholder="How can we help?" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message</label>
                  <textarea required rows={5} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-royal/50 focus:ring-4 focus:ring-royal/10 transition-all font-medium resize-none" placeholder="Write your message here..." />
                </div>
                <button type="submit" className="w-full py-4 bg-royal text-white font-bold rounded-2xl hover:bg-sapphire shadow-xl shadow-royal/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                  Submit Message <Send className="w-4 h-4 mt-0.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ShellLayout>
  );
}
