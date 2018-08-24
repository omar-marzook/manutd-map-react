import React from "react";
import ReactDOM from "react-dom";
import MapApp from "./App";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<MapApp />, document.getElementById("root"));
registerServiceWorker();
