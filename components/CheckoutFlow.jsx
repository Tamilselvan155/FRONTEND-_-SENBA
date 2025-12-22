'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useCart } from '@/lib/hooks/useCart';
import AddressStep from './checkout/AddressStep';
import ReviewStep from './checkout/ReviewStep';
import PaymentStep from './checkout/PaymentStep';
import OrderConfirmation from './checkout/OrderConfirmation';
import { CheckCircle } from 'lucide-react';

const CheckoutFlow = ({ cartArray, totalPrice, totalSavings, onComplete, onCancel }) => {
  const { isLoggedIn } = useCart();
  const { email } = useSelector((state) => state.auth);
  
  const [currentStep, setCurrentStep] = useState(2);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [orderInstructions, setOrderInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Step definitions
  const steps = [
    { id: 1, name: 'Login', description: 'Sign in to continue' },
    { id: 2, name: 'Address', description: 'Delivery address' },
    { id: 3, name: 'Review', description: 'Review order' },
    { id: 4, name: 'Payment', description: 'Payment method' },
  ];

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setCurrentStep(3);
  };

  const handleReviewComplete = () => {
    setCurrentStep(4);
  };

  const handlePaymentComplete = (orderResult) => {
    setOrderData(orderResult);
    setIsPlacingOrder(false);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId) => {
    // Only allow clicking on completed steps or current step
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => handleStepClick(step.id)}
                  disabled={step.id > currentStep}
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    step.id < currentStep || (step.id === 1 && isLoggedIn)
                      ? 'bg-[#7C2A47] border-[#7C2A47] text-white'
                      : step.id === currentStep
                      ? 'bg-[#7C2A47] border-[#7C2A47] text-white ring-4 ring-[#7C2A47]/20'
                      : 'bg-white border-gray-300 text-gray-400'
                  } ${step.id <= currentStep ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}`}
                >
                  {step.id < currentStep || (step.id === 1 && isLoggedIn) ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </button>
                <div className="mt-2 text-center">
                  <p className={`text-xs font-medium ${
                    step.id <= currentStep ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.name}
                  </p>
                  <p className={`text-xs mt-0.5 ${
                    step.id <= currentStep ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  step.id < currentStep || (step.id === 1 && isLoggedIn) ? 'bg-[#7C2A47]' : 'bg-gray-300'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
        {orderData ? (
          <OrderConfirmation
            orderData={orderData}
            onContinueShopping={onComplete}
          />
        ) : (
          <>
            {currentStep === 2 && (
              <AddressStep
                onAddressSelect={handleAddressSelect}
                selectedAddress={selectedAddress}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <ReviewStep
                cartArray={cartArray}
                totalPrice={totalPrice}
                totalSavings={totalSavings}
                selectedAddress={selectedAddress}
                orderInstructions={orderInstructions}
                onOrderInstructionsChange={setOrderInstructions}
                onContinue={handleReviewComplete}
                onBack={handleBack}
                onEditAddress={() => setCurrentStep(2)}
              />
            )}
            {currentStep === 4 && (
              <PaymentStep
                cartArray={cartArray}
                totalPrice={totalPrice}
                selectedAddress={selectedAddress}
                orderInstructions={orderInstructions}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                onPaymentComplete={handlePaymentComplete}
                onBack={handleBack}
                isPlacingOrder={isPlacingOrder}
                setIsPlacingOrder={setIsPlacingOrder}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutFlow;

