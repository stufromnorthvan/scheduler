import React, { useState } from 'react';
import Button from "components/Button";
import InterviewerList from "components/InterviewerList";

export default function Form(props) {

  // Form State

  const [student, setStudent] = useState(props.student || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState(false)

  // Reset function to set form to original state

  const reset = function() {
    setStudent("")
    setInterviewer("")
  }

  // Cancel function to reset and run onCancel function

  const cancel = () => {
    setError(false)
    reset()
    props.onCancel(`Cancelled`)
  }

  // Save function first checks if interviewer and student are selected, and saves if they are. If they are not, error message is shown.

  const save = () => {
    if (!interviewer || !student) {
      return setError(true)
    }
    setError(false)
    props.onSave(student, interviewer)
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form onSubmit={event => event.preventDefault()} autoComplete="off">
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={student}
            onChange={(event) => setStudent(event.target.value)}
            data-testid="student-name-input"
          />
        </form>
        <InterviewerList
          interviewers={props.interviewers}
          value = {interviewer}
          onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
        {error === true && <section className="appointment__validation"> &nbsp;  Please enter a name and interviewer</section>}
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={save}>Save</Button>
        </section>
      </section>
    </main>
  );
}