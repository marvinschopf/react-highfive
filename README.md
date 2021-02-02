# React High Five 👋
`react-highfive` is a simple React ⚛️ component that can be used to integrate an animated high-five counter into a website.  

The counter is synchronised, so the number goes up for all users on the website at the same time when someone gives a high five! 👋

## Installation
Using npm:

```bash
npm install react-highfive
```

Using yarn:

```bash
yarn add react-highfive
```

## Usage
### Basic example

The following is a simple example that is **not synchronised** with any server.
```JSX
import React from "react";
import HighFive from "react-highfive";

export default function App() {
    return(
        <div className="App">
            <HighFive />
        </div>
    )
}
```

###  Example with synchronisation

```JSX
import React from "react";
import HighFive from "react-highfive";

export default function App() {
    return(
        <div className="App">
            <HighFive fetchUrl="http://localhost/get" updateUrl="http://localhost/update" />
        </div>
    )
}
```

### Example with custom position

```JSX
import React from "react";
import HighFive from "react-highfive";

export default function App() {
    return(
        <div className="App">
            <HighFive position={{horizontal: "right", vertical: "top"}} />
        </div>
    )
}
```

## Options
The following options can be passed as parameters to the HighFive object:

| Option                | Description                                              | Default  |
|-----------------------|----------------------------------------------------------|----------|
| `fetchUrl`            | URL to retrieve the current counter value                | `false`  |
| `updateUrl`           | URL to increase the counter value                        | `false`  |
| `refreshRate`         | Frequency in miliseconds at which the counter is updated | `1000`   |
| `position`            | Determines the position of the snack bar                 | `-`      |
| `position.horizontal` | `"right" \| "left" \| "center"`                          | `right`  |
| `position.vertical`   | `"bottom" \| "top"`                                      | `bottom` |
