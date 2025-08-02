import type { AppProps } from "next/app";
import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { SavedJobsProvider } from "@/context/SavedJobsContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <SavedJobsProvider>
        <Component {...pageProps} />
      </SavedJobsProvider>
    </AuthProvider>
  );
}
