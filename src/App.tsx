
import * as React from "react";
import debounce from './debounce';
import styles from "./styles.module.css";

type Suggestion = {
  name: string;
}

export default function App() {
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const abortController = React.useRef(new AbortController());

  const apiCall = async (value: string) => {
    if (!value) {
      setSuggestions([]);
      return;
    }

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

  const debouncedApiCall = debounce(apiCall, 200);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedApiCall(e.target.value);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '320px' }}>
        <h2>Type a Starwar Character</h2>

        <div>
          <input className={styles.input} onChange={onChange} />

          {!!suggestions.length && <div className={styles.dropdown}>
            {suggestions?.map((item) => (
              <div className={styles.dropdownItem} key={item.name}>{item.name}</div>
            ))}
          </div>}
        </div>
      </div>
    </div>
  );
}
