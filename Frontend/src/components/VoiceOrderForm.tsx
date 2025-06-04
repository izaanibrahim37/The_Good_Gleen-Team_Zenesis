import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface OrderDetails {
  foodType: string;
  location: string;
  priceRange: string;
  quantity: number;
  deliveryDateTime: string;
}

const VoiceOrderForm: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    foodType: '',
    location: '',
    priceRange: '',
    quantity: 1,
    deliveryDateTime: '',
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
        processVoiceInput(transcriptText);
      };

      recognitionRef.current.onerror = (event) => {
        setError('Speech recognition error. Please try again.');
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setError('Speech recognition is not supported in your browser.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const processVoiceInput = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    // Extract quantity
    const quantityMatch = lowerInput.match(/\b(\d+)\s+(pizza|burger|sushi)/);
    if (quantityMatch) {
      setOrderDetails(prev => ({
        ...prev,
        quantity: parseInt(quantityMatch[1]),
        foodType: quantityMatch[2]
      }));
    }

    // Extract address
    const addressMatch = lowerInput.match(/(?:deliver(?:ed)?\s+to\s+)(.+?)(?=\s+on\s+|$)/i);
    if (addressMatch) {
      setOrderDetails(prev => ({
        ...prev,
        location: addressMatch[1]
      }));
    }

    // Extract price range
    if (lowerInput.includes('cheap') || lowerInput.includes('budget')) {
      setOrderDetails(prev => ({ ...prev, priceRange: '$' }));
    } else if (lowerInput.includes('expensive') || lowerInput.includes('premium')) {
      setOrderDetails(prev => ({ ...prev, priceRange: '$$$' }));
    } else if (lowerInput.includes('moderate') || lowerInput.includes('medium')) {
      setOrderDetails(prev => ({ ...prev, priceRange: '$$' }));
    }

    // Extract date and time
    const dateTimeMatch = lowerInput.match(/(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s+at\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm))/i);
    if (dateTimeMatch) {
      setOrderDetails(prev => ({
        ...prev,
        deliveryDateTime: dateTimeMatch[0]
      }));
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setError('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields are filled
    if (!Object.values(orderDetails).every(value => value)) {
      setError('Please fill in all fields before submitting.');
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    // Here you would typically send the order to your backend
    console.log('Order confirmed:', orderDetails);
    // Reset form
    setOrderDetails({
      foodType: '',
      location: '',
      priceRange: '',
      quantity: 1,
      deliveryDateTime: '',
    });
    setShowConfirmation(false);
    setTranscript('');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Voice-Enabled Order Form</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={toggleListening}
          className={`flex items-center justify-center w-full py-3 px-4 rounded-lg text-white transition-colors ${
            isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-5 h-5 mr-2" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Start Speaking
            </>
          )}
        </button>

        {isListening && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span className="text-sm text-gray-600">Listening...</span>
            </div>
            {transcript && (
              <p className="mt-2 text-sm text-gray-600">"{transcript}"</p>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Food Type
          </label>
          <input
            type="text"
            value={orderDetails.foodType}
            onChange={(e) => setOrderDetails(prev => ({ ...prev, foodType: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., pizza, sushi, burger"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Location
          </label>
          <input
            type="text"
            value={orderDetails.location}
            onChange={(e) => setOrderDetails(prev => ({ ...prev, location: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Full address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Range
          </label>
          <select
            value={orderDetails.priceRange}
            onChange={(e) => setOrderDetails(prev => ({ ...prev, priceRange: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select price range</option>
            <option value="$">$ (Budget)</option>
            <option value="$$">$$ (Moderate)</option>
            <option value="$$$">$$$ (Premium)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            value={orderDetails.quantity}
            onChange={(e) => setOrderDetails(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Date and Time
          </label>
          <input
            type="datetime-local"
            value={orderDetails.deliveryDateTime}
            onChange={(e) => setOrderDetails(prev => ({ ...prev, deliveryDateTime: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Review Order
        </button>
      </form>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Your Order</h3>
            <div className="space-y-2">
              <p><strong>Food:</strong> {orderDetails.foodType}</p>
              <p><strong>Quantity:</strong> {orderDetails.quantity}</p>
              <p><strong>Delivery To:</strong> {orderDetails.location}</p>
              <p><strong>Price Range:</strong> {orderDetails.priceRange}</p>
              <p><strong>Delivery Time:</strong> {orderDetails.deliveryDateTime}</p>
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleConfirm}
                className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Confirm Order
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Edit Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceOrderForm;