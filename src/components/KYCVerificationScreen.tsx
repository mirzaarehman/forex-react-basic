import React, { useState } from 'react';
import { 
  Shield, 
  Upload, 
  Check, 
  Lock, 
  RotateCw, 
  ChevronRight, 
  Search, 
  Bell, 
  User, 
  AlertCircle,
  FileText,
  BadgeAlert,
  Home,
  FileCheck
} from 'lucide-react';

export default function KYCVerificationScreen() {
  const [docType, setDocType] = useState('Passport');
  const [docNumber, setDocNumber] = useState('G77291040');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'In Progress' | 'Submitted'>('In Progress');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
      setFileUploaded(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setFileUploaded(true);
    }
  };

  const handleSubmit = () => {
    if (!fileUploaded) {
      alert('Please upload a document before submitting.');
      return;
    }
    setSubmitStatus('Submitted');
  };

  return (
    <div className="flex-grow flex flex-col min-h-screen text-[#e5e2e1] font-sans">
      {/* Top Header */}
      <header className="flex justify-between items-center h-16 px-6 lg:px-8 bg-[#131313]/90 backdrop-blur-md sticky top-0 z-40 border-b border-[#2C2C2C] select-none font-sans">
        <div className="flex items-center gap-4">
          <div className="font-bold text-lg text-white">ForexPro CRM</div>
        </div>
        <div className="flex items-center gap-4 text-sm font-bold text-[#c3c5d8]">
          <button className="text-[#8d90a2] hover:text-[#2962ff] transition-colors p-1.5 hover:bg-[#1c1b1b] rounded-lg">
            <Bell size={18} />
          </button>
          <div className="h-6 w-px bg-[#2C2C2C]"></div>
          <button className="flex items-center gap-2 text-[#8d90a2] hover:text-[#2962ff] transition-colors p-1 rounded-lg">
            <span className="hidden md:block uppercase tracking-wider text-[11px] text-[#2962ff]">Account Switcher</span>
            <User size={18} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto custom-scrollbar select-none">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb & Title */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-[#8d90a2] text-xs mb-2 font-semibold">
              <span>Settings</span>
              <ChevronRight size={12} />
              <span className="text-[#2962ff]">Identity Verification</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">KYC Verification</h1>
            <p className="text-xs text-[#8d90a2] mt-1.5 leading-relaxed max-w-2xl font-medium">
              To ensure the security of your institutional trading account and comply with strict FCA and global financial regulations, please upload your verification credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Cards */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Card 1: Identity Verification */}
              <div className="bg-[#1c1b1b] border border-[#2C2C2C] rounded-xl overflow-hidden shadow-md">
                <div className="p-5 border-b border-[#2C2C2C] flex justify-between items-center bg-[#252525]/30">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-[#2962ff]/10 flex items-center justify-center text-[#2962ff]">
                      <FileCheck size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">Identity Verification</h3>
                      <p className="text-xs text-[#8d90a2] mt-0.5">National ID, Passport, or Driver's License</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                    submitStatus === 'Submitted' 
                      ? 'bg-emerald-500/10 text-[#40e56c] border-emerald-500/20'
                      : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      submitStatus === 'Submitted' ? 'bg-[#40e56c]' : 'bg-yellow-400 animate-pulse'
                    }`}></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {submitStatus === 'Submitted' ? 'Under Review' : 'In Progress'}
                    </span>
                  </div>
                </div>

                <div className="p-6 lg:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-[#8d90a2] uppercase tracking-wider">Document Type</label>
                        <select 
                          value={docType}
                          onChange={(e) => setDocType(e.target.value)}
                          className="w-full bg-[#131313] border border-[#2C2C2C] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#2962ff]"
                        >
                          <option value="Passport">Passport</option>
                          <option value="National ID Card">National ID Card</option>
                          <option value="Driver's License">Driver's License</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-[#8d90a2] uppercase tracking-wider">Document Number</label>
                        <input 
                          type="text" 
                          value={docNumber}
                          onChange={(e) => setDocNumber(e.target.value)}
                          className="w-full bg-[#131313] border border-[#2C2C2C] rounded-lg p-3 text-xs text-white font-mono focus:outline-none focus:border-[#2962ff]"
                        />
                      </div>
                    </div>

                    {/* Drag and Drop uploader zone */}
                    <div 
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition-all duration-200 text-center relative ${
                        dragActive ? 'border-[#2962ff] bg-[#2962ff]/5' : 'border-[#2C2C2C] bg-[#131313]'
                      } ${fileUploaded ? 'border-[#40e56c] bg-[#40e56c]/5' : ''}`}
                    >
                      <input 
                        type="file" 
                        id="kyc-file" 
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".pdf,.png,.jpg,.jpeg"
                      />
                      <Upload size={32} className={`mb-3 ${fileUploaded ? 'text-[#40e56c]' : 'text-[#8d90a2]'}`} />
                      <p className="text-xs font-bold text-white mb-1">
                        {fileUploaded ? 'File Ready' : 'Upload Front Page'}
                      </p>
                      <p className="text-[10px] text-[#8d90a2] max-w-xs leading-relaxed">
                        {fileUploaded ? fileName : 'PDF, PNG, or JPG (Max 10MB). Drag and drop or click.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-[#2C2C2C]/50">
                    <button 
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitStatus === 'Submitted'}
                      className={`px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
                        submitStatus === 'Submitted'
                          ? 'bg-[#2a2a2a] text-[#8d90a2] cursor-not-allowed border border-[#2C2C2C]'
                          : 'bg-[#2962ff] text-white hover:bg-[#004ee8]'
                      }`}
                    >
                      {submitStatus === 'Submitted' ? 'Document Submitted' : 'Submit Document'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2: Proof of Address Card */}
              <div className="bg-[#1c1b1b] border border-[#2C2C2C] rounded-xl overflow-hidden shadow-md opacity-60">
                <div className="p-5 border-b border-[#2C2C2C] flex justify-between items-center bg-[#252525]/30">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-[#1c1b1b] border border-[#2C2C2C] flex items-center justify-center text-[#8d90a2]">
                      <Home size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#c3c5d8]">Proof of Address</h3>
                      <p className="text-xs text-[#8d90a2] mt-0.5">Utility Bill, Bank Statement, or Tax Invoice</p>
                    </div>
                  </div>
                  <div className="bg-[#131313] text-[#8d90a2] border border-[#2C2C2C] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Pending
                  </div>
                </div>
                
                <div className="p-10 text-center flex flex-col items-center justify-center bg-[#131313]/20">
                  <Lock size={28} className="text-[#8d90a2] mb-3" />
                  <p className="text-xs font-bold text-white mb-1">Verification Locked</p>
                  <p className="text-[10px] text-[#8d90a2] max-w-sm leading-relaxed">
                    Please complete your primary Identity Verification first to unlock the Proof of Address submission gateway.
                  </p>
                </div>
              </div>

              {/* Card 3: Financial Assessment Card */}
              <div className="bg-[#1c1b1b] border border-[#2C2C2C] rounded-xl p-5 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-[#1c1b1b] border border-[#2C2C2C] flex items-center justify-center text-[#8d90a2]">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#e5e2e1]">Financial Assessment</h3>
                    <p className="text-xs text-[#8d90a2] mt-0.5">Suitability and Appropriateness Questionnaire</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => alert('Launching Financial Suitability Assessment Form...')}
                  className="px-4 py-2 border border-[#2C2C2C] text-xs font-semibold text-[#8d90a2] hover:bg-[#252525] hover:text-white rounded-lg transition-colors"
                >
                  Not Started
                </button>
              </div>

            </div>

            {/* Right Column: Timeline */}
            <div className="lg:col-span-4 space-y-6">
              {/* Timeline Card */}
              <div className="bg-[#1c1b1b] border border-[#2C2C2C] rounded-xl p-6 shadow-md select-none font-sans">
                <h4 className="text-[10px] font-bold text-[#8d90a2] uppercase tracking-widest mb-6">Verification Status</h4>
                
                <div className="relative space-y-8 pl-4 border-l border-[#2C2C2C]">
                  
                  {/* Step 1: Completed */}
                  <div className="relative flex gap-4 items-start">
                    {/* Circle check marker on left border */}
                    <div className="absolute -left-[29px] w-6 h-6 rounded-full bg-[#02c953] text-[#0e0e0e] flex items-center justify-center shadow-[0_0_12px_rgba(2,201,83,0.3)]">
                      <Check size={14} className="stroke-3" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-white leading-tight">Registration</p>
                      <p className="text-[10px] text-[#8d90a2] mt-0.5">Completed on Oct 24, 2023</p>
                    </div>
                  </div>

                  {/* Step 2: Under Review */}
                  <div className="relative flex gap-4 items-start">
                    <div className="absolute -left-[29px] w-6 h-6 rounded-full bg-[#2962ff] text-white flex items-center justify-center shadow-[0_0_12px_rgba(41,98,255,0.4)]">
                      <RotateCw size={12} className="animate-spin-slow stroke-3" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-[#2962ff] leading-tight">Identity Check</p>
                      <p className="text-[10px] text-[#8d90a2] mt-0.5">
                        {submitStatus === 'Submitted' ? 'Submitted - Under Review' : 'In Progress - Awaiting Document'}
                      </p>
                      <div className="mt-3 bg-[#121212] border border-[#2c2c2c] rounded-lg p-3">
                        <p className="text-[10px] text-[#c3c5d8] leading-relaxed">
                          {submitStatus === 'Submitted' 
                            ? 'Our compliance team is currently reviewing your document. This typically takes 2-4 hours during business days.'
                            : 'Please drag & drop or choose your passport photo page, enter its code, and hit "Submit" to queue it for review.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Pending Address Verified */}
                  <div className="relative flex gap-4 items-start opacity-40">
                    <div className="absolute -left-[29px] w-6 h-6 rounded-full bg-[#2a2a2a] border border-[#2C2C2C] flex items-center justify-center text-[#8d90a2]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8d90a2]"></span>
                    </div>
                    <div>
                      <p className="font-bold text-xs text-[#c3c5d8] leading-tight">Address Verified</p>
                      <p className="text-[10px] text-[#8d90a2] mt-0.5">Waiting for ID approval</p>
                    </div>
                  </div>

                  {/* Step 4: Fully Verified */}
                  <div className="relative flex gap-4 items-start opacity-40">
                    <div className="absolute -left-[29px] w-6 h-6 rounded-full bg-[#2a2a2a] border border-[#2C2C2C] flex items-center justify-center text-[#8d90a2]">
                      <Shield size={12} />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-[#c3c5d8] leading-tight">Fully Verified</p>
                      <p className="text-[10px] text-[#8d90a2] mt-0.5">Institutional Access Granted</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Security Banner Card */}
              <div className="bg-[#121212] border border-[#2962ff]/20 rounded-xl p-5 relative overflow-hidden select-none">
                <div className="absolute -right-4 -top-4 w-20 h-24 bg-[#2962ff]/5 rounded-full blur-xl pointer-events-none"></div>
                <Shield size={20} className="text-[#2962ff] mb-3" />
                <h5 className="text-xs font-bold text-white mb-1.5">Institutional Security</h5>
                <p className="text-[11px] text-[#c3c5d8] leading-relaxed">
                  Apex Ledger uses robust AES-256 data layer encryption and compliance protocols for all storage buckets. Your documents are strictly gated according to GDPR and FCA guidelines.
                </p>
                <button 
                  type="button" 
                  onClick={() => alert('Opening compliance privacy policies...')}
                  className="inline-block mt-3 text-xs text-[#2962ff] font-semibold hover:underline"
                >
                  Privacy Policy ›
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
