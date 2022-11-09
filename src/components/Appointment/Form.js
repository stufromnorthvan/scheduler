import React, { useState } from 'react';
import Button from "components/Button";
import InterviewerList from "components/InterviewerList";

export default function Form(props) {

  const [student, setStudent] = useState(props.student || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState(false)
  const reset = function() {
    setStudent("")
    setInterviewer("")
  }
  const cancel = () => {
    reset()
    props.onCancel(`Cancelled`)
  }
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
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={save}>Save</Button>
          {error === true && <section className="error">&nbsp; &nbsp; Please enter a name and interviewer</section>}
        </section>
      </section>
    </main>
  );
}