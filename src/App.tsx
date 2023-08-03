import * as React from "react";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter} from "react-router-dom";

import {MobileAppBar} from "@/components";
import {Router} from "@/Router";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="main">
          <MobileViewBackground />
          <RouterContainer>
            <MobileAppBar />
            <Router />
          </RouterContainer>
          <MobileViewBackground />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function MobileViewBackground() {
  const [width, setWidth] = React.useState(Math.max((window.innerWidth - 850) / 2, 0));

  React.useEffect(() => {
    function handleResize() {
      setWidth(Math.max((window.innerWidth - 850) / 2, 0));
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <div className={`bg-[#ECEDED] z-[9999]`} style={{width}} />;
}

function RouterContainer({children}: {children: React.ReactNode}) {
  return (
    <div className="w-full max-w-[850px] flex flex-col items-center overflow-x-auto">
      {children}
    </div>
  );
}

export default App;
