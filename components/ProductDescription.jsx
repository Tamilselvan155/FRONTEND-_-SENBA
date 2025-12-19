
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

  // Helper function to extract specifications from a group by label
  const getSpecificationsByGroup = (groupLabel) => {
    if (!product || !product.specificationGroups || !Array.isArray(product.specificationGroups)) {
      return null;
    }

    // Find the group by label (case-insensitive, partial match)
    const group = product.specificationGroups.find(
      g => g.groupLabel && 
      g.groupLabel.toLowerCase().includes(groupLabel.toLowerCase())
    );

    if (!group || !group.specifications) {
      return null;
    }

    const specs = group.specifications;
    let specsArray = [];

    // Handle both array and object formats
    if (Array.isArray(specs)) {
      specsArray = specs;
    } else if (typeof specs === 'object') {
      // Convert object to array format
      specsArray = Object.entries(specs).map(([key, value]) => ({
        label: key,
        value: value
      }));
    } else {
      return null;
    }

    // Process and clean up the specifications
    const processedSpecs = specsArray.map((spec) => {
      const label = (spec.label || spec.attributeName || spec.name || spec.featureName || '').toString().trim();
      const value = (spec.value || spec.attributeValue || spec.description || spec.featureValue || '').toString().trim();
      return { label, value };
    }).filter(spec => spec.label && spec.value); // Filter out empty entries

    return processedSpecs.length > 0 ? processedSpecs : null;
  };

  // Extract applications from specificationGroups (with duplicate removal)
  const getApplications = () => {
    const specs = getSpecificationsByGroup('application');
    if (!specs) return null;

    // Remove duplicates based on label and value combination
    const seen = new Set();
    const seenValues = new Set();
    const uniqueApplications = specs.filter((app) => {
      const label = app.label.toLowerCase();
      const value = app.value.toLowerCase();
      
      // Skip empty values
      if (!value || value === '') {
        return false;
      }
      
      // Create keys for checking duplicates
      const labelValueKey = `${label}|${value}`;
      
      // Check if we've seen this exact combination
      if (seen.has(labelValueKey)) {
        return false; // Duplicate found, filter it out
      }
      
      // Also check if the value itself is a duplicate (even with different labels)
      if (seenValues.has(value)) {
        return false; // Same value already seen, filter it out
      }
      
      // Mark as seen
      seen.add(labelValueKey);
      seenValues.add(value);
      return true; // Keep this application
    });

    return uniqueApplications.length > 0 ? uniqueApplications : null;
  };

  const applications = getApplications();
  const technicalSpecs = getSpecificationsByGroup('technical');
  const materials = getSpecificationsByGroup('material');
  const operatingConditions = getSpecificationsByGroup('operating');

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
                  <div className="space-y-2">
                    {applications.map((app, index) => {
                      const label = (app.label || app.attributeName || app.name || '').toString().trim();
                      const value = (app.value || app.attributeValue || app.description || '').toString().trim();
                      // Only show value if it exists, skip if empty or duplicate
                      if (!value) return null;
                      return (
                        <div 
                          key={`app-${index}-${value.substring(0, 20)}`}
                          className="p-3 border border-slate-200 rounded bg-white"
                        >
                          {label && label !== value && (
                            <p className="font-semibold text-slate-900 mb-1 text-sm">{label}:</p>
                          )}
                          <p className="text-slate-700 text-sm md:text-base">{value}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No applications information available</p>
                )}
              </div>
            )}

            {selectedSubTab === 'Materials' && (
              <div>
                <h3 className="text-lg font-semibold text-[#c31e5a] mb-3 uppercase">Materials</h3>
                {materials && materials.length > 0 ? (
                  <table className="w-full border border-slate-200 text-sm md:text-base">
                    <tbody>
                      {materials.map((material, index) => (
                        <tr 
                          key={`material-${index}`}
                          className={index % 2 === 0 ? 'border-b border-slate-200 bg-gray-50' : 'border-b border-slate-200'}
                        >
                          <td className="font-semibold p-2 w-1/3">{material.label}</td>
                          <td className="p-2">{material.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-slate-500 italic">No materials information available</p>
                )}
              </div>
            )}

            {selectedSubTab === 'Operating Conditions' && (
              <div>
                <h3 className="text-lg font-semibold text-[#c31e5a] mb-3 uppercase">Operating Conditions</h3>
                {operatingConditions && operatingConditions.length > 0 ? (
                  <table className="w-full border border-slate-200 text-sm md:text-base">
                    <tbody>
                      {operatingConditions.map((condition, index) => (
                        <tr 
                          key={`condition-${index}`}
                          className={index % 2 === 0 ? 'border-b border-slate-200 bg-gray-50' : 'border-b border-slate-200'}
                        >
                          <td className="font-semibold p-2 w-1/3">{condition.label}</td>
                          <td className="p-2">{condition.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-slate-500 italic">No operating conditions information available</p>
                )}
              </div>
            )}

            {selectedSubTab === 'Technical Specifications' && (
              <div>
                <h3 className="text-lg font-semibold text-[#c31e5a] mb-3 uppercase">
                  Technical Specifications
                </h3>
                {technicalSpecs && technicalSpecs.length > 0 ? (
                  <>
                    <table className="w-full border border-slate-200 text-sm md:text-base mb-6">
                      <tbody>
                        {technicalSpecs.map((spec, index) => (
                          <tr 
                            key={`tech-spec-${index}`}
                            className={index % 2 === 0 ? 'border-b border-slate-200 bg-gray-50' : 'border-b border-slate-200'}
                          >
                            <td className="font-semibold p-2 w-1/3">{spec.label}</td>
                            <td className="p-2">{spec.value}</td>
                          </tr>
                        ))}
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
                  </>
                ) : (
                  <p className="text-slate-500 italic">No technical specifications information available</p>
                )}
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
                          <div className="p-4 space-y-2">
                            {applications.map((app, index) => {
                              const label = (app.label || app.attributeName || app.name || '').toString().trim();
                              const value = (app.value || app.attributeValue || app.description || '').toString().trim();
                              // Only show value if it exists, skip if empty or duplicate
                              if (!value) return null;
                              return (
                                <div 
                                  key={`app-mobile-${index}-${value.substring(0, 20)}`}
                                  className="p-3 border border-slate-200 rounded bg-white"
                                >
                                  {label && label !== value && (
                                    <p className="font-semibold text-slate-900 mb-1 text-xs">{label}:</p>
                                  )}
                                  <p className="text-slate-700 text-sm">{value}</p>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-4">
                            <p className="text-slate-500 italic text-sm">No applications information available</p>
                          </div>
                        )}
                      </div>
                    )}
                    {subTab === 'Materials' && (
                      <div>
                        {materials && materials.length > 0 ? (
                          <table className="w-full border border-slate-200 text-sm">
                            <tbody>
                              {materials.map((material, index) => (
                                <tr 
                                  key={`material-mobile-${index}`}
                                  className={index % 2 === 0 ? 'border-b bg-gray-50' : 'border-b'}
                                >
                                  <td className="font-semibold p-2 w-1/3">{material.label}</td>
                                  <td className="p-2">{material.value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="p-4">
                            <p className="text-slate-500 italic text-sm">No materials information available</p>
                          </div>
                        )}
                      </div>
                    )}

                    {subTab === 'Operating Conditions' && (
                      <div>
                        {operatingConditions && operatingConditions.length > 0 ? (
                          <table className="w-full border border-slate-200 text-sm">
                            <tbody>
                              {operatingConditions.map((condition, index) => (
                                <tr 
                                  key={`condition-mobile-${index}`}
                                  className={index % 2 === 0 ? 'border-b bg-gray-50' : 'border-b'}
                                >
                                  <td className="font-semibold p-2 w-1/3">{condition.label}</td>
                                  <td className="p-2">{condition.value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="p-4">
                            <p className="text-slate-500 italic text-sm">No operating conditions information available</p>
                          </div>
                        )}
                      </div>
                    )}

                    {subTab === 'Technical Specifications' && (
                      <div>
                        {technicalSpecs && technicalSpecs.length > 0 ? (
                          <>
                            <table className="w-full border border-slate-200 text-sm mb-4">
                              <tbody>
                                {technicalSpecs.map((spec, index) => (
                                  <tr 
                                    key={`tech-spec-mobile-${index}`}
                                    className={index % 2 === 0 ? 'border-b bg-gray-50' : 'border-b'}
                                  >
                                    <td className="font-semibold p-2 w-1/3">{spec.label}</td>
                                    <td className="p-2">{spec.value}</td>
                                  </tr>
                                ))}
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
                          </>
                        ) : (
                          <div className="p-4">
                            <p className="text-slate-500 italic text-sm">No technical specifications information available</p>
                          </div>
                        )}
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

