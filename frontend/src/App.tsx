import "./App.css";

import store from "./redux/store";
import { Provider } from "react-redux";

import AppRouter from "./components/AppRouter";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <AppRouter />
      </div>
    </Provider>
  );
}

export default App;
