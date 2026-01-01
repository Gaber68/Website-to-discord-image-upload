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

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #6366f1, #a855f7, #ec4899)',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    card: {
      maxWidth: '42rem',
      margin: '0 auto',
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '2rem'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    title: {
      fontSize: '2.25rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    subtitle: {
      color: '#6b7280'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '0.5rem'
    },
    input: {
      width: '100%',
      padding: '0.5rem 1rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      boxSizing: 'border-box'
    },
    uploadArea: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      padding: '2rem',
      border: '2px dashed #d1d5db',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      background: '#f9fafb',
      transition: 'border-color 0.2s'
    },
    button: {
      width: '100%',
      background: 'linear-gradient(to right, #9333ea, #ec4899)',
      color: 'white',
      fontWeight: '600',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontSize: '1rem'
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    preview: {
      width: '100%',
      height: '16rem',
      objectFit: 'cover',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    alert: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '1rem',
      borderRadius: '0.5rem'
    },
    alertSuccess: {
      background: '#f0fdf4',
      color: '#166534'
    },
    alertError: {
      background: '#fef2f2',
      color: '#991b1b'
    },
    instructions: {
      marginTop: '2rem',
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      fontSize: '0.875rem',
      color: '#374151'
    },
    spinner: {
      width: '1.25rem',
      height: '1.25rem',
      border: '2px solid transparent',
      borderTopColor: 'white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>Discord Image Uploader</h1>
            <p style={styles.subtitle}>Upload and send images to Discord via webhook</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={styles.label}>Discord Webhook URL</label>
              <input
                type="url"
                value={webhook}
                onChange={(e) => setWebhook(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                style={styles.input}
              />
            </div>

            <div>
              <label style={styles.label}>Message (Optional)</label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message with your image..."
                style={styles.input}
              />
            </div>

            <div>
              <label style={styles.label}>Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload" style={styles.uploadArea}>
                <div style={{ textAlign: 'center' }}>
                  <Upload style={{ margin: '0 auto 0.5rem', color: '#9ca3af' }} size={48} />
                  <span style={{ color: '#4b5563' }}>
                    {image ? image.name : 'Click to upload an image'}
                  </span>
                </div>
              </label>
            </div>

            {preview && (
              <div>
                <p style={styles.label}>Preview:</p>
                <img src={preview} alt="Preview" style={styles.preview} />
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !image || !webhook}
              style={{
                ...styles.button,
                ...(loading || !image || !webhook ? styles.buttonDisabled : {})
              }}
            >
              {loading ? (
                <>
                  <div style={styles.spinner}></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Send to Discord
                </>
              )}
            </button>

            {status && (
              <div
                style={{
                  ...styles.alert,
                  ...(status.startsWith('success') ? styles.alertSuccess : styles.alertError)
                }}
              >
                {status.startsWith('success') ? (
                  <CheckCircle size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
                <span>{status.split(':')[1]}</span>
              </div>
            )}
          </div>
        </div>

        <div style={styles.instructions}>
          <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
            How to get your Discord Webhook:
          </h3>
          <ol style={{ marginLeft: '1.25rem' }}>
            <li>Go to your Discord server settings</li>
            <li>Navigate to Integrations → Webhooks</li>
            <li>Click "New Webhook" or select an existing one</li>
            <li>Copy the webhook URL and paste it above</li>
          </ol>
        </div>
      </div>
    </>
  );
}
