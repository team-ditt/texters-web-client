import * as React from "react";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter} from "react-router-dom";

import Router from "@/Router";
import {MobileAppBar} from "@/components";

const queryClient = new QueryClient();

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="main">
            <MobileViewBackground type="left" />
            <RouterContainer>
              <MobileAppBar />
              <Router />
            </RouterContainer>
            <MobileViewBackground type="right" />
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

function MobileViewBackground({type}: {type: "left" | "right"}) {
  const [width, setWidth] = React.useState(Math.max((window.innerWidth - 850) / 2, 0));
  const position = type === "left" ? "left-0" : "right-0";

  React.useEffect(() => {
    function handleResize() {
      setWidth(Math.max((window.innerWidth - 850) / 2, 0));
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`absolute ${position} right-auto h-full bg-[#ECEDED] z-[9999]`}
      style={{width}}
    />
  );
}

function RouterContainer({children}: {children: React.ReactNode}) {
  return (
    <div className="absolute left-0 top-0 w-full h-full flex flex-col items-center">{children}</div>
  );
}

export default App;
