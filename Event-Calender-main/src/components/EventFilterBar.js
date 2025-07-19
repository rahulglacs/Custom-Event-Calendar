import React, { useState } from "react";

const EventFilterBar = ({ onFilter, onSearch, categories }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };
  const handleCategory = (e) => {
    setCategory(e.target.value);
    onFilter(e.target.value);
  };

  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={handleSearch}
      />
      <select value={category} onChange={handleCategory}>
        <option value="">All Categories</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
};

export default EventFilterBar;
