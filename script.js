// Configure pdf.js worker (loaded via CDN in index.html)
pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const explainBtn = document.getElementById("explainBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");

const userInput = document.getElementById("userInput");
const result = document.getElementById("result");
const loading = document.getElementById("loading");
const loadingText = document.getElementById("loadingText");

const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const dropZoneContent = document.querySelector(".dropZoneContent");
const fileInfo = document.getElementById("fileInfo");
const fileName = document.getElementById("fileName");
const removeFile = document.getElementById("removeFile");

let uploadedFileText = ""; // extracted text from the uploaded file, if any

function showLoading(message = "Thinking...") {
    loadingText.innerText = message;
    loading.style.display = "flex";
    result.style.display = "none";
}

function hideLoading() {
    loading.style.display = "none";
    result.style.display = "block";
}

function showFileSelected(name) {
    dropZoneContent.style.display = "none";
    fileInfo.style.display = "flex";
    fileName.innerText = name;
}

function resetFileSelection() {
    uploadedFileText = "";
    fileInput.value = "";
    dropZoneContent.style.display = "block";
    fileInfo.style.display = "none";
    fileName.innerText = "";
}

// ---- File reading helpers ----

function readTxtFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Failed to read the text file."));
        reader.readAsText(file);
    });
}

async function readPdfFile(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + "\n\n";
    }

    return fullText.trim();
}

async function handleFile(file) {
    if (!file) return;

    const nameLower = file.name.toLowerCase();
    const isTxt = nameLower.endsWith(".txt");
    const isPdf = nameLower.endsWith(".pdf");

    if (!isTxt && !isPdf) {
        alert("Only .txt and .pdf files are supported right now.");
        return;
    }

    showFileSelected(file.name);
    userInput.value = ""; // clear pasted text since a file takes priority
    userInput.placeholder = "Using uploaded file...";
    userInput.disabled = true;

    try {
        if (isTxt) {
            uploadedFileText = await readTxtFile(file);
        } else {
            fileName.innerText = `${file.name} (extracting text...)`;
            uploadedFileText = await readPdfFile(file);
            fileName.innerText = file.name;
        }

        if (!uploadedFileText.trim()) {
            alert("Couldn't find any readable text in that file. It may be a scanned/image-only PDF.");
            resetFileSelection();
            userInput.disabled = false;
            userInput.placeholder = "Paste any text here...";
        }
    } catch (err) {
        console.error(err);
        alert("Something went wrong reading that file: " + err.message);
        resetFileSelection();
        userInput.disabled = false;
        userInput.placeholder = "Paste any text here...";
    }
}

// ---- Drop zone events ----

dropZone.addEventListener("click", () => {
    if (fileInfo.style.display === "flex") return; // don't reopen picker if a file is already selected
    fileInput.click();
});

fileInput.addEventListener("change", (e) => {
    handleFile(e.target.files[0]);
});

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragOver");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragOver");
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragOver");
    handleFile(e.dataTransfer.files[0]);
});

removeFile.addEventListener("click", (e) => {
    e.stopPropagation();
    resetFileSelection();
    userInput.disabled = false;
    userInput.placeholder = "Paste any text here...";
});

// If the user starts typing in the textarea, clear any uploaded file so it doesn't silently take priority
userInput.addEventListener("input", () => {
    if (uploadedFileText) {
        resetFileSelection();
        userInput.disabled = false;
        userInput.placeholder = "Paste any text here...";
    }
});

// ---- Existing buttons ----

clearBtn.onclick = () => {
    userInput.value = "";
    result.innerHTML = "Your explanation will appear here.";
    resetFileSelection();
    userInput.disabled = false;
    userInput.placeholder = "Paste any text here...";
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

    const text = (uploadedFileText || userInput.value).trim();

    if (!text) {
        alert("Paste some text or upload a file first.");
        return;
    }

    showLoading(uploadedFileText ? "Reading your file..." : "Thinking...");

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