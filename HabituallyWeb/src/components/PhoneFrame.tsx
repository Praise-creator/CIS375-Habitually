import { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
  theme: 'light' | 'dark';
}

export function PhoneFrame({ children, theme }: PhoneFrameProps) {
  return (
    <div className="relative">
      {/* iPhone Frame */}
      <div className="w-[375px] h-[812px] bg-black rounded-[55px] p-3 shadow-2xl">
        {/* Screen */}
        <div className="w-full h-full bg-white rounded-[45px] overflow-hidden relative">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[180px] h-[30px] bg-black rounded-b-3xl z-50" />
          
          {/* Content */}
          <div className={`w-full h-full overflow-y-auto ${theme === 'dark' ? 'bg-neutral-900' : 'bg-white'}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
