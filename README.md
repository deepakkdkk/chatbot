# AI Chatbot - Modular Architecture

A modern, modular AI chatbot built with Next.js 15, React 19, TypeScript, and Google's Gemini AI. Features real-time streaming responses and user authentication.

## 🚀 Features

- **Real-time Streaming**: AI responses appear as they're generated
- **User Authentication**: Login, signup, and profile management
- **Modular Architecture**: Clean, scalable component structure
- **Responsive Design**: Works on desktop and mobile
- **Dark Mode Support**: Automatic theme switching
- **TypeScript**: Full type safety
- **Modern UI**: Clean, intuitive interface

## 🏗️ Project Structure

```
chatbot/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── chat/route.ts         # Chat API with streaming
│   ├── layout.tsx                # Root layout with auth provider
│   ├── page.tsx                  # Main page (minimal)
│   └── globals.css               # Global styles
├── components/                   # Modular components
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx            # Button component
│   │   └── MenuButton.tsx        # Hamburger menu button
│   ├── layout/                   # Layout components
│   │   ├── MainLayout.tsx        # Main layout with header
│   │   └── Sidebar.tsx           # Authentication sidebar
│   └── chat/                     # Chat-specific components
│       └── ChatInterface.tsx     # Chat interface component
├── contexts/                     # React contexts
│   └── AuthContext.tsx           # Authentication context
├── lib/                          # Utility libraries
│   ├── genai.ts                  # Google AI integration
│   └── logtail.ts                # Logging configuration
└── public/                       # Static assets
```

## 🎯 Key Components

### **MainLayout**
- Header with menu button and user info
- Responsive design
- Sidebar integration

### **Sidebar**
- User authentication (login/signup)
- Profile management
- Tabbed interface
- Error handling

### **ChatInterface**
- Real-time streaming responses
- Message history
- Markdown rendering
- Auto-scroll
- Loading states

### **AuthContext**
- User state management
- Login/signup functions
- Session persistence
- Loading states

## 🛠️ Technology Stack

- **Framework**: Next.js 15.4.2
- **React**: 19.1.0
- **Language**: TypeScript 5
- **AI**: Google GenAI (Gemini 2.5 Flash)
- **Styling**: CSS Modules
- **Logging**: Logtail
- **Authentication**: Custom context (ready for backend integration)

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   # .env.local
   GENAI_API_KEY=your_google_ai_key
   LOGTAIL_TOKEN=your_logtail_token
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   ```
   http://localhost:3000
   ```

## 📱 Usage

### **Chat Interface**
- Type messages in the input field
- Press Enter or click Send
- Watch AI responses stream in real-time
- Messages support markdown formatting

### **Authentication**
- Click the hamburger menu (☰) in the top-left
- Choose Login or Sign Up
- Fill in your details
- Access your profile and settings

### **Features**
- **Streaming Responses**: No waiting for complete responses
- **Message History**: View all conversation history
- **Responsive Design**: Works on all screen sizes
- **Dark Mode**: Automatic theme switching
- **Error Handling**: Graceful fallbacks

## 🔧 Development

### **Adding New Components**
1. Create component in appropriate directory
2. Add TypeScript interfaces
3. Create CSS module
4. Export from index file (if needed)

### **Styling Guidelines**
- Use CSS Modules for component-specific styles
- Follow CSS custom properties for theming
- Support dark mode with media queries
- Mobile-first responsive design

### **State Management**
- Use React Context for global state (auth, theme)
- Use local state for component-specific data
- Keep components focused and single-purpose

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### **Other Platforms**
1. Build the project: `npm run build`
2. Start production server: `npm start`
3. Set environment variables

## 🔮 Future Enhancements

- [ ] Backend authentication (NextAuth.js, Auth0)
- [ ] Database integration (PostgreSQL, MongoDB)
- [ ] Message persistence
- [ ] User preferences
- [ ] Conversation history
- [ ] File uploads
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Advanced AI models
- [ ] Analytics dashboard

## 📄 License

MIT License - feel free to use this project for your own applications.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

Built with ❤️ using Next.js and React
