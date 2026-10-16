'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ContactFormData } from '@/lib/validation';

export const ContactWindow: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    project_type: 'Game Development',
    budget_range: '$1,000 – $3,000',
    timeline: '1 – 2 Months',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResponse, setSuccessResponse] = useState<{
    message: string;
    emailDelivered: boolean;
    providerNote?: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const projectTypes = [
    'Game Development',
    '3D Character Art',
    'Environment / Level Art',
    'Cinematography & VFX',
    'Full-Time / Contract Role',
    'Other Creative Project',
  ] as const;

  const budgetOptions = [
    'Under $1,000',
    '$1,000 – $3,000',
    '$3,000 – $7,500',
    '$7,500+',
    'Flexible / Discuss in Call',
  ];

  const timelineOptions = [
    'Urgent (< 2 weeks)',
    '1 – 2 Months',
    '3 – 6 Months',
    'Long-Term Ongoing',
    'Flexible',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.issues) {
          setFieldErrors(data.issues);
          setErrorMessage('Please correct the highlighted fields.');
        } else {
          setErrorMessage(data.error || 'Failed to send inquiry. Please try again.');
        }
        setIsSubmitting(false);
        return;
      }

      setSuccessResponse({
        message: data.message || 'Inquiry sent successfully!',
        emailDelivered: data.emailDelivered,
        providerNote: data.providerNote,
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#ffb6c1', '#c0f0dd', '#e2d1ff', '#ffd966'],
        });
      } catch {
        // Confetti fallback
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        project_type: 'Game Development',
        budget_range: '$1,000 – $3,000',
        timeline: '1 – 2 Months',
        message: '',
      });
    } catch {
      setErrorMessage('Network connection error. Please verify your internet and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="p-3 bg-white border-2 border-pastel-dark rounded-retro-sm flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm text-pastel-dark flex items-center gap-1.5">
            <span>💌</span>
            <span>Let&apos;s Build Something Extraordinary</span>
          </h3>
          <p className="text-xs text-pastel-soft mt-0.5">
            Freelance game mechanics, 3D character commissions, or cinematics.
          </p>
        </div>
      </div>

      {successResponse ? (
        <div className="p-6 bg-white border-2 border-pastel-dark rounded-retro text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-pastel-mint border-2 border-pastel-dark mx-auto flex items-center justify-center">
            <CheckCircle2 size={24} className="text-pastel-dark" />
          </div>

          <h4 className="font-extrabold text-base text-pastel-dark">
            {successResponse.message}
          </h4>

          <p className="text-xs text-pastel-soft max-w-sm mx-auto leading-relaxed">
            I review all incoming commissions and inquiries promptly. You will receive a direct reply to your email.
          </p>

          <div className="p-2.5 bg-pastel-warm/60 border border-pastel-dark/30 rounded-xl text-[11px] text-pastel-dark inline-block">
            {successResponse.providerNote}
          </div>

          <div>
            <button
              type="button"
              onClick={() => setSuccessResponse(null)}
              className="retro-btn retro-btn-mint text-xs mt-2"
            >
              <Sparkles size={12} />
              <span>Send Another Message</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {errorMessage && (
            <div className="p-2.5 bg-rose-100 border border-rose-400 rounded-xl text-xs font-semibold text-rose-800 flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Name & Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label htmlFor="client-name" className="block text-xs font-bold text-pastel-dark mb-1">
                Your Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="client-name"
                type="text"
                required
                placeholder="e.g. Maya Lin"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full focus:outline-none focus:ring-2 focus:ring-pastel-pink"
              />
              {fieldErrors.name && (
                <p className="text-[10px] text-rose-600 font-bold mt-0.5">{fieldErrors.name[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="client-email" className="block text-xs font-bold text-pastel-dark mb-1">
                Your Email <span className="text-rose-500">*</span>
              </label>
              <input
                id="client-email"
                type="email"
                required
                placeholder="maya@studio.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full focus:outline-none focus:ring-2 focus:ring-pastel-pink"
              />
              {fieldErrors.email && (
                <p className="text-[10px] text-rose-600 font-bold mt-0.5">{fieldErrors.email[0]}</p>
              )}
            </div>
          </div>

          {/* Project Type */}
          <div>
            <label htmlFor="project-type" className="block text-xs font-bold text-pastel-dark mb-1">
              Project Category <span className="text-rose-500">*</span>
            </label>
            <select
              id="project-type"
              value={formData.project_type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  project_type: e.target.value as ContactFormData['project_type'],
                })
              }
              className="w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full focus:outline-none focus:ring-2 focus:ring-pastel-pink"
            >
              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Budget & Timeline Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label htmlFor="budget-range" className="block text-xs font-bold text-pastel-dark mb-1">
                Estimated Budget (Optional)
              </label>
              <select
                id="budget-range"
                value={formData.budget_range}
                onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full focus:outline-none focus:ring-2 focus:ring-pastel-pink"
              >
                {budgetOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="timeline" className="block text-xs font-bold text-pastel-dark mb-1">
                Target Timeline (Optional)
              </label>
              <select
                id="timeline"
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full focus:outline-none focus:ring-2 focus:ring-pastel-pink"
              >
                {timelineOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message-desc" className="block text-xs font-bold text-pastel-dark mb-1">
              Project Description & Requirements <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="message-desc"
              required
              rows={3}
              placeholder="Tell me about your gameplay vision, art style reference, target engine, or scope..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full p-2.5 text-xs bg-white border-2 border-pastel-dark rounded-2xl focus:outline-none focus:ring-2 focus:ring-pastel-pink resize-none shadow-sm"
            />
            {fieldErrors.message && (
              <p className="text-[10px] text-rose-600 font-bold mt-0.5">{fieldErrors.message[0]}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 text-[11px] text-pastel-soft">
              <ShieldCheck size={13} className="text-pastel-dark" />
              <span>Safe & spam-protected</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="retro-btn retro-btn-primary px-5 py-2 text-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Transmitting...</span>
                </>
              ) : (
                <>
                  <Send size={13} strokeWidth={2.5} />
                  <span>Send Inquiry ✨</span>
                </>
              )}
            </button>
          </div>

          {/* Privacy Notice */}
          <p className="text-[10px] text-pastel-soft text-center pt-1">
            Privacy Guarantee: Information entered is strictly utilized to respond to your project request and is never distributed or marketed.
          </p>
        </form>
      )}
    </div>
  );
};
