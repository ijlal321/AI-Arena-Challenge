export function getAllAgents() {
    fetch(process.env.VITE_CHATBOT_SERVER_URL + '/agents', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(agents => {
        console.log("Agents:", agents);
        return agents;
    })
    .catch(error => {
        console.error("Error fetching agents:", error);
        return [];
    });
}


export function sendMessage(agentId, message, selectedFile = null) {
    const formData = new FormData();
    formData.append("text", message);
    formData.append("user", "user");

    if (selectedFile) {
        formData.append("file", selectedFile);
    }

    fetch(process.env.VITE_CHATBOT_SERVER_URL + `/${agentId}/message`, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Message sent:", data);
        return data;
    })
    .catch(error => {
        console.error("Error sending message:", error);
        return {error: error};
    });
}