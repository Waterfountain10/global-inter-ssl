# Global Interiors Web App

This is the interactive React-based web experience for the Global Interiors project (MIT Senseable Lab).

---

## 1. What is this?

- **Frontend framework:** React (Create React App)
- **Purpose:** Displays interactive world maps, research questions, and credits with scroll-based transitions.
- **Deployment:** MIT’s internal server (`senseable.mit.edu`) via `manager.py`.

---

## 2. Prerequisites

You will need:

- **MIT Secure Wi-Fi** (required for SSH to the lab server)
- **Node.js + npm** installed (for local testing)
- **Git** (optional, if pulling from a repo rather than zip)
- **Server access credentials** (provided: `fduarte@senseable.mit.edu`)

### How to check prerequisites

```bash
node -v   # should print something like v20.x.x
npm -v    # should print something like 10.x.x
ssh fduarte@senseable.mit.edu  # should prompt for password
```

If `npm` is missing:
- Install via [Node.js LTS](https://nodejs.org/) or Homebrew (`brew install node`).

---

## 3. Local Setup (Testing on Your Computer)

### 1. Extract project
If you received a zip, unzip it somewhere (e.g., Desktop).

### 2. Open Terminal and navigate to folder
```bash
cd ~/Documents/personal-coding/globalinteriors-main
```

### 3. Install dependencies
```bash
npm install
```

### 4. Start local dev server
```bash
npm start
```
- Opens [http://localhost:3000](http://localhost:3000) in your browser.
- Updates auto-reload as you change files.

---

## 4. Building for Production

Before deploying to MIT server, you must build the static files:

```bash
npm run build
```

This creates a `build/` folder containing:
```
index.html
assets/
static/
...
```

---

## 5. Deploying to MIT Server

> **Important:** MIT server expects `index.html` at root (not inside `/public` or `/build`).

### Steps

1. **Connect to MIT Secure Wi-Fi**

2. **SSH into server**
```bash
ssh fduarte@senseable.mit.edu
```
Password: `Senseable@77`

3. **Run deployment manager**
```bash
cd /home/deployer/
sudo ./manager.py
```
Password again: `Senseable@77`

4. **Select option to add repo**
- Press `1`
- Enter repo name (e.g., `global-interiors`)
- Enter URL (can leave blank if uploading manually)
- Press Enter

5. **Upload build files**
On your local machine (NOT in SSH session):

```bash
scp -r build/* fduarte@senseable.mit.edu:/home/deployer/global-interiors/
```

This copies everything inside `build/` (including `index.html`) to the server folder.

6. **Verify**
- Visit the lab’s internal URL for the project
- Confirm `index.html` loads and assets appear correctly

---

## 6. Folder Structure (Simplified)

```
src/
  Views/
    Home/
    Map1/
    Map2/
    ...
  components/
  config/
public/
  assets/images/
  assets/videos/
```

- **`public/assets/`**: All static images/videos
- **`src/Views/`**: Each map or page is its own folder (CSS + JS together)

---

## 7. Common Issues

### **npm: command not found**
- Install Node.js: `brew install node` (macOS) or download from [nodejs.org](https://nodejs.org)

### **Wrong import paths**
- Always use `./Views/...` or enable absolute imports via `jsconfig.json`.

### **index.html not found on server**
- Make sure you uploaded files from `build/`, not `public/`.

### **Permission denied when running manager.py**
- Use `sudo ./manager.py` and enter provided password.

---

## 8. Notes

- Do **NOT** push to MIT GitHub — only deploy via `manager.py` and `scp`.
- If updating code, always run `npm run build` before uploading.
- Only modify files inside `src/` or `public/assets/`.

---

## 9. Quick Commands (Cheat Sheet)

### Local test
```bash
npm install
npm start
```

### Build for deploy
```bash
npm run build
```

### Upload to server
```bash
scp -r build/* fduarte@senseable.mit.edu:/home/deployer/global-interiors/
```

---

## 10. Contacts

For credentials or server issues: **[Lab contact / supervisor]**

For code-related questions: **[Your name]**
