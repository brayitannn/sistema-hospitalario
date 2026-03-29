import { redirect } from "next/navigation";
const PUBLIC_PATHS = ["/login", "/registro", "/"];

export default function RootPage() {
  redirect("/dashboard");
}