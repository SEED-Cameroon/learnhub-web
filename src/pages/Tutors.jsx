import React, { useMemo, useState } from "react";

import TutorCard from "../components/TutorCard";
import TutorFilter from "../components/TutorFilter";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

import { tutors } from "../data/tutors";

function Tutors() {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");

  // Change this to true temporarily if you want
  // to test the loading skeleton.
  const [loading] = useState(false);

  // Change this to true temporarily if you want
  // to test the error state.
  const [error, setError] = useState(false);

  const subjects = useMemo(() => {
    return [...new Set(tutors.map((tutor) => tutor.subject))];
  }, []);

  const filteredTutors = useMemo(() => {
    return tutors.filter((tutor) => {
      const matchesSearch =
        tutor.name.toLowerCase().includes(search.toLowerCase()) ||
        tutor.subject.toLowerCase().includes(search.toLowerCase());

      const matchesSubject =
        subject === "" || tutor.subject === subject;

      return matchesSearch && matchesSubject;
    });
  }, [search, subject]);

  const clearFilters = () => {
    setSearch("");
    setSubject("");
  };

  const retry = () => {
    setError(false);
  };

  return (
    <div className="tutors-page">

      {/* Header */}
      <div className="tutors-header">
        <h1>Find a Tutor</h1>

        <p>
          Discover experienced tutors and start learning today.
        </p>
      </div>

      {/* Filter */}
      <TutorFilter
        search={search}
        setSearch={setSearch}
        subject={subject}
        setSubject={setSubject}
        subjects={subjects}
      />

      {/* Loading State */}
      {loading && <LoadingSkeleton />}

      {/* Error State */}
      {!loading && error && (
        <ErrorState
          message="Unable to load tutors. Please try again."
          onRetry={retry}
        />
      )}

      {/* Empty State */}
      {!loading && !error && filteredTutors.length === 0 && (
        <EmptyState onClear={clearFilters} />
      )}

      {/* Tutor Cards */}
      {!loading && !error && filteredTutors.length > 0 && (
        <div className="tutor-grid">
          {filteredTutors.map((tutor) => (
            <TutorCard
              key={tutor.id}
              tutor={tutor}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default Tutors;