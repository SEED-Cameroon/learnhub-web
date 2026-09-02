import React from "react";

function TutorFilter({
  search,
  setSearch,
  subject,
  setSubject,
  subjects,
}) {
  return (
    <div className="tutor-filter">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search tutors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-box">
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          <option value="">All Subjects</option>

          {subjects.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default TutorFilter;