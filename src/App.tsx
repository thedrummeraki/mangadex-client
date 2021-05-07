import { APIProvider, AppProvider } from "config/providers";
import { AppRouter } from "routes";

function App() {
  return (
    <AppProvider>
      <APIProvider>
        <AppRouter />
      </APIProvider>
    </AppProvider>
  );
}

export default App;
