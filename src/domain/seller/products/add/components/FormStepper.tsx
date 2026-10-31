type FormStepperProps = {
  currentStep: number;
  steps: string[];
  onStepClick?: (step: number) => void;
};

export const FormStepper = ({ currentStep, steps, onStepClick }: FormStepperProps) => {
  return (
    <div className="mb-6 sm:mb-8">
      {/* Desktop Stepper (horizontal) */}
      <ol className="items-center hidden w-full md:flex">
        {steps.map((step, index) => (
          <li 
            key={step}
            className={`flex items-center ${index !== steps.length - 1 ? 'w-full' : ''} cursor-pointer`}
            onClick={() => onStepClick && onStepClick(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onStepClick && onStepClick(index);
              }
            }}
            aria-current={currentStep === index ? "step" : undefined}
          >
            <div className={`flex items-center ${currentStep >= index ? 'text-blue-600' : 'text-slate-500'}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${currentStep >= index ? 'bg-purple-100' : 'bg-gray-100'}`}>
                {currentStep > index ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-sm">{index + 1}</span>
                )}
              </div>
              <span className="ml-2 text-sm font-medium">{step}</span>
            </div>
            {index !== steps.length - 1 && (
              <div className={`w-full h-0.5 mx-2 transition-colors ${currentStep > index ? 'bg-blue-500' : 'bg-slate-200'}`}></div>
            )}
          </li>
        ))}
      </ol>

      {/* Mobile Stepper - Progress bar + Current step indicator */}
      <div className="space-y-4 md:hidden">
        {/* Progress bar */}
        <div className="w-full">
          <div className="flex justify-between mb-2 text-xs text-gray-500">
            <span>Progression</span>
            <span>Étape {currentStep + 1} sur {steps.length}</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-300 bg-blue-500 rounded-full"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current step card */}
        {/* <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-600 rounded-full">
              <span className="text-sm font-semibold text-white">{currentStep + 1}</span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-purple-600">Étape actuelle</p>
              <p className="text-base font-semibold text-gray-900">{steps[currentStep]}</p>
            </div>
          </div>
        </div> */}

        {/* Step dots navigation */}
        {/* <div className="flex justify-center py-2 space-x-3">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => onStepClick && onStepClick(index)}
              className={`transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-full ${
                currentStep === index
                  ? "w-8 h-2 bg-purple-600"
                  : currentStep > index
                  ? "w-2 h-2 bg-purple-300"
                  : "w-2 h-2 bg-gray-300"
              }`}
              aria-label={`Aller à l'étape ${index + 1}: ${step}`}
              aria-current={currentStep === index ? "step" : undefined}
            />
          ))}
        </div> */}

        {/* Step list for context */}
        {/* <div className="pt-2 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {steps.map((step, index) => (
              <button
                key={step}
                onClick={() => onStepClick && onStepClick(index)}
                className={`flex-shrink-0 px-3 py-1.5 text-xs rounded-full transition-colors ${
                  currentStep === index
                    ? "bg-purple-600 text-white"
                    : currentStep > index
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {index + 1}. {step}
              </button>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};