import * as React from "react";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter} from "react-router-dom";

import Router from "@/Router";

const queryClient = new QueryClient();

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="main">
            <MobileViewBackground />
            <RouterContainer>
              <Router />
            </RouterContainer>
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

function MobileViewBackground() {
  return <div className="absolute left-auto right-auto w-full max-w-[850px] h-full bg-white" />;
}

function RouterContainer({children}: {children: React.ReactNode}) {
  return <div className="absolute left-0 top-0 w-full h-full flex justify-center">{children}</div>;
}

export default App;
