import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SweetShop } from "./routes/sweet-shop";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SweetShop />
    </QueryClientProvider>
  );
}
