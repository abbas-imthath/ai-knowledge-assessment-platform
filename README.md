# DocExtract Wireframe Prototype

A dependency-free functional prototype based on the supplied wireframe.

## Pages

1. `index.html` — Home page + Login modal
2. `upload.html` — Upload page with default, selected, progress, success and error states
3. `results.html` — Extraction results + individual section/document viewer example

## Run

Open `index.html` directly in a browser, or serve the folder with any static web server.

Example:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Implemented interactions

- Home → Upload navigation
- Login modal open/close
- Basic login validation/error state
- Password show/hide
- File picker
- PDF/DOC/DOCX validation
- Drag-and-drop upload
- Remove selected file
- Simulated upload progress
- Cancel upload
- Upload success state
- Retry/choose another file on error
- Results section switching
- Reprocess button state
- Download extraction results as JSON
- Responsive layout

## Important

This is a frontend prototype. The upload, authentication, AI extraction, document rendering and reprocessing are simulated in the browser. Replace those parts with real API calls/backend services when integrating with the actual DocExtract system.
