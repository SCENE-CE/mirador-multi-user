import { AuthRoutes } from "../features/auth/routes";
import { MiradorPublicExposed } from "../features/mirador/MIradorPublicExposed.tsx";

export const publicRoutes= [
  {
    path: "/auth/*",
    element: <AuthRoutes />
  },
  {
    path:"/mirador/*",
    element:<MiradorPublicExposed/>
  }
]
