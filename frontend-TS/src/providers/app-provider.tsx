import { ReactNode, Suspense } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import { BigSpinner } from 'components/spinner.tsx';

export const AppProvider = ({children}: {children: ReactNode}) => {
  return(
    <Suspense fallback={<BigSpinner/>}>
      <Router>
        {children}
      </Router>
    </Suspense>
  )
}
