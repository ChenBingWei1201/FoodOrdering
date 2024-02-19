import { useAuth } from "@/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { session } = useAuth();
  if (session) {
    return <Redirect href="/" />; // automatically redirect to index when sign in successfully
  }
  return <Stack />;
}
