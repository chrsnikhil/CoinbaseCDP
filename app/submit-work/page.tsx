'use client';

// this page should be accessed only
// after the user has paid the commitment fee
// but until we write that smart contract
// ill just leave this here

import '@coinbase/onchainkit/styles.css';
import { useState, useRef } from 'react';
import { Wallet } from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';
import Link from 'next/link';

export default function SubmitWorkPage() {
  const { isConnected } = useAccount();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionType, setSubmissionType] = useState<'file' | 'url'>('file');
  const [formData, setFormData] = useState({
    bountyId: '',
    description: '',
    submissionUrl: '',
    notes: '',
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return;

    setIsSubmitting(true);

    try {
      // Here you would integrate with your smart contract and file storage
      // For now, we'll just simulate the submission
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Reset form
      setFormData({
        bountyId: '',
        description: '',
        submissionUrl: '',
        notes: '',
      });
      setSelectedFiles([]);

      alert('Work submitted successfully!');
    } catch (error) {
      console.error('Error submitting work:', error);
      alert('Failed to submit work. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.bountyId &&
    formData.description &&
    (submissionType === 'url'
      ? formData.submissionUrl
      : selectedFiles.length > 0);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/bounties"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Bounties
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Submit Your Work
          </h1>
          <p className="text-gray-300 mt-2">
            Upload your completed work and get rewarded for your contribution
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="p-8">
            {/* Wallet Connection */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">
                Connect Your Wallet
              </h3>
              <div className="mb-4">
                <Wallet />
              </div>
              <p className="text-gray-400 text-sm">
                Connect your wallet to submit work and receive payments.
              </p>
            </div>

            {/* Form */}
            {isConnected ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Bounty Selection */}
                <div>
                  <label
                    htmlFor="bountyId"
                    className="block text-sm font-semibold text-white mb-2"
                  >
                    Select Bounty *
                  </label>
                  <select
                    id="bountyId"
                    name="bountyId"
                    value={formData.bountyId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    required
                  >
                    <option value="" className="bg-slate-800">
                      Select a bounty...
                    </option>
                    <option value="1" className="bg-slate-800">
                      Build a React Components Library - 500 USDC
                    </option>
                    <option value="2" className="bg-slate-800">
                      Smart Contract Security Audit - 1000 USDC
                    </option>
                    <option value="3" className="bg-slate-800">
                      Mobile App UI/UX Design - 750 USDC
                    </option>
                    <option value="4" className="bg-slate-800">
                      API Integration & Documentation - 300 USDC
                    </option>
                  </select>
                </div>

                {/* Work Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-white mb-2"
                  >
                    Work Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe what you've completed, how you approached the task, and any key features or improvements you've made"
                    rows={5}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                    required
                  />
                </div>

                {/* Submission Type Toggle */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Submission Type *
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setSubmissionType('file')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        submissionType === 'file'
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      File Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubmissionType('url')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        submissionType === 'url'
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      URL/Link
                    </button>
                  </div>
                </div>

                {/* File Upload or URL Input */}
                {submissionType === 'file' ? (
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Upload Files *
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-8 border-2 border-dashed border-white/30 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg
                            className="w-6 h-6 text-purple-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </div>
                        <p className="text-white font-medium mb-2">
                          Click to upload files
                        </p>
                        <p className="text-gray-400 text-sm">
                          Support for images, documents, code files, and more
                        </p>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.zip,.rar,.js,.ts,.tsx,.jsx,.html,.css,.py,.java,.cpp,.c"
                    />

                    {/* Selected Files */}
                    {selectedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-semibold text-white">
                          Selected Files:
                        </p>
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-white/10 rounded-lg p-3"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <svg
                                  className="w-4 h-4 text-blue-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">
                                  {file.name}
                                </p>
                                <p className="text-gray-400 text-xs">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="submissionUrl"
                      className="block text-sm font-semibold text-white mb-2"
                    >
                      Submission URL *
                    </label>
                    <input
                      type="url"
                      id="submissionUrl"
                      name="submissionUrl"
                      value={formData.submissionUrl}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username/repo or https://your-demo-site.com"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      required
                    />
                    <p className="text-gray-400 text-sm mt-2">
                      Provide a link to your GitHub repository, live demo, or
                      hosted solution
                    </p>
                  </div>
                )}

                {/* Additional Notes */}
                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-semibold text-white mb-2"
                  >
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any additional information, setup instructions, or special considerations"
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                  />
                </div>

                {/* Submission Notice */}
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-500 rounded-full p-2 flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-green-300 font-semibold mb-2">
                        Submission Guidelines
                      </h3>
                      <ul className="text-green-100 text-sm space-y-1">
                        <li>
                          • Ensure your work meets all the bounty requirements
                        </li>
                        <li>
                          • Include clear documentation and setup instructions
                        </li>
                        <li>
                          • Your submission will be reviewed by the bounty
                          poster
                        </li>
                        <li>
                          • Upon approval, you&apos;ll receive the full reward +
                          commitment fee refund
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between pt-6">
                  <div className="text-sm text-gray-400">* Required fields</div>
                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting Work...
                      </div>
                    ) : (
                      'Submit Work'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Wallet Required
                </h3>
                <p className="text-gray-400">
                  Please connect your wallet to submit your work.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
