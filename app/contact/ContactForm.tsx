"use client";

import { Send } from "lucide-react";

export function ContactForm() {
  return (
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
  );
}
