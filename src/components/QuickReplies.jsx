import { FileText, CreditCard, Building, IdCard, Car, Briefcase } from 'lucide-react';

export function QuickReplies({ onSelect, language }) {
  const quickReplies = {
    en: [
      { icon: FileText, text: 'Apply for Passport', query: 'How do I apply for a passport?' },
      { icon: IdCard, text: 'National ID', query: 'How to get a National ID?' },
      { icon: CreditCard, text: 'KRA PIN', query: 'How to register for KRA PIN?' },
      { icon: Building, text: 'NHIF Registration', query: 'How to register for NHIF?' },
      { icon: Car, text: 'Driving License', query: 'How to renew driving license?' },
      { icon: Briefcase, text: 'Business Registration', query: 'How to register a business?' },
    ],
    sw: [
      { icon: FileText, text: 'Omba Pasipoti', query: 'Jinsi ya kuomba pasipoti?' },
      { icon: IdCard, text: 'Kitambulisho', query: 'Jinsi ya kupata Kitambulisho cha Kitaifa?' },
      { icon: CreditCard, text: 'PIN ya KRA', query: 'Jinsi ya kusajili PIN ya KRA?' },
      { icon: Building, text: 'Usajili wa NHIF', query: 'Jinsi ya kusajili NHIF?' },
      { icon: Car, text: 'Leseni ya Udereva', query: 'Jinsi ya kufanya upya leseni ya udereva?' },
      { icon: Briefcase, text: 'Usajili wa Biashara', query: 'Jinsi ya kusajili biashara?' },
    ],
  };

  const replies = quickReplies[language] || quickReplies.en;

  return (
    <div className="mb-4">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {language === 'sw' ? 'Maswali ya Haraka:' : 'Quick Questions:'}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {replies.map((reply, index) => {
          const Icon = reply.icon;
          return (
            <button
              key={index}
              onClick={() => onSelect(reply.query)}
              className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors text-left"
            >
              <Icon className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{reply.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
