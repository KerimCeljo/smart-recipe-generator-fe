import { useState } from 'react'
import axios from 'axios'
import { config } from '../config.js'

export default function BackendTest() {
  const [testResult, setTestResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testBackend = async () => {
    setLoading(true)
    setTestResult('')
    
    try {
      // Test basic connectivity
      const response = await axios.get(`${config.API_BASE}/actuator/health`, {
        timeout: 5000
      })
      setTestResult(`✅ Backend is running! Health: ${JSON.stringify(response.data)}`)
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        setTestResult('❌ Backend connection refused. Is your Spring Boot app running on port 8080?')
      } else if (error.response) {
        setTestResult(`⚠️ Backend responded with status ${error.response.status}: ${error.response.statusText}`)
      } else {
        setTestResult(`❌ Connection error: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const testRecipeEndpoint = async () => {
    setLoading(true)
    setTestResult('')
    
    try {
      const testData = {
        ingredients: "test ingredient",
        mealType: "LUNCH",
        cuisine: "ITALIAN",
        cookingTime: "MIN_30_60",
        complexity: "BEGINNER"
      }
      
      const response = await axios.post(`${config.API_BASE}/api/recipes/generate`, testData, {
        headers: {"X-USER-ID": config.DEMO_USER_ID},
        timeout: 10000
      })
      
      setTestResult(`✅ Recipe endpoint working! Response: ${JSON.stringify(response.data)}`)
    } catch (error) {
      if (error.response) {
        setTestResult(`❌ Recipe endpoint error ${error.response.status}: ${error.response.data?.message || error.response.statusText}`)
      } else {
        setTestResult(`❌ Recipe endpoint error: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      background: '#f8f9fa', 
      padding: '20px', 
      borderRadius: '8px', 
      marginBottom: '20px',
      border: '1px solid #e1e8ed'
    }}>
      <h4>🔧 Backend Connection Test</h4>
      <p>Test your Spring Boot backend connection:</p>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button 
          onClick={testBackend} 
          disabled={loading}
          style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #007bff', background: '#007bff', color: 'white', cursor: 'pointer' }}
        >
          Test Connection
        </button>
        
        <button 
          onClick={testRecipeEndpoint} 
          disabled={loading}
          style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #28a745', background: '#28a745', color: 'white', cursor: 'pointer' }}
        >
          Test Recipe Endpoint
        </button>
      </div>
      
      {loading && <p>🔄 Testing...</p>}
      
      {testResult && (
        <div style={{ 
          background: 'white', 
          padding: '15px', 
          borderRadius: '4px', 
          border: '1px solid #e1e8ed',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          {testResult}
        </div>
      )}
      
      <div style={{ marginTop: '15px', fontSize: '12px', color: '#6c757d' }}>
        <strong>Current config:</strong><br/>
        API Base: {config.API_BASE}<br/>
        Demo User ID: {config.DEMO_USER_ID}
      </div>
    </div>
  )
}
