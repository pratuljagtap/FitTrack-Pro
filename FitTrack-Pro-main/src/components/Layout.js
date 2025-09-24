import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Dumbbell,
  TrendingUp,
  BookOpen,
  Target,
  User,
  Menu,
} from "lucide-react";
import { createPageUrl } from "./utils";

// Simple UI Components (since we don't have shadcn/ui installed)
const Sidebar = ({ className, children }) => (
  <div className={`${className}`}>{children}</div>
);

const SidebarContent = ({ className, children }) => (
  <div className={`${className}`}>{children}</div>
);

const SidebarHeader = ({ className, children }) => (
  <div className={`${className}`}>{children}</div>
);

const SidebarFooter = ({ className, children }) => (
  <div className={`${className}`}>{children}</div>
);

const SidebarProvider = ({ children }) => (
  <div className="sidebar-provider">{children}</div>
);

const SidebarTrigger = ({ className, ...props }) => (
  <button className={`${className}`} {...props}>
    <Menu className="w-5 h-5" />
  </button>
);

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: Home,
  },
  {
    title: "Workouts",
    url: createPageUrl("Workouts"),
    icon: Dumbbell,
  },
  {
    title: "Progress",
    url: createPageUrl("Progress"),
    icon: TrendingUp,
  },
  {
    title: "Exercises",
    url: createPageUrl("Exercises"),
    icon: BookOpen,
  },
  {
    title: "Goals",
    url: createPageUrl("Goals"),
    icon: Target,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <style>
          {`
            :root {
              --primary: 212 97% 45%;
              --primary-foreground: 0 0% 100%;
              --secondary: 142 76% 36%;
              --secondary-foreground: 0 0% 100%;
              --accent: 210 40% 98%;
              --accent-foreground: 212 97% 45%;
              --muted: 210 40% 96%;
              --muted-foreground: 215 16% 46%;
              --border: 214 32% 91%;
              --card: 0 0% 100%;
              --card-foreground: 222 84% 5%;
            }
            
            .gradient-bg {
              background: linear-gradient(135deg, #1e40af 0%, #059669 100%);
            }
            
            .glass-card {
              background: rgba(255, 255, 255, 0.95);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
          `}
        </style>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar
          className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 
          fixed md:static 
          z-50 md:z-auto
          w-64 bg-white 
          border-r border-gray-100 
          shadow-lg 
          transition-transform duration-300 ease-in-out
        `}
        >
          <SidebarHeader className="border-b border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-gray-900">FitTracker</h2>
                <p className="text-sm text-gray-500">Your fitness journey</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-2 flex-1">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg mb-1
                    hover:bg-blue-50 hover:text-blue-700 
                    transition-all duration-200
                    ${
                      location.pathname === item.url
                        ? "bg-blue-50 text-blue-700 shadow-sm font-medium"
                        : "text-gray-700 hover:text-blue-700"
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
            </div>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">
                  Athlete
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Keep pushing limits!
                </p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col bg-gray-50 md:ml-0">
          <header className="bg-white border-b border-gray-100 px-6 py-4 md:hidden shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger
                className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              />
              <h1 className="text-xl font-bold gradient-bg bg-clip-text text-transparent">
                FitTracker
              </h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
