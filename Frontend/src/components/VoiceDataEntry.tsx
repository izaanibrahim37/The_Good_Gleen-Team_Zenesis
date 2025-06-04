import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2, AlertTriangle, Languages } from 'lucide-react';

interface SurplusData {
  type: string;
  quantity: number;
  unit: string;
  condition: string;
  expiryDate: string;
  notes: string;
}

interface VoiceDataEntryProps {
  userRole: 'farmer' | 'retailer' | 'ngo';
}

const VoiceDataEntry: React.FC<VoiceDataEntryProps> = ({ userRole }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [surplusData, setSurplusData] = useState<SurplusData>({
    type: '',
    quantity: 0,
    unit: '',
    condition: '',
    expiryDate: '',
    notes: '',
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const supportedLanguages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
  ];

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
        processVoiceInput(transcriptText);
      };

      recognitionRef.current.onerror = (event) => {
        setError('Speech recognition error. Please try again or use manual input.');
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setError('Speech recognition is not supported in your browser. Please use manual input.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);

  const processVoiceInput = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    // Extract quantity and type
    const quantityMatch = lowerInput.match(/(\d+)\s*(kg|kilos|pounds|lbs|tons|boxes|crates)\s+of\s+([a-z\s]+)(?=\s|$)/i);
    if (quantityMatch) {
      setSurplusData(prev => ({
        ...prev,
        quantity: parseInt(quantityMatch[1]),
        unit: quantityMatch[2],
        type: quantityMatch[3].trim()
      }));
    }

    // Extract condition
    const conditions = ['excellent', 'good', 'fair', 'poor'];
    for (const condition of conditions) {
      if (lowerInput.includes(condition)) {
        setSurplusData(prev => ({ ...prev, condition }));
        break;
      }
    }

    // Extract expiry date
    const dateMatch = lowerInput.match(/expires?\s+(?:on\s+)?([a-z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:\s*,?\s*\d{4})?)/i);
    if (dateMatch) {
      setSurplusData(prev => ({ ...prev, expiryDate: dateMatch[1] }));
    }

    // Extract additional notes
    const notesMatch = lowerInput.match(/notes?:?\s+([^.]+)/i);
    if (notesMatch) {
      setSurplusData(prev => ({ ...prev, notes: notesMatch[1].trim() }));
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
    
    // Validate required fields
    const requiredFields = ['type', 'quantity', 'unit', 'condition'];
    const missingFields = requiredFields.filter(field => !surplusData[field as keyof SurplusData]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    try {
      // Here you would typically send the data to your backend
      console.log('Data confirmed:', surplusData);
      
      // Reset form
      setSurplusData({
        type: '',
        quantity: 0,
        unit: '',
        condition: '',
        expiryDate: '',
        notes: '',
      });
      setShowConfirmation(false);
      setTranscript('');
    } catch (error) {
      setError('Failed to save data. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {userRole === 'farmer' ? 'Record Surplus Produce' :
         userRole === 'retailer' ? 'Log Available Items' :
         'Register Requirements'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-start">
          <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <div className="mb-6 space-y-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleListening}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg text-white transition-colors ${
              isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5 mr-2" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 mr-2" />
                Start Recording
              </>
            )}
          </button>

          <div className="flex-1">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {supportedLanguages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isListening && (
          <div className="p-3 bg-gray-50 rounded-lg">
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
            Type *
          </label>
          <input
            type="text"
            value={surplusData.type}
            onChange={(e) => setSurplusData(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., tomatoes, potatoes"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity *
            </label>
            <input
              type="number"
              min="0"
              value={surplusData.quantity || ''}
              onChange={(e) => setSurplusData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit *
            </label>
            <select
              value={surplusData.unit}
              onChange={(e) => setSurplusData(prev => ({ ...prev, unit: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select unit</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="lbs">Pounds (lbs)</option>
              <option value="tons">Tons</option>
              <option value="boxes">Boxes</option>
              <option value="crates">Crates</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Condition *
          </label>
          <select
            value={surplusData.condition}
            onChange={(e) => setSurplusData(prev => ({ ...prev, condition: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select condition</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date
          </label>
          <input
            type="date"
            value={surplusData.expiryDate}
            onChange={(e) => setSurplusData(prev => ({ ...prev, expiryDate: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            value={surplusData.notes}
            onChange={(e) => setSurplusData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any additional information..."
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Review Data
        </button>
      </form>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Details</h3>
            <div className="space-y-2">
              <p><strong>Type:</strong> {surplusData.type}</p>
              <p><strong>Quantity:</strong> {surplusData.quantity} {surplusData.unit}</p>
              <p><strong>Condition:</strong> {surplusData.condition}</p>
              {surplusData.expiryDate && (
                <p><strong>Expiry Date:</strong> {surplusData.expiryDate}</p>
              )}
              {surplusData.notes && (
                <p><strong>Notes:</strong> {surplusData.notes}</p>
              )}
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleConfirm}
                className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceDataEntry;