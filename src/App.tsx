
import * as React from "react";
import debounce from './debounce';
import styles from "./styles.module.css";

type Suggestion = {
  name: string;
}

const getHighlightedText = (text: string, highlight: string) => {
  // Split text on highlight term, include term itself into parts, ignore case
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return <span>{parts.map((part, i) => part.toLowerCase() === highlight.toLowerCase() ? <span key={i} style={{ color: 'yellow' }}>{part}</span> : part)}</span>;
}

const DEBOUNCE_DELAY_IN_MS = 200;

export default function App() {
  const [inputValue, setInputValue] = React.useState('')
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [loading, setLoading] = React.useState(false)
  const [noSuggestionsFound, setNoSuggestionsFound] = React.useState(false)

  const abortController = React.useRef(new AbortController());

  const apiCall = async (value: string) => {
    if (!value) {
      setSuggestions([]);
      setLoading(false)
      setNoSuggestionsFound(false)
      abortController.current.abort();
      return;
    }

    abortController.current.abort(); //abort old request

    const controller = new AbortController(); //use new abortController for new request
    abortController.current = controller;

    setLoading(true)
    try {
      const response = await fetch(`https://swapi.dev/api/people/?search=${encodeURIComponent(value)}`, {
        signal: controller.signal
      });
      const data = await response.json();
      const suggestions = data.results;

      setNoSuggestionsFound(!suggestions.length)
      setSuggestions(suggestions);
      setLoading(false)

    } catch (error) {
      console.error("Error fetching data:", (error as Error).message);
    }
  };

  const debouncedApiCall = React.useRef(debounce(apiCall, DEBOUNCE_DELAY_IN_MS));

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    debouncedApiCall.current(e.target.value);
  };

  const onSuggestionClick = (name: string) => () => {
    setInputValue(name)
    setSuggestions([])
  }

  return (
    <div className={styles.container}>
      <div className={styles.autocomplete}>
        <h2>Type a Star Wars Character</h2>

        <input className={styles.input} onChange={onChange} value={inputValue} />

        {loading &&
          <div className={styles.dropdown}>
            <div className={styles.dropdownItem}>Loading...</div>
          </div>}

        {noSuggestionsFound && !loading &&
          <div className={`${styles.dropdown} ${styles.noSuggestionDropDown}`}>
            <div className={styles.noSuggestionItem} style={{ opacity: 0.5 }}>No suggestions found</div>
          </div>}

        {!!suggestions.length && !loading && <div className={styles.dropdown}>
          {suggestions?.map(({ name }) => (
            <div onClick={onSuggestionClick(name)} className={styles.dropdownItem} key={name}>{getHighlightedText(name, inputValue)}</div>
          ))}
        </div>}

      </div>
    </div>
  );
}
