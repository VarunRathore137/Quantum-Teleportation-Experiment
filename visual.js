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