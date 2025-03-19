import React from 'react';
import { Activity, LineChart, Dumbbell, DollarSign, Trophy, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <Activity className="h-8 w-8 text-blue-500" />
            <span className="ml-2 text-xl font-bold">TotalFit</span>
          </div>
          
          {user ? (
            <>
              <div className="hidden md:flex items-center space-x-8">
                <NavLink 
                  icon={<LineChart className="h-5 w-5" />} 
                  text="Analytics" 
                  onClick={() => navigate('/analytics')}
                  active={location.pathname === '/analytics'}
                />
                <NavLink 
                  icon={<Dumbbell className="h-5 w-5" />} 
                  text="Training" 
                  onClick={() => navigate('/dashboard')}
                  active={location.pathname === '/dashboard'}
                />
                <NavLink 
                  icon={<DollarSign className="h-5 w-5" />} 
                  text="Finance" 
                  onClick={() => navigate('/dashboard')}
                  active={false}
                />
                <NavLink 
                  icon={<Trophy className="h-5 w-5" />} 
                  text="Career" 
                  onClick={() => navigate('/dashboard')}
                  active={false}
                />
              </div>

              <button 
                onClick={handleSignOut}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/signin')}
                className="text-gray-300 hover:text-white px-4 py-2"
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ 
  icon, 
  text, 
  onClick,
  active
}: { 
  icon: React.ReactNode; 
  text: string;
  onClick: () => void;
  active: boolean;
}) => (
  <button 
    onClick={onClick} 
    className={`flex items-center ${
      active ? 'text-blue-500' : 'text-gray-300 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-2">{text}</span>
  </button>
);

export default Navbar;