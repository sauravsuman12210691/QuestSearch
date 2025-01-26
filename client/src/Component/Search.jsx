// src/components/Search.jsx
import React, { useState } from "react";
import { QuestionServiceClient } from "../proto/questions_grpc_web_pb"; // Import generated gRPC client
import { SearchRequest } from "../../../server/proto/questions.proto"; // Import generated request message

const client = new QuestionServiceClient("http://localhost:8080", null, null);

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    const request = new SearchRequest();
    request.setQuery(query);

    client.searchQuestions(request, {}, (err, response) => {
      setLoading(false);
      if (err) {
        setError("Error fetching search results");
        console.error(err);
        return;
      }
      setResults(response.getQuestionsList());
    });
  };

  return (
    <div className="search-container">
      <h2>Search Questions</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter a search term"
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      {error && <p className="error">{error}</p>}

      <div className="results">
        {results.length > 0 ? (
          results.map((question) => (
            <div key={question.getId()} className="result-item">
              <h3>{question.getTitle()}</h3>
              <p>Type: {question.getType()}</p>
              {question.getType() === "ANAGRAM" && (
                <div>
                  <p>Solution: {question.getSolution()}</p>
                  <div>
                    {question.getBlocksList().map((block, index) => (
                      <span key={index} style={{ marginRight: "5px" }}>
                        {block.getText()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default Search;
