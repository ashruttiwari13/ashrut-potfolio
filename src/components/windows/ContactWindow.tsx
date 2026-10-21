'use client';

import React, { useState, useRef } from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
  FileText,
  UploadCloud,
  X,
  Copy,
  Check,
  Briefcase,
  Paperclip,
  ExternalLink,
  Building,
  AtSign,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ContactFormData } from '@/lib/validation';

export const ContactWindow: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    contact_handle: '',
    project_type: 'Game Development',
    target_platform: 'Unreal Engine 5',
    budget_range: '$1,000 – $3,000',
    timeline: '1 – 2 Months',
    message: '',
    attachment: undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState<ContactFormData | null>(null);
  const [successResponse, setSuccessResponse] = useState<{
    message: string;
    emailDelivered: boolean;
    providerNote?: string;
    attachmentSaved?: boolean;
    attachmentUrl?: string | null;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const projectTypes = [
    'Game Development',
    '3D Character Art',
    'Environment / Level Art',
    'Cinematography & VFX',
    'Full-Time / Contract Role',
    'Other Creative Project',
  ] as const;

  const platformOptions = [
    'Unreal Engine 5',
    'Godot 4',
    'Unity 6',
    'PC / Steam',
    'Mobile (iOS & Android)',
    'Blender / Maya VFX',
    'Web / Three.js / WebGL',
    'Console (PS5 / Xbox / Switch)',
    'Cross-Platform / Other',
  ];

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

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('ashrut.tiwari2004@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleFile = (file: File | null) => {
    setFileError(null);
    if (!file) {
      setFormData((prev) => ({ ...prev, attachment: undefined }));
      return;
    }

    // 15 MB limit check
    if (file.size > 15 * 1024 * 1024) {
      setFileError(`File "${file.name}" exceeds 15MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please attach a smaller file.`);
      return;
    }

    setFileUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setFormData((prev) => ({
        ...prev,
        attachment: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type || 'application/pdf',
          base64,
        },
      }));
      setFileUploading(false);
    };
    reader.onerror = () => {
      setFileError('Could not process the selected file. Please try again.');
      setFileUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeAttachment = () => {
    setFormData((prev) => ({ ...prev, attachment: undefined }));
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const currentSubmission = { ...formData };
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.issues) {
          setFieldErrors(data.issues);
          setErrorMessage('Please check the highlighted fields below.');
        } else {
          setErrorMessage(data.error || 'Failed to submit inquiry. Please try again.');
        }
        setIsSubmitting(false);
        return;
      }

      setLastSubmitted(currentSubmission);
      setSuccessResponse({
        message: data.message || 'Freelance inquiry transmitted successfully!',
        emailDelivered: data.emailDelivered,
        providerNote: data.providerNote,
        attachmentSaved: data.attachmentSaved,
        attachmentUrl: data.attachmentUrl,
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#ffb6c1', '#c0f0dd', '#e2d1ff', '#ffd966', '#a0d4ff'],
        });
      } catch {
        // Fallback if canvas blocked
      }

      // Reset form fields
      setFormData({
        name: '',
        email: '',
        company: '',
        contact_handle: '',
        project_type: 'Game Development',
        target_platform: 'Unreal Engine 5',
        budget_range: '$1,000 – $3,000',
        timeline: '1 – 2 Months',
        message: '',
        attachment: undefined,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch {
      setErrorMessage('Network error occurred. Please verify your connection or use the direct Gmail link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner: Professional Freelance Header & Direct Email Badge */}
      <div className="p-3.5 bg-gradient-to-r from-pastel-pink/20 via-white to-pastel-mint/30 border-2 border-pastel-dark rounded-retro-sm shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-800 bg-emerald-100 border border-emerald-400 rounded-full max-w-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>Accepting Freelance & Commissions</span>
              </span>
              <span className="text-[11px] font-bold text-pastel-soft">
                · Direct Pipeline
              </span>
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-pastel-dark flex items-center gap-1.5 pt-0.5 break-words">
              <Briefcase size={17} className="text-pastel-dark shrink-0" />
              <span>Commission Ashrut Tiwari for Your Project</span>
            </h3>
            <p className="text-xs text-pastel-soft break-words">
              Game development, 3D character modeling, environment art & cinematic VFX.
            </p>
          </div>

          {/* Quick Copy / Email Direct Pill */}
          <div className="flex flex-wrap items-center gap-2 pt-1 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-pastel-dark bg-white hover:bg-pastel-warm border-2 border-pastel-dark rounded-full shadow-[2px_2px_0_#3d3d3d] active:translate-x-0.5 active:translate-y-0.5 transition-all shrink-0 cursor-pointer"
              title="Copy Ashrut's Gmail address"
            >
              {copiedEmail ? (
                <>
                  <Check size={12} className="text-emerald-600 shrink-0" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={12} className="shrink-0" />
                  <span>Copy Gmail</span>
                </>
              )}
            </button>
            <a
              href="mailto:ashrut.tiwari2004@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-pastel-dark bg-pastel-mint hover:bg-pastel-mint/80 border-2 border-pastel-dark rounded-full shadow-[2px_2px_0_#3d3d3d] active:translate-x-0.5 active:translate-y-0.5 transition-all max-w-full min-w-0"
              title="Compose direct to ashrut.tiwari2004@gmail.com"
            >
              <span className="truncate">ashrut.tiwari2004@gmail.com</span>
              <ExternalLink size={11} className="shrink-0" />
            </a>
          </div>
        </div>

        {/* Professional Guarantees Row */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-2.5 mt-2.5 border-t border-pastel-dark/20 text-[11px] font-semibold text-pastel-soft">
          <div className="flex items-center gap-1.5 flex-1 min-w-[130px]">
            <ShieldCheck size={14} className="text-emerald-700 shrink-0" />
            <span>NDA & IP Confidentiality Guaranteed</span>
          </div>
          <div className="flex items-center gap-1.5 flex-1 min-w-[130px]">
            <Sparkles size={14} className="text-amber-600 shrink-0" />
            <span>Unreal Engine 5 & Godot Pipelines</span>
          </div>
          <div className="flex items-center gap-1.5 flex-1 min-w-[130px]">
            <FileText size={14} className="text-sky-700 shrink-0" />
            <span>PDF Brief & GDD Supported</span>
          </div>
        </div>
      </div>

      {successResponse ? (
        /* SUCCESS CONFIRMATION VIEW */
        <div className="p-6 bg-white border-2 border-pastel-dark rounded-retro text-center space-y-4 shadow-[4px_4px_0_#3d3d3d]">
          <div className="w-14 h-14 rounded-full bg-pastel-mint border-2 border-pastel-dark mx-auto flex items-center justify-center shadow-[3px_3px_0_#3d3d3d]">
            <CheckCircle2 size={30} className="text-pastel-dark" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-400">
              Inquiry Dispatched Successfully
            </span>
            <h4 className="font-extrabold text-lg text-pastel-dark pt-1">
              {successResponse.message}
            </h4>
            <p className="text-xs text-pastel-soft max-w-md mx-auto leading-relaxed">
              Your freelance commission brief has been routed to <strong>ashrut.tiwari2004@gmail.com</strong>.
              Ashrut will review your scope, timeline, and deliverables and reply to <strong>{lastSubmitted?.email}</strong> within 24 hours.
            </p>
          </div>

          {/* Inquiry Summary Card */}
          {lastSubmitted && (
            <div className="p-3.5 bg-pastel-warm/40 border-2 border-pastel-dark/30 rounded-xl text-left text-xs max-w-lg mx-auto space-y-1.5">
              <div className="flex justify-between border-b border-pastel-dark/15 pb-1">
                <span className="font-bold text-pastel-soft">Client:</span>
                <span className="font-bold text-pastel-dark">{lastSubmitted.name} ({lastSubmitted.email})</span>
              </div>
              {lastSubmitted.company && (
                <div className="flex justify-between border-b border-pastel-dark/15 pb-1">
                  <span className="font-bold text-pastel-soft">Studio / Company:</span>
                  <span className="font-bold text-pastel-dark">{lastSubmitted.company}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-pastel-dark/15 pb-1">
                <span className="font-bold text-pastel-soft">Project Category:</span>
                <span className="font-bold text-pastel-dark">{lastSubmitted.project_type}</span>
              </div>
              {lastSubmitted.target_platform && (
                <div className="flex justify-between border-b border-pastel-dark/15 pb-1">
                  <span className="font-bold text-pastel-soft">Target Engine/Platform:</span>
                  <span className="font-bold text-pastel-dark">{lastSubmitted.target_platform}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-pastel-dark/15 pb-1">
                <span className="font-bold text-pastel-soft">Budget & Timeline:</span>
                <span className="font-bold text-pastel-dark">{lastSubmitted.budget_range || 'Flexible'} · {lastSubmitted.timeline || 'Flexible'}</span>
              </div>
              {lastSubmitted.attachment && (
                <div className="flex justify-between pt-0.5">
                  <span className="font-bold text-pastel-soft">Attached Brief:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <Paperclip size={12} />
                    {lastSubmitted.attachment.fileName} ({(lastSubmitted.attachment.fileSize / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="p-2.5 bg-white border border-pastel-dark/30 rounded-xl text-[11px] text-pastel-dark max-w-md mx-auto">
            {successResponse.providerNote}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={`mailto:ashrut.tiwari2004@gmail.com?subject=${encodeURIComponent(
                `Freelance Inquiry: ${lastSubmitted?.project_type || 'Commission'} from ${lastSubmitted?.name || 'Client'}${lastSubmitted?.company ? ` (${lastSubmitted.company})` : ''}`
              )}&body=${encodeURIComponent(
                lastSubmitted
                  ? `Hi Ashrut,\n\nFollowing up on my project inquiry from your website:\n\nClient Name: ${lastSubmitted.name}\nEmail: ${lastSubmitted.email}\nStudio / Company: ${lastSubmitted.company || 'N/A'}\nContact Handle: ${lastSubmitted.contact_handle || 'N/A'}\nProject Category: ${lastSubmitted.project_type}\nEngine / Platform: ${lastSubmitted.target_platform || 'N/A'}\nBudget: ${lastSubmitted.budget_range || 'Flexible'}\nTimeline: ${lastSubmitted.timeline || 'Flexible'}\n${lastSubmitted.attachment ? `Attachment: ${lastSubmitted.attachment.fileName}\n` : ''}\nProject Requirements:\n${lastSubmitted.message}\n\nBest regards,\n${lastSubmitted.name}`
                  : ''
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="retro-btn retro-btn-primary text-xs"
            >
              <span>✉️ Open Direct in Gmail (Saved Draft)</span>
            </a>

            <button
              type="button"
              onClick={() => setSuccessResponse(null)}
              className="retro-btn retro-btn-mint text-xs"
            >
              <Sparkles size={12} />
              <span>Submit Another Project</span>
            </button>
          </div>
        </div>
      ) : (
        /* MAIN FREELANCE INQUIRY FORM */
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {errorMessage && (
            <div className="p-3 bg-rose-100 border-2 border-rose-400 rounded-xl text-xs font-bold text-rose-800 flex items-center gap-2 shadow-sm">
              <AlertCircle size={16} className="shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Client & Studio Details */}
          <div className="p-3 bg-white border-2 border-pastel-dark rounded-retro-sm space-y-2.5 overflow-hidden">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-pastel-dark border-b border-pastel-dark/15 pb-1">
              <Building size={14} className="text-pastel-dark shrink-0" />
              <span>1. Client & Studio Details</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="min-w-0">
                <label htmlFor="client-name" className="block text-xs font-bold text-pastel-dark mb-1">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="client-name"
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full min-w-0 max-w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full focus:outline-none focus:ring-2 focus:ring-pastel-pink transition-all box-border"
                />
                {fieldErrors.name && (
                  <p className="text-[10px] text-rose-600 font-bold mt-0.5">{fieldErrors.name[0]}</p>
                )}
              </div>

              <div className="min-w-0">
                <label htmlFor="client-email" className="block text-xs font-bold text-pastel-dark mb-1">
                  Work / Contact Email <span className="text-rose-500">*</span>
                </label>
                <input
                  id="client-email"
                  type="email"
                  required
                  placeholder="maya@gamestudio.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full min-w-0 max-w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full focus:outline-none focus:ring-2 focus:ring-pastel-pink transition-all box-border"
                />
                {fieldErrors.email && (
                  <p className="text-[10px] text-rose-600 font-bold mt-0.5">{fieldErrors.email[0]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-0.5">
              <div className="min-w-0">
                <label htmlFor="client-company" className="block text-xs font-bold text-pastel-dark mb-1 truncate">
                  Studio / Company (Optional)
                </label>
                <input
                  id="client-company"
                  type="text"
                  placeholder="e.g. Neon Horizon Studios"
                  value={formData.company || ''}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full min-w-0 max-w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full focus:outline-none focus:ring-2 focus:ring-pastel-pink transition-all box-border"
                />
              </div>

              <div className="min-w-0">
                <label htmlFor="client-handle" className="block text-xs font-bold text-pastel-dark mb-1 truncate">
                  Direct Chat Handle (Discord / WhatsApp)
                </label>
                <div className="relative">
                  <input
                    id="client-handle"
                    type="text"
                    placeholder="e.g. discord: maya#1234"
                    value={formData.contact_handle || ''}
                    onChange={(e) => setFormData({ ...formData, contact_handle: e.target.value })}
                    className="w-full min-w-0 max-w-full pl-7 pr-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full focus:outline-none focus:ring-2 focus:ring-pastel-pink transition-all box-border"
                  />
                  <AtSign size={12} className="absolute left-2.5 top-2.5 text-pastel-soft" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Project Classification & Scope */}
          <div className="p-3 bg-white border-2 border-pastel-dark rounded-retro-sm space-y-2.5 overflow-hidden">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-pastel-dark border-b border-pastel-dark/15 pb-1">
              <Briefcase size={14} className="text-pastel-dark shrink-0" />
              <span>2. Project Classification & Scope</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="min-w-0">
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
                  className="w-full min-w-0 max-w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full focus:outline-none focus:ring-2 focus:ring-pastel-pink box-border"
                >
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="min-w-0">
                <label htmlFor="target-platform" className="block text-xs font-bold text-pastel-dark mb-1 truncate">
                  Target Engine / Platform
                </label>
                <select
                  id="target-platform"
                  value={formData.target_platform || 'Unreal Engine 5'}
                  onChange={(e) => setFormData({ ...formData, target_platform: e.target.value })}
                  className="w-full min-w-0 max-w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full focus:outline-none focus:ring-2 focus:ring-pastel-pink box-border"
                >
                  {platformOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="min-w-0">
                <label htmlFor="budget-range" className="block text-xs font-bold text-pastel-dark mb-1">
                  Estimated Budget
                </label>
                <select
                  id="budget-range"
                  value={formData.budget_range}
                  onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                  className="w-full min-w-0 max-w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full focus:outline-none focus:ring-2 focus:ring-pastel-pink box-border"
                >
                  {budgetOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="min-w-0">
                <label htmlFor="timeline" className="block text-xs font-bold text-pastel-dark mb-1">
                  Target Timeline / Milestone
                </label>
                <select
                  id="timeline"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="w-full min-w-0 max-w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full focus:outline-none focus:ring-2 focus:ring-pastel-pink box-border"
                >
                  {timelineOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Project Brief & Vision */}
          <div className="p-3 bg-white border-2 border-pastel-dark rounded-retro-sm space-y-2">
            <div className="flex items-center justify-between border-b border-pastel-dark/15 pb-1">
              <span className="text-xs font-extrabold text-pastel-dark flex items-center gap-1.5">
                <FileText size={14} className="text-pastel-dark" />
                <span>3. Project Description & Freelance Needs <span className="text-rose-500">*</span></span>
              </span>
              <span className="text-[10px] text-pastel-soft font-semibold">
                {formData.message.length} / 5000 chars
              </span>
            </div>

            <textarea
              id="message-desc"
              required
              rows={4}
              placeholder="Tell Ashrut all about your project needs:
- Gameplay mechanics or 3D art style requirements
- Deliverables list (rigged models, level blockout, VFX shaders, modular assets)
- References, target engine version, or any key deadlines..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full p-2.5 text-xs bg-white border-2 border-pastel-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink resize-none leading-relaxed shadow-sm"
            />
            {fieldErrors.message && (
              <p className="text-[10px] text-rose-600 font-bold mt-0.5">{fieldErrors.message[0]}</p>
            )}
          </div>

          {/* Section 4: Attach PDF Brief / GDD */}
          <div className="p-3 bg-white border-2 border-pastel-dark rounded-retro-sm space-y-2">
            <div className="flex items-center justify-between border-b border-pastel-dark/15 pb-1">
              <span className="text-xs font-extrabold text-pastel-dark flex items-center gap-1.5">
                <Paperclip size={14} className="text-pastel-dark" />
                <span>4. Attach Project Brief / GDD (PDF or Document)</span>
              </span>
              <span className="text-[10px] text-pastel-soft font-bold">
                Max 15MB · PDF, DOC, ZIP, PNG
              </span>
            </div>

            {formData.attachment ? (
              /* Attached file chip */
              <div className="p-3 bg-pastel-mint/30 border-2 border-pastel-dark rounded-xl flex items-center justify-between gap-2 shadow-[2px_2px_0_#3d3d3d]">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-9 h-9 rounded-lg bg-white border-2 border-pastel-dark flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-rose-600" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-pastel-dark truncate">
                      {formData.attachment.fileName}
                    </p>
                    <p className="text-[10px] text-pastel-soft flex items-center gap-2">
                      <span>{(formData.attachment.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                      <span className="text-emerald-700 font-bold">✓ Ready to send to ashrut.tiwari2004@gmail.com</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeAttachment}
                  className="p-1 rounded-full bg-white hover:bg-rose-100 border border-pastel-dark text-pastel-dark hover:text-rose-600 transition-colors shrink-0"
                  title="Remove attachment"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              /* Upload dropzone */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-pastel-pink bg-pastel-pink/20 scale-[0.99]'
                    : 'border-pastel-dark/40 bg-pastel-warm/20 hover:bg-pastel-warm/40 hover:border-pastel-dark'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.zip,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFile(e.target.files[0]);
                    }
                  }}
                />

                {fileUploading ? (
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-pastel-dark">
                    <Loader2 size={16} className="animate-spin text-pastel-dark" />
                    <span>Processing file attachment...</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-pastel-dark mx-auto flex items-center justify-center text-pastel-dark shadow-[1px_1px_0_#3d3d3d]">
                      <UploadCloud size={16} />
                    </div>
                    <p className="text-xs font-bold text-pastel-dark">
                      Click to upload or drag & drop your PDF Brief / GDD here
                    </p>
                    <p className="text-[10px] text-pastel-soft">
                      Attach Game Design Documents, style guides, reference sheets, or RFP specifications
                    </p>
                  </div>
                )}
              </div>
            )}

            {fileError && (
              <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                <AlertCircle size={13} />
                <span>{fileError}</span>
              </p>
            )}
          </div>

          {/* Action Row: Privacy & Transmit Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 w-full">
            <div className="flex items-center gap-1.5 text-[11px] text-pastel-soft min-w-0">
              <ShieldCheck size={14} className="text-emerald-700 shrink-0" />
              <span className="break-all">Transmitted directly to <strong>ashrut.tiwari2004@gmail.com</strong></span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || fileUploading}
              className="retro-btn retro-btn-primary w-full sm:w-auto px-6 py-2.5 text-xs flex items-center justify-center gap-2 shrink-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Transmitting Brief & Attachments...</span>
                </>
              ) : (
                <>
                  <Send size={14} strokeWidth={2.5} />
                  <span>Submit Freelance Brief ✨</span>
                </>
              )}
            </button>
          </div>

          {/* Fallback info */}
          <p className="text-[10px] text-pastel-soft text-center pt-1">
            Need an instant response or want to send directly from your personal mail app?{' '}
            <a
              href="mailto:ashrut.tiwari2004@gmail.com?subject=Freelance%20Project%20Inquiry"
              className="font-bold underline text-pastel-dark hover:text-rose-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              Click here to launch Gmail
            </a>
          </p>
        </form>
      )}
    </div>
  );
};
