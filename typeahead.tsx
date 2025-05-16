import { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [inputValue, setInputValue] = useState<string | undefined>();
  const [suggestions, setSuggestions] = useState([]);
  const [highlight, setHighlight] = useState(-1);
  console.log(highlight);
  const handleOnChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleOnClickSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    setHighlight(-1);
  };

  const handleKeyDown = (e) => {
    const totalItems = suggestions.length;
    if (totalItems === 0) return;

    if (e.key === "ArrowDown") {
      setHighlight((prev) => (prev + 1) % totalItems);
    } else if (e.key === "ArrowUp") {
      setHighlight((prev) => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === "Escape") {
      setHighlight(-1);
    } else if (e.key === "Enter") {
      if (highlight !== -1) {
        setInputValue(suggestions[highlight]);
      }
      setHighlight(-1);
    }
  };

  const fetchSuggestions = async () => {
    const resp = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${inputValue}&format=json&origin=*&limit=10`
    );
    const data = await resp.json();
    setSuggestions(data[1]);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputValue !== "" && inputValue !== undefined) fetchSuggestions();
    }, 500);
  }, [inputValue]);
  return (
    <div className="App" id="container">
      <input
        id="inputbox"
        type="text"
        value={inputValue}
        onChange={handleOnChange}
        onKeyDown={handleKeyDown}
      />
      {suggestions && (
        <ul id="suggestion-box">
          {suggestions.map((suggestion, index) => {
            return (
              <li
                id={`suggestion-item-${index}`}
                className={highlight === index ? "highlight" : ""}
                onClick={() => handleOnClickSuggestion(suggestion)}
                onMouseEnter={() => {
                  setHighlight(index);
                }}
              >
                {suggestion}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
