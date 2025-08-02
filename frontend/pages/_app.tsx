import type { AppProps } from "next/app";
import "../styles/globals.css";

import { AuthProvider } from "@/context/AuthContext";
import { SavedJobsProvider } from "@/context/SavedJobsContext";
import { AppliedJobsProvider } from "@/context/AppliedJobsContext"; // ✅ Import AppliedJobsProvider

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <SavedJobsProvider>
        <AppliedJobsProvider> 
          <Component {...pageProps} />
        </AppliedJobsProvider>
      </SavedJobsProvider>
    </AuthProvider>
  );
}
