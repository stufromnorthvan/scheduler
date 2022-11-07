export function getAppointmentsForDay(state, day) {
  const dayAppointments = [];
  const filtDay =  state.days.filter(apptDay => apptDay.name === day);
  if (filtDay[0] === undefined) {
    return dayAppointments
  }
  for (let appointment of filtDay[0].appointments) {
    dayAppointments.push(state.appointments[appointment])
  }
  return dayAppointments;
}

export function getInterview(state, interview) {
  if (interview === null) {
    return null;
  }
  const interviewData = {}
  interviewData.student = interview.student
  interviewData.interviewer = state.interviewers[interview.interviewer]
  return interviewData
}

export function getInterviewersForDay(state, day) {
  const dayInterviewers = [];
  const filtDay =  state.days.filter(apptDay => apptDay.name === day);
  if (filtDay[0] === undefined) {
    return dayInterviewers
  }
  for (let interviewer of filtDay[0].interviewers) {
    dayInterviewers.push(state.interviewers[interviewer])
  }
  return dayInterviewers;
}