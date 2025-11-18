# Quantum Teleportation Backend - Setup Guide

## 📋 File Checklist

Make sure you have these files in your project directory:

```
Your-Project-Folder/
├── qubits.py                  ✅ Update with new code
├── quantum_utils.py           ✅ Replace completely  
├── QuantumEntanglement.qs     ✅ Replace completely
├── main.py                    ✅ NEW - Create this file
├── requirements.txt           ✅ NEW - Create this file
├── test_backend.py            ✅ NEW - Create this file
└── SETUP_GUIDE.md             ✅ This file
```

---

## 🚀 Step-by-Step Setup

### **Step 1: Update Working Directory**

Open `qubits.py` and update line 12:

```python
# CHANGE THIS to your actual project path
os.chdir(r"d:\Codes\Quantum-Teleportation-Experiment")
```

To (your actual path):
```python
os.chdir(r"C:\Users\YourName\YourProjectFolder")
```

---

### **Step 2: Install Dependencies**

Open terminal/command prompt in your project folder:

```bash
# Install all required packages
pip install -r requirements.txt
```

Or install individually:
```bash
pip install qsharp
pip install fastapi
pip install uvicorn
pip install pydantic
```

---

### **Step 3: Test Backend Components**

**IMPORTANT: Test BEFORE starting the server!**

```bash
python test_backend.py
```

Expected output:
```
✓ quantum_utils imported successfully

========================================
TEST 1: Single Qubit Processing
========================================
✓ Single qubit processed. Measurement: ...

[... more tests ...]

========================================
TEST SUMMARY
========================================
✓ PASS   | Single Qubit
✓ PASS   | Bell State
✓ PASS   | Entanglement
✓ PASS   | Teleportation
✓ PASS   | API Models

5/5 tests passed

🎉 All tests passed! Backend is ready.
```

If any tests fail, check:
- ✅ All files are in the same directory
- ✅ Q# syntax in QuantumEntanglement.qs is correct
- ✅ qsharp package is installed correctly

---

### **Step 4: Test Standalone Python Script**

Before starting the web server, test the Python workflow:

```bash
python qubits.py
```

This will:
1. Initialize qubits
2. Create entanglement
3. Perform complete teleportation
4. Show detailed Q# output

Expected output shows 6 phases of teleportation with measurements.

---

### **Step 5: Start FastAPI Server**

```bash
python main.py
```

Expected output:
```
============================================================
🚀 Quantum Teleportation API Server Starting...
============================================================
📡 Backend will run Q# quantum operations
🌐 CORS enabled for frontend communication
🔬 Endpoints available at http://localhost:8000/docs
============================================================
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Keep this terminal window open - the server is now running!

---

### **Step 6: Test API Endpoints**

#### **Option A: Browser (Swagger UI)**

Open browser and go to:
```
http://localhost:8000/docs
```

You'll see interactive API documentation. Try:
1. Click on `/api/teleport` endpoint
2. Click "Try it out"
3. Edit the JSON request body
4. Click "Execute"
5. See the real Q# results!

#### **Option B: Command Line (curl)**

```bash
curl -X POST http://localhost:8000/api/teleport \
  -H "Content-Type: application/json" \
  -d '{
    "messageQubit": {
      "id": "q_msg",
      "label": "Message",
      "role": "Input",
      "isEntangled": false,
      "state": "|0>",
      "entangleWith": []
    },
    "aliceQubit": {
      "id": "q_alice",
      "label": "Alice",
      "role": "Sender",
      "isEntangled": false,
      "state": "|0>",
      "entangleWith": []
    },
    "bobQubit": {
      "id": "q_bob",
      "label": "Bob",
      "role": "Receiver",
      "isEntangled": false,
      "state": "|0>",
      "entangleWith": []
    },
    "messageState": "superposition"
  }'
```

#### **Option C: Python (requests library)**

```python
import requests
import json

response = requests.post(
    "http://localhost:8000/api/teleport",
    json={
        "messageQubit": {
            "id": "q_msg",
            "label": "Message", 
            "role": "Input",
            "isEntangled": False,
            "state": "|0>",
            "entangleWith": []
        },
        "aliceQubit": {
            "id": "q_alice",
            "label": "Alice",
            "role": "Sender",
            "isEntangled": False,
            "state": "|0>",
            "entangleWith": []
        },
        "bobQubit": {
            "id": "q_bob",
            "label": "Bob",
            "role": "Receiver",
            "isEntangled": False,
            "state": "|0>",
            "entangleWith": []
        },
        "messageState": "superposition"
    }
)

print(json.dumps(response.json(), indent=2))
```

---

## 🎨 Frontend Integration

### **JavaScript Fetch Example**

Add this function to your React component:

```javascript
const runRealQuantumSimulation = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await fetch("http://localhost:8000/api/teleport", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messageQubit: {
          id: "q_msg",
          label: "Message",
          role: "Input",
          isEntangled: false,
          state: "|0>",
          entangleWith: []
        },
        aliceQubit: {
          id: "q_alice",
          label: "Alice",
          role: "Sender",
          isEntangled: false,
          state: "|0>",
          entangleWith: []
        },
        bobQubit: {
          id: "q_bob",
          label: "Bob",
          role: "Receiver",
          isEntangled: false,
          state: "|0>",
          entangleWith: []
        },
        messageState: messageStateSelection // "zero", "one", or "superposition"
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Update UI with real Q# results
    console.log("Real quantum results:", data);
    
    setRealResults({
      messageMeasurement: data.results.messageMeasurement,
      aliceMeasurement: data.results.aliceMeasurement,
      bobFinalState: data.results.bobFinalState,
      classicalBits: data.results.classicalBits,
      success: data.results.teleportationSuccess
    });
    
    setQuantumSteps(data.quantumSteps);
    
    // Show success message
    alert(`Teleportation ${data.results.teleportationSuccess ? 'successful' : 'completed'}!`);
    
  } catch (error) {
    console.error("Error calling quantum backend:", error);
    setError(`Failed to run quantum simulation: ${error.message}`);
  } finally {
    setLoading(false);
  }
};
```

### **Add a Button to Your UI**

```jsx
<button 
  onClick={runRealQuantumSimulation}
  disabled={loading}
  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
>
  {loading ? "Running Q# Simulation..." : "🔬 Run Real Q# Simulation"}
</button>

{error && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
    {error}
  </div>
)}

{realResults && (
  <div className="bg-green-100 border border-green-400 p-4 rounded">
    <h3 className="font-bold">Real Q# Results:</h3>
    <p>Message Measurement: {realResults.messageMeasurement}</p>
    <p>Alice Measurement: {realResults.aliceMeasurement}</p>
    <p>Bob's Final State: {realResults.bobFinalState}</p>
    <p>Classical Bits: {realResults.classicalBits}</p>
    <p>Success: {realResults.success ? "✅" : "⚠️"}</p>
  </div>
)}
```

---

## 🐛 Troubleshooting

### **Problem: "Module not found" error**

```bash
ModuleNotFoundError: No module named 'qsharp'
```

**Solution:**
```bash
pip install qsharp
```

---

### **Problem: "QuantumEntanglement.qs file not found"**

```
✗ Error: QuantumEntanglement.qs file not found
```

**Solution:**
1. Make sure all files are in the same directory
2. Check that you updated `os.chdir()` in `qubits.py` to correct path
3. Verify file name is exactly: `QuantumEntanglement.qs` (case-sensitive)

---

### **Problem: CORS error in browser**

```
Access to fetch at 'http://localhost:8000' has been blocked by CORS policy
```

**Solution:**
This should NOT happen because CORS is enabled in `main.py`:
```python
allow_origins=["*"]  # Allows all origins
```

If it still happens:
1. Make sure FastAPI server is running
2. Check if frontend is trying to connect to correct URL
3. Try accessing `http://localhost:8000` directly in browser

---

### **Problem: Q# "NotFound" errors**

```
✗ Q# execution error: NotFound
```

**Solution:**
The code auto-recovers from this, but if it keeps happening:
1. Restart Python script
2. Check Q# syntax in `QuantumEntanglement.qs`
3. Reinstall qsharp: `pip uninstall qsharp && pip install qsharp`

---

### **Problem: Port 8000 already in use**

```
ERROR: [Errno 10048] error while attempting to bind on address ('0.0.0.0', 8000)
```

**Solution:**

Option 1: Kill the process using port 8000
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

Option 2: Use a different port
Edit `main.py`, line at bottom:
```python
uvicorn.run(app, host="0.0.0.0", port=8001)  # Changed to 8001
```

Then update frontend to connect to `http://localhost:8001`

---

## 📊 Understanding the Response

When you call `/api/teleport`, you get back:

```json
{
  "success": true,
  "message": "Quantum teleportation completed successfully",
  "results": {
    "messageMeasurement": 1,
    "aliceMeasurement": 0,
    "bobFinalState": "One",
    "classicalBits": "10",
    "teleportationSuccess": true
  },
  "quantumSteps": [
    {
      "phase": "initialization",
      "description": "Message qubit prepared in superposition state"
    },
    {
      "phase": "entanglement",
      "description": "Bell pair created between Alice and Bob: (|00⟩ + |11⟩)/√2"
    },
    ...
  ]
}
```

**What each field means:**

- `messageMeasurement`: Result of measuring message qubit (0 or 1)
- `aliceMeasurement`: Result of measuring Alice's qubit (0 or 1)
- `bobFinalState`: Bob's final state after corrections ("Zero" or "One")
- `classicalBits`: The 2 bits sent from Alice to Bob
- `teleportationSuccess`: Whether state was successfully reconstructed
- `quantumSteps`: Detailed explanation of each phase

---

## 🎓 Next Steps

1. ✅ Backend is running and tested
2. ✅ API responds correctly
3. 🎨 Connect your existing JavaScript frontend
4. 🎮 Add "Run Real Simulation" button
5. 📊 Display Q# results alongside JS simulation
6. 🎉 Compare JS approximation vs real quantum results!

---

## 📚 Additional Resources

- FastAPI Docs: https://fastapi.tiangolo.com/
- Q# Documentation: https://learn.microsoft.com/en-us/azure/quantum/
- API Testing: http://localhost:8000/docs (when server is running)

---

## 🆘 Still Having Issues?

If you're stuck:

1. Run `python test_backend.py` and share the output
2. Check all files are in same directory
3. Verify Python version: `python --version` (should be 3.8+)
4. Check installed packages: `pip list | grep qsharp`
5. Try running standalone: `python qubits.py`

Good luck! 🚀✨