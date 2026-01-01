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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '3rem 1.5rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    card: {
      width: '100%',
      maxWidth: '500px',
      background: 'white',
      borderRadius: '1.5rem',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      padding: '2.5rem',
      marginBottom: '2rem'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '0.5rem',
      margin: '0 0 0.5rem 0'
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '0.95rem',
      margin: 0
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.5rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '2px solid #e5e7eb',
      borderRadius: '0.75rem',
      fontSize: '0.95rem',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s',
      outline: 'none'
    },
    uploadArea: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      padding: '3rem 2rem',
      border: '3px dashed #10b981',
      borderRadius: '1rem',
      cursor: 'pointer',
      background: '#f0fdf4',
      transition: 'all 0.3s',
      boxSizing: 'border-box'
    },
    uploadAreaHover: {
      borderColor: '#059669',
      background: '#dcfce7'
    },
    button: {
      width: '100%',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      fontWeight: '600',
      padding: '1rem',
      borderRadius: '0.75rem',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontSize: '1rem',
      transition: 'transform 0.2s, box-shadow 0.2s',
      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(16, 185, 129, 0.5)'
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      transform: 'none'
    },
    preview: {
      width: '100%',
      maxHeight: '300px',
      objectFit: 'contain',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      border: '3px solid #10b981'
    },
    alert: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem',
      borderRadius: '0.75rem',
      marginTop: '1rem',
      fontWeight: '500'
    },
    alertSuccess: {
      background: '#d1fae5',
      color: '#065f46',
      border: '2px solid #10b981'
    },
    alertError: {
      background: '#fee2e2',
      color: '#991b1b',
      border: '2px solid #ef4444'
    },
    instructions: {
      width: '100%',
      maxWidth: '500px',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '1rem',
      padding: '1.5rem',
      fontSize: '0.875rem',
      color: '#374151',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
    },
    instructionsTitle: {
      fontWeight: '600',
      marginBottom: '0.75rem',
      fontSize: '1rem',
      color: '#1f2937',
      margin: '0 0 0.75rem 0'
    },
    instructionsList: {
      marginLeft: '1.25rem',
      lineHeight: '1.8',
      margin: '0',
      paddingLeft: '1.25rem'
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
        input:focus {
          border-color: #10b981 !important;
        }
      `}</style>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>Discord Image Uploader</h1>
            <p style={styles.subtitle}>Upload and send images to Discord via webhook</p>
          </div>

          <div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Discord Webhook URL</label>
              <input
                type="url"
                value={webhook}
                onChange={(e) => setWebhook(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Message (Optional)</label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message with your image..."
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
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
                  <Upload style={{ margin: '0 auto 0.75rem', color: '#10b981' }} size={48} />
                  <span style={{ color: '#059669', fontWeight: '500' }}>
                    {image ? image.name : 'Click to upload an image'}
                  </span>
                </div>
              </label>
            </div>

            {preview && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Preview:</label>
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
          <h3 style={styles.instructionsTitle}>
            How to get your Discord Webhook:
          </h3>
          <ol style={styles.instructionsList}>
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
