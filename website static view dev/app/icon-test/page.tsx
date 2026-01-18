'use client';

export default function IconTest() {
    return (
        <div className="min-h-screen bg-[#EFF8FB] p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-[#004A90] mb-8">Icon Weight Testing - Remix Icon Variants</h1>

                <div className="bg-white rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-[#004A90] mb-4">Reference: Approved Style (Image 1)</h2>
                    <p className="text-gray-700 mb-4">Compare all icons below with the reference image to find exact match</p>
                    <div className="grid grid-cols-4 gap-6">
                        {/* Reference icons from Image 1 */}
                        <div className="text-center p-4 bg-[#004A90] rounded-lg">
                            <i className="ri-stack-line text-white text-4xl"></i>
                            <p className="text-white mt-2 text-sm">ri-stack-line</p>
                            <p className="text-white/70 text-xs">(Database)</p>
                        </div>
                        <div className="text-center p-4 bg-[#C3D021] rounded-lg">
                            <i className="ri-map-pin-line text-[#004A90] text-4xl"></i>
                            <p className="text-[#004A90] mt-2 text-sm">ri-map-pin-line</p>
                            <p className="text-[#004A90]/70 text-xs">(Location)</p>
                        </div>
                        <div className="text-center p-4 bg-[#004A90] rounded-lg">
                            <i className="ri-cpu-line text-white text-4xl"></i>
                            <p className="text-white mt-2 text-sm">ri-cpu-line</p>
                            <p className="text-white/70 text-xs">(Technology)</p>
                        </div>
                        <div className="text-center p-4 bg-[#C3D021] rounded-lg">
                            <i className="ri-customer-service-2-line text-[#004A90] text-4xl"></i>
                            <p className="text-[#004A90] mt-2 text-sm">ri-customer-service-2-line</p>
                            <p className="text-[#004A90]/70 text-xs">(Support)</p>
                        </div>
                    </div>
                </div>

                {/* Question/Help Icon Variants */}
                <div className="bg-white rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-[#004A90] mb-4">Question/Help Icon Testing</h2>
                    <p className="text-sm text-gray-600 mb-4">Current: ri-question-line (too bold) - Find lighter alternative</p>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-question-line text-[#004A90] text-4xl"></i>
                            <p className="text-xs mt-2">ri-question-line</p>
                            <p className="text-xs text-red-600">❌ Current</p>
                        </div>
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-questionnaire-line text-[#004A90] text-4xl"></i>
                            <p className="text-xs mt-2">ri-questionnaire-line</p>
                        </div>
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-information-line text-[#004A90] text-4xl"></i>
                            <p className="text-xs mt-2">ri-information-line</p>
                        </div>
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-question-answer-line text-[#004A90] text-4xl"></i>
                            <p className="text-xs mt-2">ri-question-answer-line</p>
                        </div>
                    </div>
                </div>

                {/* Rocket/Launch Icon Variants */}
                <div className="bg-white rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-[#004A90] mb-4">Launch/Start Icon Testing</h2>
                    <p className="text-sm text-gray-600 mb-4">Current: ri-rocket-line (too heavy) - Find lighter alternative</p>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-rocket-line text-[#C3D021] text-4xl"></i>
                            <p className="text-xs mt-2">ri-rocket-line</p>
                            <p className="text-xs text-red-600">❌ Current</p>
                        </div>
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-rocket-2-line text-[#C3D021] text-4xl"></i>
                            <p className="text-xs mt-2">ri-rocket-2-line</p>
                        </div>
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-send-plane-line text-[#C3D021] text-4xl"></i>
                            <p className="text-xs mt-2">ri-send-plane-line</p>
                        </div>
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-arrow-right-up-line text-[#C3D021] text-4xl"></i>
                            <p className="text-xs mt-2">ri-arrow-right-up-line</p>
                        </div>
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-play-circle-line text-[#C3D021] text-4xl"></i>
                            <p className="text-xs mt-2">ri-play-circle-line</p>
                        </div>
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-spark-line text-[#C3D021] text-4xl"></i>
                            <p className="text-xs mt-2">ri-spark-line</p>
                        </div>
                    </div>
                </div>

                {/* Money/Financial Icon Variants */}
                <div className="bg-white rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-[#004A90] mb-4">Money/Savings Icon Testing</h2>
                    <p className="text-sm text-gray-600 mb-4">Current: ri-money-dollar-circle-line (circle adds weight) - Find lighter alternative</p>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-money-dollar-circle-line text-[#C3D021] text-4xl"></i>
                            <p className="text-xs mt-2">ri-money-dollar-circle-line</p>
                            <p className="text-xs text-red-600">❌ Current</p>
                        </div>
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-money-dollar-box-line text-[#C3D021] text-4xl"></i>
                            <p className="text-xs mt-2">ri-money-dollar-box-line</p>
                        </div>
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-coins-line text-[#C3D021] text-4xl"></i>
                            <p className="text-xs mt-2">ri-coins-line</p>
                        </div>
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-hand-coin-line text-[#C3D021] text-4xl"></i>
                            <p className="text-xs mt-2">ri-hand-coin-line</p>
                        </div>
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-wallet-line text-[#C3D021] text-4xl"></i>
                            <p className="text-xs mt-2">ri-wallet-line</p>
                        </div>
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-bank-card-line text-[#C3D021] text-4xl"></i>
                            <p className="text-xs mt-2">ri-bank-card-line</p>
                        </div>
                    </div>
                </div>

                {/* Calendar Icon Variants */}
                <div className="bg-white rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-[#004A90] mb-4">Calendar/Time Icon Testing</h2>
                    <p className="text-sm text-gray-600 mb-4">Current: ri-calendar-line - Verify weight matches</p>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-calendar-line text-[#004A90] text-4xl"></i>
                            <p className="text-xs mt-2">ri-calendar-line</p>
                            <p className="text-xs text-red-600">❌ Current</p>
                        </div>
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-calendar-event-line text-[#004A90] text-4xl"></i>
                            <p className="text-xs mt-2">ri-calendar-event-line</p>
                        </div>
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-calendar-2-line text-[#004A90] text-4xl"></i>
                            <p className="text-xs mt-2">ri-calendar-2-line</p>
                        </div>
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-calendar-check-line text-[#004A90] text-4xl"></i>
                            <p className="text-xs mt-2">ri-calendar-check-line</p>
                        </div>
                    </div>
                </div>

                {/* Warning/Alert Icon Variants */}
                <div className="bg-white rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-[#004A90] mb-4">Warning/Alert Icon Testing</h2>
                    <p className="text-sm text-gray-600 mb-4">Current: ri-error-warning-line - Verify weight matches</p>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-error-warning-line text-[#004A90] text-4xl"></i>
                            <p className="text-xs mt-2">ri-error-warning-line</p>
                            <p className="text-xs text-red-600">❌ Current</p>
                        </div>
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-alert-line text-[#004A90] text-4xl"></i>
                            <p className="text-xs mt-2">ri-alert-line</p>
                        </div>
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-information-line text-[#004A90] text-4xl"></i>
                            <p className="text-xs mt-2">ri-information-line</p>
                        </div>
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-alarm-warning-line text-[#004A90] text-4xl"></i>
                            <p className="text-xs mt-2">ri-alarm-warning-line</p>
                        </div>
                    </div>
                </div>

                {/* Eye Icon Variants */}
                <div className="bg-white rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-[#004A90] mb-4">Visibility Icon Testing</h2>
                    <p className="text-sm text-gray-600 mb-4">Current: ri-eye-off-line - Verify weight matches</p>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-eye-off-line text-[#004A90] text-4xl"></i>
                            <p className="text-xs mt-2">ri-eye-off-line</p>
                            <p className="text-xs text-red-600">❌ Current</p>
                        </div>
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-eye-close-line text-[#004A90] text-4xl"></i>
                            <p className="text-xs mt-2">ri-eye-close-line</p>
                        </div>
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
                            <i className="ri-eye-line text-[#004A90] text-4xl"></i>
                            <p className="text-xs mt-2">ri-eye-line</p>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6">
                    <h3 className="font-bold text-yellow-900 mb-2">📋 Testing Instructions</h3>
                    <ol className="text-sm text-yellow-900 space-y-1">
                        <li>1. Compare each icon variant with the reference icons at the top</li>
                        <li>2. Look for matching stroke weight, proportions, and refinement level</li>
                        <li>3. Note which alternatives match the approved style from Image 1</li>
                        <li>4. Icons marked with ❌ are the current (non-compliant) versions</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
