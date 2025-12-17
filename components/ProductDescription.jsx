
'use client'
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const ProductDescription = ({ product }) => {
  const [selectedTab, setSelectedTab] = useState('Specifications')
  const [selectedSubTab, setSelectedSubTab] = useState('Technical Specifications')
  const [openSection, setOpenSection] = useState(null)

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section)
  }

  const subTabs = [
    'Technical Specifications',
    'Materials',
    'Operating Conditions',
    'Applications',

  ]

  // Extract applications from specificationGroups
  const getApplications = () => {
    if (!product || !product.specificationGroups || !Array.isArray(product.specificationGroups)) {
      return null;
    }

    // Find the Applications group
    const applicationsGroup = product.specificationGroups.find(
      group => group.groupLabel && 
      (group.groupLabel.toLowerCase().includes('application') || 
       group.groupLabel.toLowerCase() === 'applications')
    );

    if (!applicationsGroup || !applicationsGroup.specifications) {
      return null;
    }

    const specs = applicationsGroup.specifications;
    
    // Handle both array and object formats
    if (Array.isArray(specs)) {
      return specs;
    } else if (typeof specs === 'object') {
      // Convert object to array format
      return Object.entries(specs).map(([key, value]) => ({
        label: key,
        value: value
      }));
    }

    return null;
  };

  const applications = getApplications();

  return (
    <div className="my-12 text-sm text-slate-700 w-full overflow-x-hidden max-w-7xl mx-auto px-4">
      {/* -------- Specifications -------- */}
      {selectedTab === 'Specifications' && (
        <div className="w-full">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8 text-left">
            Specifications
          </h2>

          {/* --- Desktop Tabs --- */}
          <div className="hidden md:flex flex-wrap border-b border-slate-300 mb-6 w-full">
            {subTabs.map((subTab) => (
              <button
                key={subTab}
                onClick={() => setSelectedSubTab(subTab)}
                className={`px-6 py-3 text-sm font-medium transition-colors 
                  ${subTab === selectedSubTab
                    ? 'border-b-2 border-[#c31e5a] text-[#c31e5a]'
                    : 'text-slate-500 hover:text-[#c31e5a]'
                  }`}
              >
                {subTab}
              </button>
            ))}
          </div>

          {/* --- Desktop Content --- */}
          <div className="hidden md:block mt-6 w-full">
            {selectedSubTab === 'Applications' && (
              <div>
                <h3 className="text-lg font-semibold text-[#c31e5a] mb-3 uppercase">Applications</h3>
                {applications && applications.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border border-slate-200 text-sm md:text-base">
                      <tbody>
                        {applications.map((app, index) => {
                          const label = app.label || app.attributeName || app.name || '';
                          const value = app.value || app.attributeValue || app.description || '';
                          return (
                            <tr 
                              key={index}
                              className={index % 2 === 0 ? 'border-b border-slate-200 bg-gray-50' : 'border-b border-slate-200'}
                            >
                              <td className="font-semibold p-3 w-1/3 align-top">{label}</td>
                              <td className="p-3 align-top">{value}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No applications information available</p>
                )}
              </div>
            )}

            {selectedSubTab === 'Materials' && (
              <div>
                <h3 className="text-lg font-semibold text-[#c31e5a] mb-3 uppercase">Materials</h3>
                <table className="w-full border border-slate-200 text-sm md:text-base">
                  <tbody>
                    <tr className="border-b border-slate-200 bg-gray-50">
                      <td className="font-semibold p-2 w-1/3">Impeller</td>
                      <td className="p-2">Forged brass</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="font-semibold p-2">Pump casing & flanges</td>
                      <td className="p-2">Cast iron – IS 210 grade FG 200</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-gray-50">
                      <td className="font-semibold p-2">Motor body</td>
                      <td className="p-2">Aluminium / Cast iron</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="font-semibold p-2">Shaft</td>
                      <td className="p-2">SS 410 / EN–8</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-gray-50">
                      <td className="font-semibold p-2">Mechanical seal</td>
                      <td className="p-2">Carbon ceramic</td>
                    </tr>
                    <tr>
                      <td className="font-semibold p-2">Bearing</td>
                      <td className="p-2">Double shielded ball bearing</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {selectedSubTab === 'Operating Conditions' && (
              <div>
                <h3 className="text-lg font-semibold text-[#c31e5a] mb-3 uppercase">Operating Conditions</h3>
                <table className="w-full border border-slate-200 text-sm md:text-base">
                  <tbody>
                    <tr className="border-b border-slate-200 bg-gray-50">
                      <td className="font-semibold p-2 w-1/3">Suction lift</td>
                      <td className="p-2">Up to 8 metres</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="font-semibold p-2">Max liquid temperature</td>
                      <td className="p-2">50°C</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-gray-50">
                      <td className="font-semibold p-2">Max ambient temperature</td>
                      <td className="p-2">40°C</td>
                    </tr>
                    <tr>
                      <td className="font-semibold p-2">Max operating pressure</td>
                      <td className="p-2">8 bar</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {selectedSubTab === 'Technical Specifications' && (
              <div>
                <h3 className="text-lg font-semibold text-[#c31e5a] mb-3 uppercase">
                  Technical Specifications
                </h3>
                <table className="w-full border border-slate-200 text-sm md:text-base mb-6">
                  <tbody>
                    <tr className="border-b border-slate-200 bg-gray-50">
                      <td className="font-semibold p-2 w-1/3">Power Range</td>
                      <td className="p-2">0.75 kW – 1.5 kW (1HP–2HP)</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="font-semibold p-2">Version</td>
                      <td className="p-2">Single-phase, 220V, 50Hz, AC supply</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-gray-50">
                      <td className="font-semibold p-2">Maximum Total Head</td>
                      <td className="p-2">214 Metre</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="font-semibold p-2">Maximum Flow Rate</td>
                      <td className="p-2">0.9 lps (3.4 m³/h)</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-gray-50">
                      <td className="font-semibold p-2">Speed</td>
                      <td className="p-2">2900 RPM</td>
                    </tr>
                    <tr>
                      <td className="font-semibold p-2">Insulation</td>
                      <td className="p-2">Class B/F</td>
                    </tr>
                  </tbody>
                </table>
                
                {/* Benefits Section */}
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="text-base font-semibold text-slate-900 mb-4">Benefits</h4>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-gray-700 text-sm">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500 flex-shrink-0">
                        <path d="M8 0L10.163 5.382L16 6.182L12 10.118L12.944 16L8 13.382L3.056 16L4 10.118L0 6.182L5.837 5.382L8 0Z" fill="currentColor"/>
                      </svg>
                      <span>Free shipping worldwide</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700 text-sm">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500 flex-shrink-0">
                        <path d="M8 0L10.163 5.382L16 6.182L12 10.118L12.944 16L8 13.382L3.056 16L4 10.118L0 6.182L5.837 5.382L8 0Z" fill="currentColor"/>
                      </svg>
                      <span>100% Secured Payment</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700 text-sm">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500 flex-shrink-0">
                        <path d="M8 0L10.163 5.382L16 6.182L12 10.118L12.944 16L8 13.382L3.056 16L4 10.118L0 6.182L5.837 5.382L8 0Z" fill="currentColor"/>
                      </svg>
                      <span>Trusted by top brands</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* --- Mobile Collapsible Sections --- */}
          <div className="block md:hidden space-y-6 w-full">
            {subTabs.map((subTab) => (
              <div key={subTab} className="border border-slate-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(subTab)}
                  className="flex justify-between items-center w-full px-4 py-3 
                             text-left font-medium text-slate-800 bg-gray-50 hover:bg-gray-100"
                >
                  {subTab}
                  {openSection === subTab ? (
                    <ChevronUp className="text-[#c31e5a]" />
                  ) : (
                    <ChevronDown className="text-[#c31e5a]" />
                  )}
                </button>
                {openSection === subTab && (
                  <div className="border-t border-slate-200 bg-white overflow-x-auto">
                    {subTab === 'Applications' && (
                      <div>
                        {applications && applications.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full border border-slate-200 text-sm">
                              <tbody>
                                {applications.map((app, index) => {
                                  const label = app.label || app.attributeName || app.name || '';
                                  const value = app.value || app.attributeValue || app.description || '';
                                  return (
                                    <tr 
                                      key={index}
                                      className={index % 2 === 0 ? 'border-b bg-gray-50' : 'border-b'}
                                    >
                                      <td className="font-semibold p-2 w-1/3 align-top">{label}</td>
                                      <td className="p-2 align-top">{value}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="p-4">
                            <p className="text-slate-500 italic text-sm">No applications information available</p>
                          </div>
                        )}
                      </div>
                    )}
                    {subTab === 'Materials' && (
                      <table className="w-full border border-slate-200 text-sm">
                        <tbody>
                          <tr className="border-b bg-gray-50">
                            <td className="font-semibold p-2 w-1/3">Impeller</td>
                            <td className="p-2">Forged brass</td>
                          </tr>
                          <tr className="border-b">
                            <td className="font-semibold p-2">Pump casing & flanges</td>
                            <td className="p-2">Cast iron – IS 210 grade FG 200</td>
                          </tr>
                          <tr className="border-b bg-gray-50">
                            <td className="font-semibold p-2">Motor body</td>
                            <td className="p-2">Aluminium / Cast iron</td>
                          </tr>
                          <tr className="border-b">
                            <td className="font-semibold p-2">Shaft</td>
                            <td className="p-2">SS 410 / EN–8</td>
                          </tr>
                          <tr className="border-b bg-gray-50">
                            <td className="font-semibold p-2">Mechanical seal</td>
                            <td className="p-2">Carbon ceramic</td>
                          </tr>
                          <tr>
                            <td className="font-semibold p-2">Bearing</td>
                            <td className="p-2">Double shielded ball bearing</td>
                          </tr>
                        </tbody>
                      </table>
                    )}

                    {subTab === 'Operating Conditions' && (
                      <table className="w-full border border-slate-200 text-sm">
                        <tbody>
                          <tr className="border-b bg-gray-50">
                            <td className="font-semibold p-2 w-1/3">Suction lift</td>
                            <td className="p-2">Up to 8 metres</td>
                          </tr>
                          <tr className="border-b">
                            <td className="font-semibold p-2">Max liquid temperature</td>
                            <td className="p-2">50°C</td>
                          </tr>
                          <tr className="border-b bg-gray-50">
                            <td className="font-semibold p-2">Max ambient temperature</td>
                            <td className="p-2">40°C</td>
                          </tr>
                          <tr>
                            <td className="font-semibold p-2">Max operating pressure</td>
                            <td className="p-2">8 bar</td>
                          </tr>
                        </tbody>
                      </table>
                    )}

                    {subTab === 'Technical Specifications' && (
                      <div>
                        <table className="w-full border border-slate-200 text-sm mb-4">
                          <tbody>
                            <tr className="border-b bg-gray-50">
                              <td className="font-semibold p-2 w-1/3">Power Range</td>
                              <td className="p-2">0.75 kW – 1.5 kW (1HP–2HP)</td>
                            </tr>
                            <tr className="border-b">
                              <td className="font-semibold p-2">Version</td>
                              <td className="p-2">Single-phase, 220V, 50Hz, AC supply</td>
                            </tr>
                            <tr className="border-b bg-gray-50">
                              <td className="font-semibold p-2">Maximum Total Head</td>
                              <td className="p-2">214 Metre</td>
                            </tr>
                            <tr className="border-b">
                              <td className="font-semibold p-2">Maximum Flow Rate</td>
                              <td className="p-2">0.9 lps (3.4 m³/h)</td>
                            </tr>
                            <tr className="border-b bg-gray-50">
                              <td className="font-semibold p-2">Speed</td>
                              <td className="p-2">2900 RPM</td>
                            </tr>
                            <tr>
                              <td className="font-semibold p-2">Insulation</td>
                              <td className="p-2">Class B/F</td>
                            </tr>
                          </tbody>
                        </table>
                        
                        {/* Benefits Section */}
                        <div className="border-t border-slate-200 pt-4 px-2">
                          <h4 className="text-sm font-semibold text-slate-900 mb-3">Benefits</h4>
                          <div className="flex flex-col gap-2.5">
                            <div className="flex items-center gap-2.5 text-gray-700 text-xs">
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500 flex-shrink-0">
                                <path d="M8 0L10.163 5.382L16 6.182L12 10.118L12.944 16L8 13.382L3.056 16L4 10.118L0 6.182L5.837 5.382L8 0Z" fill="currentColor"/>
                              </svg>
                              <span>Free shipping worldwide</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-gray-700 text-xs">
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500 flex-shrink-0">
                                <path d="M8 0L10.163 5.382L16 6.182L12 10.118L12.944 16L8 13.382L3.056 16L4 10.118L0 6.182L5.837 5.382L8 0Z" fill="currentColor"/>
                              </svg>
                              <span>100% Secured Payment</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-gray-700 text-xs">
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500 flex-shrink-0">
                                <path d="M8 0L10.163 5.382L16 6.182L12 10.118L12.944 16L8 13.382L3.056 16L4 10.118L0 6.182L5.837 5.382L8 0Z" fill="currentColor"/>
                              </svg>
                              <span>Trusted by top brands</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}


    </div>
  )
}

export default ProductDescription
