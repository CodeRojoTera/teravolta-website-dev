'use client';

export default function IconCircleExamples() {
    return (
        <div className="min-h-screen bg-[#EFF8FB] p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-[#004A90] mb-4">Icon Style Guide - Circles with Brand Colors</h1>
                <p className="text-lg text-gray-700 mb-8">All icons in solid color circles using only TeraVolta brand colors</p>

                {/* Reference from uploaded image */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-[#004A90] mb-4">📐 Your Reference Style</h2>
                    <p className="text-sm text-gray-600 mb-4">Icons must appear in solid color circles like this:</p>
                    <img src="/C:/Users/agust/.gemini/antigravity/brain/db15180c-20d8-453f-a250-953259167e44/uploaded_image_1767085958006.png" alt="Reference icon style" className="mb-4" />
                    <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
                        <p className="text-sm font-medium text-yellow-900">✅ Approved Colors for Circles:</p>
                        <div className="flex gap-4 mt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#194271' }}></div>
                                <code className="text-xs">#194271 (dark blue)</code>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#c3d021' }}></div>
                                <code className="text-xs">#c3d021 (green)</code>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Size Examples */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-[#004A90] mb-4">📏 Circle Sizes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Large */}
                        <div className="text-center">
                            <p className="font-bold text-[#004A90] mb-3">Large (80px)</p>
                            <div className="flex justify-center gap-4 mb-2">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#194271' }}>
                                    <i className="ri-information-line text-white text-3xl"></i>
                                </div>
                                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#c3d021' }}>
                                    <i className="ri-send-plane-line text-white text-3xl"></i>
                                </div>
                            </div>
                            <code className="text-xs text-gray-600">80px circle, text-3xl icon</code>
                        </div>

                        {/* Medium */}
                        <div className="text-center">
                            <p className="font-bold text-[#004A90] mb-3">Medium (64px)</p>
                            <div className="flex justify-center gap-4 mb-2">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#194271' }}>
                                    <i className="ri-coins-line text-white text-2xl"></i>
                                </div>
                                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#c3d021' }}>
                                    <i className="ri-calendar-event-line text-white text-2xl"></i>
                                </div>
                            </div>
                            <code className="text-xs text-gray-600">64px circle, text-2xl icon</code>
                        </div>

                        {/* Small */}
                        <div className="text-center">
                            <p className="font-bold text-[#004A90] mb-3">Small (48px)</p>
                            <div className="flex justify-center gap-4 mb-2">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#194271' }}>
                                    <i className="ri-phone-line text-white text-xl"></i>
                                </div>
                                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#c3d021' }}>
                                    <i className="ri-information-line text-white text-xl"></i>
                                </div>
                            </div>
                            <code className="text-xs text-gray-600">48px circle, text-xl icon</code>
                        </div>
                    </div>
                </div>

                {/* All Recommended Icons in Circles */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-[#004A90] mb-4">✅ All Recommended Icons with Circles</h2>

                    {/* Information Icon */}
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <h3 className="font-bold text-lg text-[#004A90] mb-3">1. Information Icon (Question/Help & Alerts)</h3>
                        <div className="flex flex-wrap gap-6 items-center">
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: '#194271' }}>
                                    <i className="ri-information-line text-white text-3xl"></i>
                                </div>
                                <code className="text-xs">Blue Circle</code>
                            </div>
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: '#c3d021' }}>
                                    <i className="ri-information-line text-white text-3xl"></i>
                                </div>
                                <code className="text-xs">Green Circle</code>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-700"><strong>Usage:</strong> Help sections, alerts, informational messages</p>
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">ri-information-line</code>
                            </div>
                        </div>
                    </div>

                    {/* Send Plane Icon */}
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <h3 className="font-bold text-lg text-[#004A90] mb-3">2. Send Plane Icon (Launch/Start)</h3>
                        <div className="flex flex-wrap gap-6 items-center">
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: '#194271' }}>
                                    <i className="ri-send-plane-line text-white text-3xl"></i>
                                </div>
                                <code className="text-xs">Blue Circle</code>
                            </div>
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: '#c3d021' }}>
                                    <i className="ri-send-plane-line text-white text-3xl"></i>
                                </div>
                                <code className="text-xs">Green Circle</code>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-700"><strong>Usage:</strong> "Start Now", "Get Started", action buttons</p>
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">ri-send-plane-line</code>
                            </div>
                        </div>
                    </div>

                    {/* Coins Icon */}
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <h3 className="font-bold text-lg text-[#004A90] mb-3">3. Coins Icon (Money/Savings)</h3>
                        <div className="flex flex-wrap gap-6 items-center">
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: '#194271' }}>
                                    <i className="ri-coins-line text-white text-3xl"></i>
                                </div>
                                <code className="text-xs">Blue Circle</code>
                            </div>
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: '#c3d021' }}>
                                    <i className="ri-coins-line text-white text-3xl"></i>
                                </div>
                                <code className="text-xs">Green Circle</code>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-700"><strong>Usage:</strong> Savings displays, pricing, financial benefits</p>
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">ri-coins-line</code>
                            </div>
                        </div>
                    </div>

                    {/* Calendar Icon */}
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <h3 className="font-bold text-lg text-[#004A90] mb-3">4. Calendar Event Icon (Dates/Timeline)</h3>
                        <div className="flex flex-wrap gap-6 items-center">
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: '#194271' }}>
                                    <i className="ri-calendar-event-line text-white text-3xl"></i>
                                </div>
                                <code className="text-xs">Blue Circle</code>
                            </div>
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: '#c3d021' }}>
                                    <i className="ri-calendar-event-line text-white text-3xl"></i>
                                </div>
                                <code className="text-xs">Green Circle</code>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-700"><strong>Usage:</strong> Annual savings, timelines, scheduling</p>
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">ri-calendar-event-line</code>
                            </div>
                        </div>
                    </div>

                    {/* Phone Icon */}
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <h3 className="font-bold text-lg text-[#004A90] mb-3">5. Phone Icon (Contact)</h3>
                        <div className="flex flex-wrap gap-6 items-center">
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: '#194271' }}>
                                    <i className="ri-phone-line text-white text-3xl"></i>
                                </div>
                                <code className="text-xs">Blue Circle</code>
                            </div>
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: '#c3d021' }}>
                                    <i className="ri-phone-line text-white text-3xl"></i>
                                </div>
                                <code className="text-xs">Green Circle</code>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-700"><strong>Usage:</strong> Contact information, call-to-action</p>
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">ri-phone-line</code>
                            </div>
                        </div>
                    </div>

                    {/* Eye Icons */}
                    <div className="pb-6 mb-6">
                        <h3 className="font-bold text-lg text-[#004A90] mb-3">6. Eye Icons (Visibility Toggle)</h3>
                        <div className="flex flex-wrap gap-6 items-center">
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: '#194271' }}>
                                    <i className="ri-eye-line text-white text-3xl"></i>
                                </div>
                                <code className="text-xs">Eye (visible)</code>
                            </div>
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: '#c3d021' }}>
                                    <i className="ri-eye-off-line text-white text-3xl"></i>
                                </div>
                                <code className="text-xs">Eye Off (hidden)</code>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-700"><strong>Usage:</strong> Password visibility toggle, show/hide features</p>
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">ri-eye-line / ri-eye-off-line</code>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alternating Pattern Example */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-[#004A90] mb-4">🎨 Alternating Color Pattern</h2>
                    <p className="text-sm text-gray-600 mb-4">When displaying multiple icons together, alternate between brand colors:</p>

                    <div className="flex flex-wrap justify-center gap-6 p-8 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#194271' }}>
                            <i className="ri-information-line text-white text-2xl"></i>
                        </div>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#c3d021' }}>
                            <i className="ri-send-plane-line text-white text-2xl"></i>
                        </div>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#194271' }}>
                            <i className="ri-coins-line text-white text-2xl"></i>
                        </div>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#c3d021' }}>
                            <i className="ri-calendar-event-line text-white text-2xl"></i>
                        </div>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#194271' }}>
                            <i className="ri-phone-line text-white text-2xl"></i>
                        </div>
                    </div>
                </div>

                {/* Code Examples */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-[#004A90] mb-4">💻 Code Examples</h2>

                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4">
                        <p className="text-xs text-gray-400 mb-2">Blue Circle (Dark Blue):</p>
                        <code className="text-sm">
                            {`<div className="w-20 h-20 rounded-full flex items-center justify-center" 
     style={{backgroundColor: '#194271'}}>
  <i className="ri-information-line text-white text-3xl"></i>
</div>`}
                        </code>
                    </div>

                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                        <p className="text-xs text-gray-400 mb-2">Green Circle (Lime Green):</p>
                        <code className="text-sm">
                            {`<div className="w-16 h-16 rounded-full flex items-center justify-center" 
     style={{backgroundColor: '#c3d021'}}>
  <i className="ri-send-plane-line text-white text-2xl"></i>
</div>`}
                        </code>
                    </div>
                </div>

                {/* Rules */}
                <div className="bg-gradient-to-r from-[#194271] to-[#004A90] rounded-xl p-8 mt-8 text-white">
                    <h3 className="text-2xl font-bold mb-4">📋 Icon Circle Rules</h3>
                    <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="text-[#c3d021] font-bold">✓</span>
                            <span>All icons MUST be inside solid color circles</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#c3d021] font-bold">✓</span>
                            <span>Circle colors: ONLY #194271 (dark blue) or #c3d021 (green)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#c3d021] font-bold">✓</span>
                            <span>Icon color inside circle: Always white (#ffffff)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#c3d021] font-bold">✓</span>
                            <span>Use outline (-line) icon variants only</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#c3d021] font-bold">✓</span>
                            <span>Alternate colors when showing multiple icons together</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
