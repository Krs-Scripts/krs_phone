
# 📱 KRS PHONE

[![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)

Welcome to the official repository of the **KRS Phone**! 
This project is released as a **free open-source foundation**, allowing developers and server owners to start building, customizing, and developing their own version of the phone for FiveM.

## ✨ Features
- 🎥 **PREVIEW:** [Showcase](https://streamable.com/fdelql)
- 🎨 **Ready-to-use interface**
- ⚙️ **Fully functional settings system** (Dark mode, Wallpaper, Airplane mode, Ringtone selection, etc.)
- 🎵 **iOS-style notification sounds already included**
- 🔓 **Completely free and open-source project**

## 🛠️ Supported Frameworks
The phone is designed to be easily adaptable and supports the following frameworks out of the box via the included bridge:
- **ESX**
- **QB-Core**
- **QBX (Qbox)**

## 📦 Installation & Development

To get the phone working on your server, you need to install the Node.js dependencies and build the UI.

1. Download or clone this repository into your `resources` folder.
2. Open your terminal and navigate to the web folder (e.g., `cd web` or `cd ui`).
3. Install the required modules:
```bash
npm install

```

- Web Development Mode
If you want to edit the UI and see the changes live in your web browser, run:

```bash
npm run dev

```

- Production Build (For FiveM)
Before starting your server, you must build the UI for production. Run this command every time you make changes to the React code:

```bash
npm run build

```

4. Add `ensure krs_phone` to your `server.cfg`.
5. Start your server and enjoy! *(The database tables will be created automatically upon starting).*

## 🚧 Current State (Early Release)

Please keep in mind that this is an **early release**. Some features and apps are not yet fully connected or completed. However, it provides a very solid and clean starting point for anyone who wants to expand it and bring their own ideas to life.

## ⚠️ License & Credits Policy

This project is built with passion and shared freely with the community. You are completely free to download, use, and modify the code for your servers.

**However, if you plan to publish, release, or distribute a modified version / fork of this phone, YOU MUST GIVE PROPER CREDITS.** It is strictly required to explicitly credit **KRS** as the original creator of the foundation and include a link back to this repository in your release post/documentation. Respecting the work of others is the foundation of a healthy open-source community!

Thank you all for the support, and I can't wait to see what you'll create with it!


<img width="1672" height="941" alt="krs_phone2" src="https://github.com/user-attachments/assets/351d0ec6-349c-4d60-aec3-5c3735079b41" />


<img width="1919" height="1079" alt="Screenshot 2026-05-29 090003" src="https://github.com/user-attachments/assets/023b7c98-1e12-47c8-97ff-5d67a4224e48" />


<img width="1919" height="1079" alt="Screenshot 2026-05-29 090029" src="https://github.com/user-attachments/assets/43284b1b-027f-4a3a-afbe-47962fff31ff" />


<img width="1919" height="1079" alt="Screenshot 2026-05-29 134231" src="https://github.com/user-attachments/assets/d73c11fd-62d5-4429-81f2-e24179eee4f4" />
