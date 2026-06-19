# To-Do List Ecosystem — Ionic/Angular Enterprise Challenge
> **Candidate:** Paola Ramírez  

---

## 📑 Executive Overview

This repository houses a high-performance, reactive, and Cloud-connected hybrid mobile application built using **Ionic Standalone Components** and **Angular 17+**. 

The solution refactors a legacy monolithic task manager into a modern, decoupled ecosystem driven by **RxJS State Management Streams**, client-side secure persistence, dynamic styling, and cloud-controlled **Firebase Remote Config Feature Flags**.

### Key Architectural Pillars
1. **Reactive State Management:** Zero local component mutations; full reliance on Unidirectional Data Flow (UDF) via RxJS.
2. **Cloud-Driven Feature Flags:** Dynamic feature toggling via real-time Firebase Remote Config synchronization with proactive fallback handling.
3. **Enterprise UI/UX Patterns:** Native mobile gestures (sliding actions), real-time contextual feedback, and accessibility-compliant color picking.
4. **Capacitor Hybrid Bridge:** Modern runtime container replacing legacy Cordova for optimal native performance and streamlined dependency management.

---

## 🛠️ Local Installation & Development Environment Setup

### 1. Prerequisites
Ensure your development workstation meets the following baseline requirements:
- **Node.js:** Core v18.x.x or v20.x.x (LTS recommended)
- **NPM:** v9.x.x or superior
- **Ionic CLI:** v7.x.x (`npm install -g @ionic/cli`)
- **Android SDK:** Platform-tools API 33+ (Required for native compilation)

### 2. Quickstart Commands
Execute the following sequence in your terminal to initialize and preview the application:

```bash
# Clone the repository structure
git clone [https://github.com/Paolaramirez2021/app-ionic-accenture.git](https://github.com/Paolaramirez2021/app-ionic-accenture.git)
cd app-ionic-accenture

# Install enterprise dependencies & peer-dependency matching
npm install

# Initialize the local development live-reload server
ionic serve