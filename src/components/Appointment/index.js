import React, { useEffect } from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Status from "components/Appointment/Status";
import Error from "components/Appointment/Error";
import Confirm from "components/Appointment/Confirm";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";

// Visual modes

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";
const CONFIRM_DELETE = "CONFIRM_DELETE";




export default function Appointment(props) {

  // Visual mode functions

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  // Save function, creates a new interview object and transitions modes

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING, false);
    props.bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW, false);
      }).catch((err) => {
        transition(ERROR_SAVE, true);
      });
  }

  // Delete function, runs cancelInterview function from props and transitions modes

  function del(name, interviewer) {
    transition(DELETING, true);
    props.cancelInterview(props.id)
      .then(() => {
        transition(EMPTY, false);
      }).catch((err) => {
        transition(ERROR_DELETE, true);
      })
  }

  // confirmDelete transitions modes to confirmation

  function confirmDelete() {
    transition(CONFIRM_DELETE);
  }

  // edit transitions modes to form with existing data

  function edit(id) {
    transition(EDIT);
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE, false)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={confirmDelete}
          onEdit={edit}
        />
      )}
      {mode === CREATE &&
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save} />
      }
      {mode === EDIT && <Form
        student={props.interview.student}
        interviewer={props.interview.interviewer.id}
        interviewers={props.interviewers}
        onCancel={() => back()}
        onSave={save} />}
      {mode === SAVING && <Status message={"Saving..."} />}
      {mode === DELETING && <Status message={"Deleting..."} />}
      {mode === ERROR_SAVE && <Error message={"There was an error saving appointment."} onClose={back} />}
      {mode === ERROR_DELETE && <Error message={"There was an error cancelling appointment."} onClose={back} />}
      {mode === CONFIRM_DELETE && <Confirm message={"Are you sure you want to delete this appointment?"} onCancel={back} onConfirm={del} />}
    </article>
  );

}