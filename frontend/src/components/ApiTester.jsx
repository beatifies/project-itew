import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

function ApiTester() {
  const [results, setResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testCredentials, setTestCredentials] = useState({
    email: 'admin@ccs.edu',
    password: 'password'
  });

  const addResult = (test, success, message, data = null) => {
    setResults(prev => [...prev, { test, success, message, data, timestamp: new Date().toLocaleTimeString() }]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);

    try {
      // Test 1: Check if backend is reachable
      addResult('Backend Connection', true, `Testing connection to ${API_URL}...`);
      
      try {
        const response = await axios.get(API_URL);
        addResult('Backend Connection', true, '✅ Backend is reachable', response.status);
      } catch (error) {
        addResult('Backend Connection', false, `❌ Cannot reach backend: ${error.message}`, error.code);
        setIsRunning(false);
        return;
      }

      // Test 2: Check login route exists
      addResult('Route Check', true, 'Checking if /api/login route exists...');
      try {
        const optionsResponse = await axios.options(`${API_URL}/api/login`);
        addResult('Route Check', true, '✅ Login route exists', optionsResponse.status);
      } catch (error) {
        if (error.response?.status === 405) {
          addResult('Route Check', true, '✅ Login route exists (POST only)', '405 Method Not Allowed for OPTIONS');
        } else if (error.response?.status === 404) {
          addResult('Route Check', false, '❌ Login route NOT found at /api/login', '404 Not Found');
        } else {
          addResult('Route Check', true, '⚠️ Login route exists but returned unexpected status', error.response?.status);
        }
      }

      // Test 3: Try login without CSRF cookie
      addResult('Login Test (No CSRF)', true, 'Attempting login without CSRF cookie...');
      try {
        const loginResponse = await axios.post(`${API_URL}/api/login`, testCredentials, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });
        
        if (loginResponse.data.token) {
          addResult('Login Test (No CSRF)', true, '✅ Login successful! Token received', {
            token: loginResponse.data.token.substring(0, 50) + '...',
            user: loginResponse.data.user
          });
          
          // Test 4: Try authenticated request
          addResult('Auth Request', true, 'Testing authenticated request to /api/user...');
          try {
            const userResponse = await axios.get(`${API_URL}/api/user`, {
              headers: {
                'Authorization': `Bearer ${loginResponse.data.token}`,
                'Accept': 'application/json',
              }
            });
            addResult('Auth Request', true, '✅ Authenticated request successful', userResponse.data);
          } catch (error) {
            addResult('Auth Request', false, `❌ Auth request failed: ${error.message}`, error.response?.data);
          }
        } else {
          addResult('Login Test (No CSRF)', false, '❌ Login succeeded but no token returned', loginResponse.data);
        }
      } catch (error) {
        addResult('Login Test (No CSRF)', false, 
          `❌ Login failed: ${error.response?.status} ${error.message}`,
          error.response?.data
        );
      }

      // Test 5: Try login with CSRF cookie
      addResult('Login Test (With CSRF)', true, 'Getting CSRF cookie first...');
      try {
        // Get CSRF cookie
        await axios.get(`${API_URL}/sanctum/csrf-cookie`, {
          withCredentials: true
        });
        addResult('CSRF Cookie', true, '✅ CSRF cookie received');

        // Now try login
        const loginResponse = await axios.post(`${API_URL}/api/login`, testCredentials, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          withCredentials: true
        });
        
        if (loginResponse.data.token) {
          addResult('Login Test (With CSRF)', true, '✅ Login with CSRF successful!', {
            token: loginResponse.data.token.substring(0, 50) + '...',
            user: loginResponse.data.user
          });
        } else {
          addResult('Login Test (With CSRF)', false, '❌ Login succeeded but no token', loginResponse.data);
        }
      } catch (error) {
        addResult('Login Test (With CSRF)', false, 
          `❌ Login with CSRF failed: ${error.response?.status} ${error.message}`,
          error.response?.data
        );
      }

      // Test 6: Check database for user
      addResult('Database Check', true, 'Note: Verify user exists in database manually');
      addResult('Database Check', true, 'Run: php artisan tinker', null);
      addResult('Database Check', true, 'Then: User::where("email", "admin@ccs.edu")->first()', null);

    } catch (error) {
      addResult('Unexpected Error', false, `❌ Unexpected error: ${error.message}`, error);
    }

    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">🔧 API Authentication Tester</h1>
        
        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={testCredentials.email}
                onChange={(e) => setTestCredentials({...testCredentials, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={testCredentials.password}
                onChange={(e) => setTestCredentials({...testCredentials, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <button
            onClick={runTests}
            disabled={isRunning}
            className={`w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all ${
              isRunning ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isRunning ? 'Running Tests...' : '🚀 Run All Tests'}
          </button>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          
          {results.length === 0 && !isRunning && (
            <p className="text-gray-500 text-center py-8">Click "Run All Tests" to start diagnostics</p>
          )}

          {isRunning && (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Running tests...</p>
            </div>
          )}

          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  result.success 
                    ? 'bg-green-50 border-green-500' 
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 mb-1">{result.test}</div>
                    <div className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                      {result.message}
                    </div>
                    {result.data && (
                      <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-32">
                        {typeof result.data === 'object' 
                          ? JSON.stringify(result.data, null, 2) 
                          : String(result.data)}
                      </pre>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 ml-2">{result.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manual Checks */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-yellow-800 mb-2">📋 Manual Verification Steps</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-700">
            <li>Check if Laravel server is running: <code className="bg-yellow-100 px-2 py-0.5 rounded">php artisan serve</code></li>
            <li>Verify route exists: <code className="bg-yellow-100 px-2 py-0.5 rounded">php artisan route:list --path=login</code></li>
            <li>Check user in database: <code className="bg-yellow-100 px-2 py-0.5 rounded">php artisan tinker</code></li>
            <li>Query user: <code className="bg-yellow-100 px-2 py-0.5 rounded">User::where(&apos;email&apos;, &apos;admin@ccs.edu&apos;)-&gt;first()</code></li>
            <li>Check .env: <code className="bg-yellow-100 px-2 py-0.5 rounded">VITE_API_URL=http://localhost:8000</code></li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default ApiTester;
