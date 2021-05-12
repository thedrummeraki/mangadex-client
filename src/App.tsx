import { APIProvider, RootProvider } from "config/providers";
import { AppRouter } from "routes";

function App() {
  return (
    <RootProvider>
      <APIProvider>
        <AppRouter />
      </APIProvider>
    </RootProvider>
  );
}

export default App;
