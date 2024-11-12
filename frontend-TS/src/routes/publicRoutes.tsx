import { AuthRoutes } from "../features/auth/routes";
import { MiradorPublicExposed } from "../features/mirador/MIradorPublicExposed.tsx";
import { MailConfirmation } from "../features/auth/components/MailConfirmation.tsx";

export const publicRoutes= [
  {
    path: "/auth/*",
    element: <AuthRoutes />
  },
  {
    path:"/mirador/*",
    element:<MiradorPublicExposed/>
  },
  {
    path:"/token/*",
    element:<MailConfirmation/>
  }
]
