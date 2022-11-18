import React from "react";
import ReactDOM from "react-dom";

import "./main-styles.scss";
import { setDefaultClient, Client } from "micro-graphql-react";

import App from "./App";

const { unstable_createRoot: createRoot } = ReactDOM;

const client = new Client({
  endpoint: "https://mylibrary.io/graphql-public",
  fetchOptions: { mode: "cors" },
});

setDefaultClient(client);

const rootElement = document.getElementById("root");

createRoot(rootElement).render(<App />);
