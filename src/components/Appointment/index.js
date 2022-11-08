import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Status from "components/Appointment/Status";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";


// const showOrEmpty = function(props) {
//   return (props.interview ? <Show student={props.interview.student} interviewer={props.interview.interviewer} /> : <Empty />);
// };



export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING, false);
    props.bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW, false);
      });
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE, false)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}
      {mode === CREATE &&
        <Form interviewers={props.interviewers} onCancel={() => back()} onSave={save} />
      }
      {mode === SAVING && <Status message={"Saving..."} />}
    </article>
  );

}