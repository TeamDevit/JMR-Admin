import React from "react";
import { Toaster } from "react-hot-toast";
import { ArrowRight } from 'lucide-react';
import VocabularyForm from '../forms/vocabulary';
import PracticeForm from '../forms/Practice';
import QuizForm from '../forms/Quiz';
import SentenceForm from '../forms/Sentence';
import AvatarToStudentForm from '../forms/AvatarToStudent';
import StudentToAvatarForm from '../forms/StudentToAvatar';

const ModuleFormView = ({ selectedModule, handleGoBack }) => {
  const FormComponent = (() => {
    switch (selectedModule?.form) {
      case 'VocabularyForm':
        return VocabularyForm;
      case 'PracticeForm':
        return PracticeForm;
      case 'QuizForm':
        return QuizForm;
      case 'SentenceForm':
        return SentenceForm;
      case 'AvatarToStudentForm':
        return AvatarToStudentForm;
      case 'StudentToAvatarForm':
        return StudentToAvatarForm;
      default:
        return null;
    }
  })();
  
  const title = selectedModule?.title || 'Unknown Module';
  
  return (
    <div className="flex-1 p-8">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-7xl flex items-center justify-between mb-12">
        <button
          onClick={handleGoBack}
          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200"
        >
          <ArrowRight className="rotate-180" size={16} />
          <span>Go Back to Modules</span>
        </button>
        <h1 className="text-4xl font-bold text-center flex-1 text-gray-900">{title}</h1>
      </div>
      <div className="w-full max-w-7xl p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
          Content for {title}
        </h2>
        {FormComponent ? (
          <FormComponent />
        ) : (
          <p className="text-sm text-gray-500 mt-4">
            This is a placeholder for the content of {title}. The form component could not be found or is not yet implemented.
          </p>
        )}
      </div>
    </div>
  );
};

export default ModuleFormView;