import React from "react";
import {
  BarChart3,
  Users,
  Settings,
  Shield,
  Database,
  Activity,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardHome() {
  const features = [
    {
      icon: <BarChart3 className='w-6 h-6 text-white' />,
      title: "Analytics & Reports",
      description:
        "Comprehensive data visualization and reporting tools to track your business metrics and performance indicators.",
    },
    {
      icon: <Users className='w-6 h-6 text-white' />,
      title: "User Management",
      description:
        "Complete user administration with role-based access control, permissions, and activity monitoring.",
    },
    {
      icon: <Database className='w-6 h-6 text-white' />,
      title: "Data Management",
      description:
        "Centralized data storage and management with backup, security, and easy data export capabilities.",
    },
    {
      icon: <Settings className='w-6 h-6 text-white' />,
      title: "System Settings",
      description:
        "Full system configuration and customization options to tailor the dashboard to your needs.",
    },
    {
      icon: <Shield className='w-6 h-6 text-white' />,
      title: "Security & Compliance",
      description:
        "Advanced security features with audit logs, compliance tracking, and data protection protocols.",
    },
    {
      icon: <Activity className='w-6 h-6 text-white' />,
      title: "Real-time Monitoring",
      description:
        "Live system monitoring with alerts, notifications, and performance tracking dashboards.",
    },
  ];

  // const stats = [
  //   { label: "Active Users", value: "2,847", change: "+12%" },
  //   { label: "Total Revenue", value: "$45,231", change: "+8%" },
  //   { label: "System Uptime", value: "99.9%", change: "+0.1%" },
  //   { label: "Data Processed", value: "1.2TB", change: "+15%" },
  // ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden'>
      {/* Background Elements */}
      <div className='absolute inset-0'>
        <div className='absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse'></div>
        <div className='absolute top-40 right-20 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000'></div>
        <div className='absolute bottom-20 left-1/2 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000'></div>
      </div>

      {/* Navigation */}
      <nav className='relative z-20 p-6'>
        <div className='flex justify-between items-center max-w-7xl mx-auto'>
          <div className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center'>
              <BarChart3 className='w-5 h-5 text-white' />
            </div>
            <span className='text-xl font-bold text-white'>AdminFlow</span>
          </div>
          <Link
            href='/login'
            className='bg-white/10 backdrop-blur-lg border border-white/20 text-white px-6 py-2 rounded-lg hover:bg-white/20 transition-all duration-200'
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className='relative z-10 px-6'>
        {/* Hero Section */}
        <div className='max-w-6xl mx-auto text-center py-20'>
          <h1 className='text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight'>
            Admin
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 ml-2'>
              Dashboard
            </span>
          </h1>

          <p className='text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed'>
            Powerful administrative control panel for managing your business
            operations, users, data, and system settings all in one centralized
            platform.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <Link
              href='/login'
              className='inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group'
            >
              Access Dashboard
              <ArrowRight className='w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform' />
            </Link>
          </div>

          {/* Stats Section */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
              >
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-300 mb-1">{stat.label}</div>
                <div className="text-xs text-green-400">{stat.change}</div>
              </div>
            ))}
          </div> */}
        </div>

        {/* Features Section */}
        <div className='max-w-6xl mx-auto pb-20'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
              Complete Admin Solution
            </h2>
            <p className='text-lg text-gray-300 max-w-2xl mx-auto'>
              Everything you need to manage your business operations effectively
              with powerful tools and intuitive interfaces.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {features.map((feature, index) => (
              <div
                key={index}
                className='bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200 group'
              >
                <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200'>
                  {feature.icon}
                </div>
                <h3 className='text-lg font-semibold text-white mb-3'>
                  {feature.title}
                </h3>
                <p className='text-gray-300 text-sm leading-relaxed'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className='max-w-4xl mx-auto text-center pb-20'>
          <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20'>
            <h3 className='text-2xl md:text-3xl font-bold text-white mb-4'>
              Ready to Get Started?
            </h3>
            <p className='text-gray-300 mb-6 max-w-2xl mx-auto'>
              Take control of your business operations with our comprehensive
              admin dashboard. Start managing your data, users, and systems more
              effectively today.
            </p>
            <Link
              href='/login'
              className='inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group'
            >
              Launch Dashboard
              <ArrowRight className='w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform' />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className='relative z-10 border-t border-white/10 py-8 mt-20'>
        <div className='max-w-6xl mx-auto px-6'>
          <div className='flex justify-center items-center'>
            <div className='flex items-center space-x-2 mb-4 md:mb-0'>
              <div className='w-6 h-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded flex items-center justify-center'>
                <BarChart3 className='w-4 h-4 text-white' />
              </div>
              <span className='text-white font-semibold'>AdminFlow</span>
            </div>
          </div>
          <div className='text-center mt-6 pt-6 border-t border-white/10'>
            <p className='text-gray-400 text-sm'>
              © 2025 AdminFlow. All rights reserved. Built for administrators
              who demand excellence.
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll Indicator */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20'>
        <div className='animate-bounce'>
          <ChevronDown className='w-6 h-6 text-white/50' />
        </div>
      </div>
    </div>
  );
}
