import { useState } from 'react';
import { Star, ThumbsUp, Send } from 'lucide-react';

export function ChatRating({ onSubmit, language }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit({ rating, feedback });
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
        <ThumbsUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
        <p className="text-green-800 dark:text-green-300 font-semibold">
          {language === 'sw' ? 'Asante kwa maoni yako!' : 'Thank you for your feedback!'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
        {language === 'sw' ? 'Kadiria huduma yetu' : 'Rate our service'}
      </h3>
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder={language === 'sw' ? 'Maoni yako (si lazima)' : 'Your feedback (optional)'}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm mb-3"
        rows="3"
      />
      <button
        onClick={handleSubmit}
        disabled={rating === 0}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg transition-colors"
      >
        <Send className="w-4 h-4" />
        {language === 'sw' ? 'Tuma Maoni' : 'Submit Feedback'}
      </button>
    </div>
  );
}
