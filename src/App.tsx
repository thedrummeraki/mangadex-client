import {
  APIProvider,
  RootProvider,
  WithLayoutProvider,
} from "config/providers";
import { AppRouter } from "routes";

function App() {
  return (
    <RootProvider>
      <APIProvider>
        <WithLayoutProvider>
          <AppRouter />
        </WithLayoutProvider>
      </APIProvider>
    </RootProvider>
  );
}

export default App;
