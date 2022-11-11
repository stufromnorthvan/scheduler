import axios from "axios";
import { useState, useEffect } from "react";



export default function useApplicationData() {

  // Application state

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  // Checks a day to see how many empty interview slots there are, out of every appointment

  function spotChecker(day, appointments) {
    const newAppts = { ...appointments };
    let count = 0;
    for (let apptID of day.appointments) {
      if (newAppts[apptID].interview === null) {
        count++;
      }
    }
    return count;
  }

  // updateSpots uses spotChecker on each day and returns an array of numbers representing the spots available on each day

  function updateSpots(days, appointments) {
    const counts = [];
    for (let day of days) {
      counts.push({ ...day, spots: spotChecker(day, appointments) });
    }
    return counts;
  }

  // setDay updates the day in the state object

  const setDay = (day) => {
    setState({ ...state, day });
  };

  // bookInterview saves an interview into an appointment in the api data

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const days = updateSpots(state.days, appointments);
    const apiPromise = axios.put(`/api/appointments/${id}`, appointment);
    apiPromise.then(() => {
      setState({
        ...state,
        appointments,
        days
      });
    });
    return apiPromise;
  }

  // useEffect updates the local state of the app whenever the api data is changed

  useEffect(() => {
    const daysURL = `http://localhost:8001/api/days`;
    const appointmentsURL = `http://localhost:8001/api/appointments`;
    const interviewersURL = `http://localhost:8001/api/interviewers`;
    Promise.all([
      axios.get(daysURL),
      axios.get(appointmentsURL),
      axios.get(interviewersURL)
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });
  }, []);

  // cancelInterview function removes an interview from an appointment in the api data

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const apiPromise = axios.delete(`/api/appointments/${id}`);
    apiPromise.then(() => {
      console.log("setting state");
      const days = updateSpots(state.days, appointments);
      setState({
        ...state,
        appointments,
        days
      });
      console.log("state set");
    });

    return apiPromise;
  }

  return { state, setDay, bookInterview, cancelInterview };
}