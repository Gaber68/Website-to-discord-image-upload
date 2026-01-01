import { useState } from 'react';
import { Upload, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ImageUploader() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [webhook, setWebhook] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      setStatus('');
    }
  };

  const handleSubmit = async () => {
    if (!image || !webhook) {
      setStatus('error:Please provide both image and webhook URL');
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      const formData = new FormData();
      formData.append('file', image);
      
      if (message) {
        formData.append('content', message);
      }

      const response = await fetch(webhook, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatus('success:Image sent successfully!');
        setImage(null);
        setPreview(null);
        setMessage('');
      } else {
        setStatus('error:Failed to send image. Check your webhook URL.');
      }
    } catch (error) {
      setStatus('error:Error sending image: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Discord Image Uploader
            </h1>
            <p className="text-gray-600">Upload and send images to Discord via webhook</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discord Webhook URL
              </label>
              <input
                type="url"
                value={webhook}
                onChange={(e) => setWebhook(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message with your image..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition-colors bg-gray-50"
                >
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <span className="text-gray-600">
                      {image ? image.name : 'Click to upload an image'}
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {preview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !image || !webhook}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send to Discord
                </>
              )}
            </button>

            {status && (
              <div
                className={`flex items-center gap-2 p-4 rounded-lg ${
                  status.startsWith('success')
                    ? 'bg-green-50 text-green-800'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                {status.startsWith('success') ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <span>{status.split(':')[1]}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white bg-opacity-90 rounded-lg p-6 text-sm text-gray-700">
          <h3 className="font-semibold mb-2">How to get your Discord Webhook:</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Go to your Discord server settings</li>
            <li>Navigate to Integrations → Webhooks</li>
            <li>Click "New Webhook" or select an existing one</li>
            <li>Copy the webhook URL and paste it above</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
