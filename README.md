# TorreDex  

A modern React application inspired by the **Pokédex**, built to explore Torre’s professional network. Search, analyze, and discover talent in a fun, interactive way.  

## 🚀 Features  

- **Real-time Search** – Quickly find professionals across Torre’s network  
- **Skill Insights** – Visualize trending skills with interactive charts  
- **Profile Explorer** – View detailed information about experience, skills, and education  
- **Modern UI/UX** – Responsive design, smooth transitions, and polished layouts  
- **Export & Share** – Save or share search results in one click  
- **Quick Actions** – Floating action button for easy navigation  

## 🛠 Tech Stack  

- **Frontend**: React 18 + Vite  
- **Styling**: Tailwind CSS v4.0  
- **Animations**: Framer Motion  
- **Icons**: Lucide React  
- **HTTP Client**: Axios  
- **Build Tool**: Vite  

## 🔧 Installation & Setup  

1. **Clone the repository**  
   ```bash
   git clone <repository-url>
   cd torredex
   ```  

2. **Install dependencies**  
   ```bash
   npm install
   ```  

3. **Start development server**  
   ```bash
   npm run dev
   ```  

4. **Build for production**  
   ```bash
   npm run build
   ```  

5. **Preview production build**  
   ```bash
   npm run preview
   ```  

## 🌐 API Integration  

TorreDex integrates with Torre’s official APIs to fetch profiles, skills, and professional data.  
The architecture is modular, with service files handling API calls separately from UI components.  

## 🎨 Design Highlights  

- **Modern Components**: Responsive grids, cards, and modals  
- **Interactive Animations**: Smooth transitions, staggered cards, and hover effects  
- **Accessibility**: Screen reader friendly, keyboard navigation, ARIA support  
- **User Feedback**: Toast notifications, loading skeletons, and clear error states  

## 📊 Skills & Data Analysis  

- **Trending Skills** – Discover most common skills in search results  
- **Strength Breakdown** – Compare professional strengths visually  
- **Exportable Insights** – Download analysis data in JSON format  

## 🚀 Deployment  

Production-ready for static hosting:  

- **Vercel** → `vercel --prod`  
- **Netlify** → Upload `dist` folder  
- **GitHub Pages** → Deploy via Actions  

## 🔍 Usage Guide  

1. **Search** – Enter a skill or name in the search bar  
2. **Browse** – Explore professionals in grid layout  
3. **Profiles** – Open detailed views of individuals  
4. **Analyze** – Use charts to visualize skills  
5. **Export & Share** – Save results and share easily  

## 🎯 Key Features  

- Interactive skills visualization  
- Floating action button with quick tools  
- Debounced real-time search  
- Responsive, mobile-friendly design  
- Error handling with graceful fallbacks  

## 📝 Development Notes  

- **Code Quality**: ESLint + component-driven architecture  
- **Performance**: Lazy loading, debouncing, tree shaking  
- **State Management**: Custom hooks for reusable logic  
- **Error Handling**: Graceful UI for empty/error states  

---

## 🤖 LLM/AI Usage  

During development, multiple AI tools were used for ideation, code assistance, and UI polish:  

- **Claude 3.5 Sonnet** – Helped structure API integration and suggest data models  
- **ChatGPT (GPT-5)** – Provided UI/UX suggestions, React hook patterns, and debugging help  
- **Qoder** – Assisted in auto-generating TypeScript types from API responses  
- **Cursor** – Streamlined pair-programming experience, especially for refactoring components  

### Example Prompts Used  

- “Suggest a React component structure for displaying professional profiles in a grid with filters.”  
- “Generate a responsive Tailwind layout with a floating action button and expandable menu.”  
- “What’s the best way to implement debounced search with Axios in React + Vite?”  
- “Design a clean chart layout to visualize top 5 trending skills using Recharts.”  
- “Help debug a CORS issue when fetching Torre API data in development.”  
- “Show an example of error handling UI when the API returns no results.”  
- “Optimize lazy loading in Vite so that large profile datasets don’t slow down initial load.”  

---

## 📄 License  

This project was built as part of a **technical test for Torre Engineering**.  

---  
Built with ❤️ using React, Vite, Tailwind CSS, and Torre API.  
