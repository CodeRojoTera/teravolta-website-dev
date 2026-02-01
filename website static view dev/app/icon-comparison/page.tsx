'use client';

export default function IconComparison() {
    return (
        <div className="min-h-screen bg-[#EFF8FB] p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-[#004A90] mb-4">Icon Recommendations - Visual Comparison</h1>
                <p className="text-lg text-gray-700 mb-8">Current (❌) vs Recommended (✅) - Compare stroke weight with reference icons</p>

                {/* Reference Section */}
                <div className="bg-gradient-to-r from-[#004A90] to-[#194271] rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">📐 Reference: Approved Style (Image 1)</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                            <i className="ri-stack-line text-white text-5xl mb-2"></i>
                            <p className="text-white text-sm font-medium">Database</p>
                            <p className="text-white/70 text-xs">Thin stroke</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                            <i className="ri-map-pin-line text-[#C3D021] text-5xl mb-2"></i>
                            <p className="text-white text-sm font-medium">Location</p>
                            <p className="text-white/70 text-xs">Simple geometry</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                            <i className="ri-cpu-line text-white text-5xl mb-2"></i>
                            <p className="text-white text-sm font-medium">CPU</p>
                            <p className="text-white/70 text-xs">Refined</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                            <i className="ri-customer-service-2-line text-[#C3D021] text-5xl mb-2"></i>
                            <p className="text-white text-sm font-medium">Support</p>
                            <p className="text-white/70 text-xs">Lightweight</p>
                        </div>
                    </div>
                </div>

                {/* Comparison Items */}

                {/* 1. Question/Help Icon */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-[#004A90] mb-4">1. Question/Help Icon</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Current */}
                        <div className="border-4 border-red-500 rounded-xl p-6 bg-red-50">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xl font-bold text-red-700">❌ Current</span>
                                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">Too Bold</span>
                            </div>
                            <div className="bg-white rounded-lg p-8 flex flex-col items-center">
                                <div className="w-20 h-20 flex items-center justify-center bg-[#004A90]/10 rounded-full mb-4">
                                    <i className="ri-question-line text-[#004A90] text-5xl"></i>
                                </div>
                                <code className="text-sm bg-gray-100 px-3 py-1 rounded">ri-question-line</code>
                                <p className="text-xs text-gray-600 mt-2 text-center">Circle container adds weight<br />Stroke too thick</p>
                            </div>
                        </div>

                        {/* Recommended */}
                        <div className="border-4 border-green-500 rounded-xl p-6 bg-green-50">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xl font-bold text-green-700">✅ Recommended</span>
                                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">Perfect Match</span>
                            </div>
                            <div className="bg-white rounded-lg p-8 flex flex-col items-center">
                                <div className="w-20 h-20 flex items-center justify-center bg-[#004A90]/10 rounded-full mb-4">
                                    <i className="ri-information-line text-[#004A90] text-5xl"></i>
                                </div>
                                <code className="text-sm bg-gray-100 px-3 py-1 rounded">ri-information-line</code>
                                <p className="text-xs text-gray-600 mt-2 text-center">Thin stroke like reference<br />Simple, refined</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Launch/Start Icon */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-[#004A90] mb-4">2. Launch/Start Icon</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Current */}
                        <div className="border-4 border-red-500 rounded-xl p-6 bg-red-50">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xl font-bold text-red-700">❌ Current</span>
                                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">Too Complex</span>
                            </div>
                            <div className="bg-white rounded-lg p-8 flex flex-col items-center">
                                <div className="w-20 h-20 flex items-center justify-center bg-[#C3D021]/10 rounded-full mb-4">
                                    <i className="ri-rocket-line text-[#C3D021] text-5xl"></i>
                                </div>
                                <code className="text-sm bg-gray-100 px-3 py-1 rounded">ri-rocket-line</code>
                                <p className="text-xs text-gray-600 mt-2 text-center">Multiple details (fins, window)<br />Visual weight too high</p>
                            </div>
                        </div>

                        {/* Recommended */}
                        <div className="border-4 border-green-500 rounded-xl p-6 bg-green-50">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xl font-bold text-green-700">✅ Recommended</span>
                                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">Refined</span>
                            </div>
                            <div className="bg-white rounded-lg p-8 flex flex-col items-center">
                                <div className="w-20 h-20 flex items-center justify-center bg-[#C3D021]/10 rounded-full mb-4">
                                    <i className="ri-send-plane-line text-[#C3D021] text-5xl"></i>
                                </div>
                                <code className="text-sm bg-gray-100 px-3 py-1 rounded">ri-send-plane-line</code>
                                <p className="text-xs text-gray-600 mt-2 text-center">Clean lines, thin stroke<br />Conveys motion/launch</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Money/Savings Icon */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-[#004A90] mb-4">3. Money/Savings Icon</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Current */}
                        <div className="border-4 border-red-500 rounded-xl p-6 bg-red-50">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xl font-bold text-red-700">❌ Current</span>
                                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">Double Stroke</span>
                            </div>
                            <div className="bg-white rounded-lg p-8 flex flex-col items-center">
                                <div className="w-20 h-20 flex items-center justify-center bg-[#C3D021]/10 rounded-full mb-4">
                                    <i className="ri-money-dollar-circle-line text-[#C3D021] text-5xl"></i>
                                </div>
                                <code className="text-sm bg-gray-100 px-3 py-1 rounded">ri-money-dollar-circle-line</code>
                                <p className="text-xs text-gray-600 mt-2 text-center">Circle border adds weight<br />Dollar + circle = busy</p>
                            </div>
                        </div>

                        {/* Recommended */}
                        <div className="border-4 border-green-500 rounded-xl p-6 bg-green-50">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xl font-bold text-green-700">✅ Recommended</span>
                                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">Lightweight</span>
                            </div>
                            <div className="bg-white rounded-lg p-8 flex flex-col items-center">
                                <div className="w-20 h-20 flex items-center justify-center bg-[#C3D021]/10 rounded-full mb-4">
                                    <i className="ri-coins-line text-[#C3D021] text-5xl"></i>
                                </div>
                                <code className="text-sm bg-gray-100 px-3 py-1 rounded">ri-coins-line</code>
                                <p className="text-xs text-gray-600 mt-2 text-center">Thin overlapping circles<br />Clear money symbolism</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Calendar Icon */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-[#004A90] mb-4">4. Calendar/Date Icon</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Current */}
                        <div className="border-4 border-red-500 rounded-xl p-6 bg-red-50">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xl font-bold text-red-700">❌ Current</span>
                                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">Thick Stroke</span>
                            </div>
                            <div className="bg-white rounded-lg p-8 flex flex-col items-center">
                                <div className="w-20 h-20 flex items-center justify-center bg-[#004A90]/10 rounded-full mb-4">
                                    <i className="ri-calendar-line text-[#004A90] text-5xl"></i>
                                </div>
                                <code className="text-sm bg-gray-100 px-3 py-1 rounded">ri-calendar-line</code>
                                <p className="text-xs text-gray-600 mt-2 text-center">Stroke heavier than reference<br />Grid adds density</p>
                            </div>
                        </div>

                        {/* Recommended */}
                        <div className="border-4 border-green-500 rounded-xl p-6 bg-green-50">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xl font-bold text-green-700">✅ Recommended</span>
                                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">Thin & Clean</span>
                            </div>
                            <div className="bg-white rounded-lg p-8 flex flex-col items-center">
                                <div className="w-20 h-20 flex items-center justify-center bg-[#004A90]/10 rounded-full mb-4">
                                    <i className="ri-calendar-event-line text-[#004A90] text-5xl"></i>
                                </div>
                                <code className="text-sm bg-gray-100 px-3 py-1 rounded">ri-calendar-event-line</code>
                                <p className="text-xs text-gray-600 mt-2 text-center">Noticeably thinner stroke<br />Simpler internal structure</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Warning Icon */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-[#004A90] mb-4">5. Warning/Alert Icon</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Current */}
                        <div className="border-4 border-red-500 rounded-xl p-6 bg-red-50">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xl font-bold text-red-700">❌ Current</span>
                                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">Heavy Triangle</span>
                            </div>
                            <div className="bg-white rounded-lg p-8 flex flex-col items-center">
                                <div className="w-20 h-20 flex items-center justify-center bg-[#004A90]/10 rounded-full mb-4">
                                    <i className="ri-error-warning-line text-[#004A90] text-5xl"></i>
                                </div>
                                <code className="text-sm bg-gray-100 px-3 py-1 rounded">ri-error-warning-line</code>
                                <p className="text-xs text-gray-600 mt-2 text-center">Triangle border too bold<br />Exclamation adds weight</p>
                            </div>
                        </div>

                        {/* Recommended */}
                        <div className="border-4 border-green-500 rounded-xl p-6 bg-green-50">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xl font-bold text-green-700">✅ Recommended</span>
                                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">Simple & Clear</span>
                            </div>
                            <div className="bg-white rounded-lg p-8 flex flex-col items-center">
                                <div className="w-20 h-20 flex items-center justify-center bg-[#004A90]/10 rounded-full mb-4">
                                    <i className="ri-information-line text-[#004A90] text-5xl"></i>
                                </div>
                                <code className="text-sm bg-gray-100 px-3 py-1 rounded">ri-information-line</code>
                                <p className="text-xs text-gray-600 mt-2 text-center">Same as question icon<br />Thin, versatile for alerts</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 6. Eye Icon - KEEP CURRENT */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-[#004A90] mb-4">6. Visibility Icon (Password Toggle)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                        <div className="border-4 border-blue-500 rounded-xl p-6 bg-blue-50">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xl font-bold text-blue-700">✅ Keep Current - Already Compliant</span>
                                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">Matches Reference</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-lg p-6 flex flex-col items-center">
                                    <div className="w-16 h-16 flex items-center justify-center bg-[#004A90]/10 rounded-full mb-3">
                                        <i className="ri-eye-line text-[#004A90] text-4xl"></i>
                                    </div>
                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">ri-eye-line</code>
                                    <p className="text-xs text-gray-600 mt-1 text-center">Thin stroke ✅</p>
                                </div>
                                <div className="bg-white rounded-lg p-6 flex flex-col items-center">
                                    <div className="w-16 h-16 flex items-center justify-center bg-[#004A90]/10 rounded-full mb-3">
                                        <i className="ri-eye-off-line text-[#004A90] text-4xl"></i>
                                    </div>
                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">ri-eye-off-line</code>
                                    <p className="text-xs text-gray-600 mt-1 text-center">Slash doesn't add weight ✅</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Banner */}
                <div className="bg-gradient-to-r from-[#C3D021] to-[#a0b01a] rounded-xl p-8 text-center">
                    <h3 className="text-3xl font-bold text-[#004A90] mb-3">Summary: 5 Icons to Replace</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                        <div className="bg-white/90 rounded-lg p-3">
                            <i className="ri-information-line text-[#004A90] text-3xl mb-1"></i>
                            <p className="text-xs font-medium text-[#004A90]">Information</p>
                        </div>
                        <div className="bg-white/90 rounded-lg p-3">
                            <i className="ri-send-plane-line text-[#004A90] text-3xl mb-1"></i>
                            <p className="text-xs font-medium text-[#004A90]">Send Plane</p>
                        </div>
                        <div className="bg-white/90 rounded-lg p-3">
                            <i className="ri-coins-line text-[#004A90] text-3xl mb-1"></i>
                            <p className="text-xs font-medium text-[#004A90]">Coins</p>
                        </div>
                        <div className="bg-white/90 rounded-lg p-3">
                            <i className="ri-calendar-event-line text-[#004A90] text-3xl mb-1"></i>
                            <p className="text-xs font-medium text-[#004A90]">Calendar Event</p>
                        </div>
                        <div className="bg-white/90 rounded-lg p-3">
                            <i className="ri-information-line text-[#004A90] text-3xl mb-1"></i>
                            <p className="text-xs font-medium text-[#004A90]">Information</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
