# Project Overview
Use this guide to build a web app that allows users to share files.

# Feature Requirements
- We will use Next.js, Shadcn, and Supabase
- Allow users to drag a file or select from computer to upload
- Once a file is uploaded, a secure, hard-to-guess download link is provided
- A user can navigate to the provided link to download the file
- A user can optionally select after how many downloads and/or how much time the download link will expire
- reCAPTCHA v2 for file upload
- .exe files should not be allowed

# Mock Up

#### Page: File Upload

- **Header:** Secure FileShare
- **Main Content Area (Centered)**
  - **Title:** Upload Your File Securely
  - **Drag-and-drop area:**
    - "Drag your file here or click to browse"
    - Supports visual indication upon drag-over (dashed border highlight)
  - **File selection button:** "Select File"
  - **Optional settings (below upload area):**
    - **Expiration Settings:**
      - Enter:
        - Expire after (number of downloads) downloads (maximum 10)
        - Expire after (time duration) hours (maximum 168)
  - **reCAPTCHA v2 widget:**
    - "I'm not a robot" checkbox
  - **Upload button:** "Upload & Get Link" (enabled after file selected & CAPTCHA verified)

---

#### Page: Link Generated (After Upload)

- **Title:** File Uploaded Successfully!
- **Generated Link (highlighted, copyable field):**
  - Example: `https://securefileshare.com/download/a8f9s7d6f4g5h3j2`
  - Button: "Copy Link"
- **Expiration info (if set):**
  - "Expires after 3 downloads or 24 hours, whichever comes first."
- **Button:** "Upload Another File"

---

#### Page: File Download

- **Title:** Download Your File
- **File Info:**
  - Filename: example_document.pdf
  - File Size: 3.4 MB
- **Button:** "Download File"
- **Status (if applicable):**
  - "2 downloads remaining" and/or "Link expires in 5 hours"

# Rules
- All new components should go in /components and follow naming convention example-component.tsx unless otherwise specified
- All new pages should go in /app

# File Structure
webapp/
├── .next/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
├── lib/
│   └── utils.ts
├── node_modules/
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── requirements/
│   └── frontend_instructions.md
├── .gitignore
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json