const explainBtn = document.getElementById("explainBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");

const userInput = document.getElementById("userInput");
const result = document.getElementById("result");
const loading = document.getElementById("loading");

function showLoading() {
    loading.style.display = "flex";
    result.style.display = "none";
}

function hideLoading() {
    loading.style.display = "none";
    result.style.display = "block";
}

clearBtn.onclick = () => {
    userInput.value = "";
    result.innerHTML = "Your explanation will appear here.";
};

copyBtn.onclick = async () => {
    await navigator.clipboard.writeText(result.innerText);
    copyBtn.innerText = "Copied ✓";
    setTimeout(() => copyBtn.innerText = "Copy", 1500);
};

downloadBtn.onclick = () => {
    const blob = new Blob([result.innerText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "ExplainAI.txt";
    a.click();

    URL.revokeObjectURL(url);
};

explainBtn.onclick = async () => {

    const text = userInput.value.trim();

    if (!text) {
        alert("Paste some text.");
        return;
    }

    showLoading();

    try {

        // Calls our own serverless function — no API key here at all.
        const response = await fetch("/api/explain", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })
        });

        const data = await response.json();

        console.log("HTTP Status:", response.status);
        console.log(data);

        if (!response.ok) {
            throw new Error(data.error || "Server error");
        }

        if (!data.text) {
            throw new Error("Empty response from server.");
        }

        result.innerHTML = marked.parse(data.text);

    } catch (err) {

        console.error(err);

        result.innerHTML = `
<h2>❌ Error</h2>
<pre>${err.message}</pre>
`;

    } finally {

        hideLoading();

    }

};
