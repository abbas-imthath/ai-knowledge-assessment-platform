// Shared interactions for the three wireframe pages.
document.addEventListener("DOMContentLoaded", () => {
  // Login modal
  const loginBtn = document.getElementById("loginBtn");
  const modal = document.getElementById("loginModal");
  const closeLogin = document.getElementById("closeLogin");
  if (loginBtn && modal) {
    loginBtn.onclick = () => modal.classList.remove("hidden");
    closeLogin.onclick = () => modal.classList.add("hidden");
    modal.addEventListener("click", e => { if (e.target === modal) modal.classList.add("hidden"); });
    document.getElementById("togglePassword")?.addEventListener("click", () => {
      const p = document.getElementById("password");
      p.type = p.type === "password" ? "text" : "password";
    });
    document.getElementById("loginForm")?.addEventListener("submit", e => {
      e.preventDefault();
      document.getElementById("loginError").classList.remove("hidden");
    });
  }

  // Upload page
  const fileInput = document.getElementById("fileInput");
  const dropZone = document.getElementById("dropZone");
  if (fileInput && dropZone) {
    const selectedPanel = document.getElementById("selectedPanel");
    const progressPanel = document.getElementById("progressPanel");
    const successPanel = document.getElementById("successPanel");
    const errorPanel = document.getElementById("errorPanel");
    const nameEl = document.getElementById("fileName");
    const sizeEl = document.getElementById("fileSize");
    let selectedFile = null;
    let timer = null;

    const formatSize = bytes => bytes < 1024*1024 ? `${(bytes/1024).toFixed(1)} KB` : `${(bytes/1024/1024).toFixed(1)} MB`;

    function selectFile(file) {
      if (!file) return;
      const allowed = /\.(pdf|doc|docx)$/i.test(file.name);
      if (!allowed) {
        document.getElementById("errorName").textContent = file.name;
        errorPanel.classList.remove("hidden");
        selectedPanel.classList.add("hidden");
        return;
      }
      selectedFile = file;
      nameEl.textContent = file.name;
      sizeEl.textContent = formatSize(file.size);
      document.getElementById("progressName").textContent = file.name;
      document.getElementById("successName").textContent = file.name;
      document.getElementById("errorName").textContent = file.name;
      selectedPanel.classList.remove("hidden");
      errorPanel.classList.add("hidden");
      successPanel.classList.add("hidden");
      progressPanel.classList.add("hidden");
    }

    document.getElementById("browseBtn").onclick = () => fileInput.click();
    fileInput.onchange = () => selectFile(fileInput.files[0]);
    ["dragenter","dragover"].forEach(ev => dropZone.addEventListener(ev, e => { e.preventDefault(); dropZone.style.background="#f5f8ff"; }));
    ["dragleave","drop"].forEach(ev => dropZone.addEventListener(ev, e => { e.preventDefault(); dropZone.style.background=""; }));
    dropZone.addEventListener("drop", e => selectFile(e.dataTransfer.files[0]));

    document.getElementById("removeBtn").onclick = () => {
      selectedFile = null; fileInput.value = ""; selectedPanel.classList.add("hidden");
    };

    document.getElementById("uploadBtn").onclick = () => {
      if (!selectedFile) return;
      selectedPanel.classList.add("hidden");
      successPanel.classList.add("hidden");
      errorPanel.classList.add("hidden");
      progressPanel.classList.remove("hidden");
      let progress = 0;
      const bar = document.getElementById("progressBar");
      const txt = document.getElementById("progressText");
      const pct = document.getElementById("progressPct");
      clearInterval(timer);
      timer = setInterval(() => {
        progress += Math.floor(Math.random()*12)+5;
        if (progress >= 100) progress = 100;
        bar.style.width = progress + "%"; txt.textContent = progress + "%"; pct.textContent = progress + "%";
        if (progress === 100) {
          clearInterval(timer);
          setTimeout(() => {
            progressPanel.classList.add("hidden");
            successPanel.classList.remove("hidden");
          }, 450);
        }
      }, 280);
    };

    document.getElementById("cancelBtn").onclick = () => {
      clearInterval(timer);
      progressPanel.classList.add("hidden");
      selectedPanel.classList.remove("hidden");
    };
    document.getElementById("retryBtn")?.addEventListener("click", () => errorPanel.classList.add("hidden"));
    document.getElementById("chooseAnotherBtn")?.addEventListener("click", () => { errorPanel.classList.add("hidden"); fileInput.click(); });
  }

  // Results page section switching
  const sectionButtons = document.querySelectorAll(".section-item[data-section]");
  const preview = document.getElementById("sectionPreview");
  if (sectionButtons.length && preview) {
    const content = {
      "Header": "<h2>Header</h2><p>Document title, author information and publication metadata extracted from the source file.</p>",
      "Table of Contents": preview.innerHTML,
      "Main Content": "<h2>Main Content</h2><p>3. User Guide</p><p>3.1 Basic Usage</p><p>3.2 Advanced Usage</p><p>4. Best Practices</p>",
      "Appendix": "<h2>Appendix</h2><p>Appendix A — Additional Data and Tables</p><p>Appendix B — Reference Information</p>",
      "Other Sections": "<h2>Other Sections</h2><p>Additional extracted sections are available for review.</p>"
    };
    sectionButtons.forEach(btn => btn.addEventListener("click", () => {
      sectionButtons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      preview.innerHTML = content[btn.dataset.section] || content["Other Sections"];
    }));
  }

  document.getElementById("downloadResults")?.addEventListener("click", () => {
    const data = { document:"Sample_Book.pdf", status:"Completed", sections:["Header","Table of Contents","Main Content","Appendix","Other Sections"] };
    const blob = new Blob([JSON.stringify(data,null,2)], {type:"application/json"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download="Sample_Book-extraction-results.json"; a.click();
    URL.revokeObjectURL(a.href);
  });

  document.getElementById("reprocessBtn")?.addEventListener("click", e => {
    const original = e.currentTarget.textContent;
    e.currentTarget.textContent = "Processing…";
    e.currentTarget.disabled = true;
    setTimeout(() => { e.currentTarget.textContent = "Reprocessed ✓"; e.currentTarget.disabled = false; }, 1000);
  });
});