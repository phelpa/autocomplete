
import * as React from "react";
import debounce from './debounce';

export default function App() {
  const [suggestions, setSuggestions] = React.useState([]);
  const abortController = React.useRef(new AbortController());

  const callApi = async (value: string) => {
    if (!value) return;

    abortController.current.abort(); //abort old request

    const controller = new AbortController(); //use new abortController for new request
    abortController.current = controller;

    try {
      const response = await fetch(`https://swapi.dev/api/people/?search=${encodeURIComponent(value)}`, {
        signal: controller.signal
      });
      const data = await response.json();
      const suggestions = data.results;
      setSuggestions(suggestions);

    } catch (error) {
      console.error("Error fetching data:", (error as Error).message);
    }

  };

  const debouncedCallApi = debounce(callApi, 200);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedCallApi(e.target.value);
  };

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <input onChange={onChange} />
      {suggestions?.map((item) => (
        <div key={item.name}>{item.name}</div>
      ))}
    </div>
  );
}
