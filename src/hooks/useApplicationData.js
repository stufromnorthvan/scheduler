import axios from "axios";
import { useState, useEffect } from "react";



export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  function spotChecker(day, appointments) {
    const newAppts = { ...appointments };
    let count = 0;
    for (let apptID of day.appointments) {
      if (newAppts[apptID].interview === null) {
        count++
      }
    }
    return count
  }
  function updateSpots(days, appointments) {
    const counts = [];
    for (let day of days) {
      counts.push({...day, spots: spotChecker(day, appointments)})
    }
    return counts
  }

  const setDay = (day) => {
    setState({ ...state, day });
  };

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const days = updateSpots(state.days, appointments)
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

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const days = updateSpots(state.days, appointments)
    const apiPromise = axios.delete(`/api/appointments/${id}`);
    apiPromise.then(() => {
      setState({
        ...state,
        appointments,
        days
      });
    });

    return apiPromise;
  }

  return { state, setDay, bookInterview, cancelInterview };
}