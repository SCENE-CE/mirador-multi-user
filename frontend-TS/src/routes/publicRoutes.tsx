import { AuthRoutes } from "../features/auth/routes";

export const publicRoutes= [
  {
    path: "/auth/*",
    element: <AuthRoutes />
  }
]
