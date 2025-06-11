import './App.css'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    window.electron.ping().then(response => {
        console.log('Electron said:', response);
    })
}, []);

  const handleSendEmail = async () => {
    const result = await window.electron.sendTestEmail();
    if (result.success) {
      alert(`Email sent.`);
    } else {
      alert(`Email failed to send: ${result.error}`);
    }
  };

  return (
    <>
      <div className="card">
        <button onClick={handleSendEmail}>
          Send Test Email
        </button>
      </div>
    </>
  )
}

export default App
