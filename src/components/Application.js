import DayList from "./DayList";
import Appointment from "components/Appointment/index";
import "components/Application.scss";
import React from "react";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";
import useApplicationData from "hooks/useApplicationData";



export default function Application(props) {

  // Application State

  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  // appointments variable is appointments for day in state

  const appointments = getAppointmentsForDay(state, state.day);

  // appointmentItems maps appointments data over Appointment component

  const appointmentItems = appointments.map((appointment) => {

    const interview = getInterview(state, appointment.interview);

    return <Appointment
      key={appointment.id}
      id={appointment.id}
      time={appointment.time}
      interview={interview}
      interviewers={getInterviewersForDay(state, state.day)}
      bookInterview={bookInterview}
      cancelInterview={cancelInterview}
    />;
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} value={state.day} onChange={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentItems}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
