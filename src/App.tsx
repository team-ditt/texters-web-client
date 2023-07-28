import * as React from "react";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter} from "react-router-dom";

import {MobileAppBar, Modal} from "@/components";
import {Router} from "@/Router";
import {useAuthStore} from "@/stores";

const queryClient = new QueryClient();

function App() {
  const {isSessionExpired, removeToken, resolveExpiredSession} = useAuthStore();

  const onRequestSignIn = () => {
    removeToken();
    resolveExpiredSession();
    window.location.href = "/sign-in";
  };

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
          <Modal.Alert
            isOpen={isSessionExpired}
            title="세션이 만료되었어요"
            message="로그인 페이지로 이동할게요!"
            onRequestClose={onRequestSignIn}
            shouldCloseOnOverlayClick={false}
            shouldCloseOnEsc={false}
          />
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
