import "./App.css";

import store from "./redux/store";
import { Provider } from "react-redux";

import AppRouter from "./components/AppRouter";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import ENDPOINTS from "./utils/constants/endpoints";

const client = new ApolloClient({
  uri: ENDPOINTS.GQL,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <div className="App">
          <AppRouter />
        </div>
      </Provider>
    </ApolloProvider>
  );
}

export default App;
