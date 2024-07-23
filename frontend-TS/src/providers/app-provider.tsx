import { ReactNode, Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { BigSpinner } from "components/elements/spinner";
import { queryClient } from "../lib/react-query.ts";
import { QueryClientProvider } from "@tanstack/react-query";
import { MiradorStateProvider } from "./MiradorContext.tsx";

export const AppProvider = ({children}: {children: ReactNode}) => {
  return(
    <Suspense fallback={<BigSpinner/>}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <MiradorStateProvider>
            {children}
          </MiradorStateProvider>
        </Router>
      </QueryClientProvider>
    </Suspense>
  )
}
