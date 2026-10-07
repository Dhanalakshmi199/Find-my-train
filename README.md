# Find My Train 🚆

**Find My Train** is a React web application designed to track live train locations, search trains between stations, and view detailed train schedules across the Indian Railways network.

---

## ✨ Features

- **📍 Spot My Train**: Track real-time live location, arrival, and departure timings for any train using RapidAPI IRCTC service. Includes voice broadcast support for live train status and delay updates.
- **🚉 Trains Between Stations**: Search trains running between source and destination stations, calculate accurate journey duration and day-wise schedules.
- **🕒 Train's Schedule**: Complete route schedules including station stops, arrival/departure timings, halt times, and distances.
- **🔐 Authentication**: Firebase Email & Password authentication for secure access.
- **📱 Responsive UI**: Interactive interface styled with CSS animations and Material-UI icons.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router v6, Material-UI Icons, Axios
- **Backend / Services**: Firebase Auth, RapidAPI (IRCTC API)
- **Deployment**: Vercel / Netlify / GitHub Pages

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Dhanalakshmi199/Find-my-train.git
   cd Find-my-train
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🌐 Deployment

The project is preconfigured for deployment on **Vercel** via `vercel.json`:
1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. The build command `npm run build` and output directory `build` will automatically deploy.
