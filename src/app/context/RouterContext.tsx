import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType | null>(null);

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname + window.location.search;
    }
    return '/';
  });

  const navigate = useCallback((path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const params = extractParams(currentPath);

  return (
    <RouterContext.Provider value={{ currentPath, navigate, params }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useNavigate() {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useNavigate must be used within RouterProvider');
  return context.navigate;
}

export function useLocation() {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useLocation must be used within RouterProvider');
  return { pathname: context.currentPath };
}

export function useParams() {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useParams must be used within RouterProvider');
  return context.params;
}

function extractParams(path: string): Record<string, string> {
  const params: Record<string, string> = {};
  
  // Extract route params (e.g., /tenders/123 -> { tenderId: '123' })
  const tenderMatch = path.match(/\/tenders\/(?:edit\/)?([^/]+)(?:\/|$)/);
  if (tenderMatch && tenderMatch[1] !== 'create') params.tenderId = tenderMatch[1];
  
  const proposalMatch = path.match(/\/proposals\/([^/]+)(?:\/|$)/);
  if (proposalMatch) params.proposalId = proposalMatch[1];
  
  const itemMatch = path.match(/\/items\/([^/]+)(?:\/|$)/);
  if (itemMatch) params.proposalId = itemMatch[1];
  
  const vendorMatch = path.match(/\/vendors\/([^/]+)(?:\/|$)/);
  if (vendorMatch) params.vendorId = vendorMatch[1];
  
  return params;
}

interface LinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Link({ to, children, className, style }: LinkProps) {
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to);
  };
  
  return (
    <a href={to} onClick={handleClick} className={className} style={style}>
      {children}
    </a>
  );
}
