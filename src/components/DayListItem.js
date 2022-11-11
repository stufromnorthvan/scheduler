import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss";

export default function DayListItem(props) {

  // dayClass changes the styling of the day item in the sidebar depending on the status, "selected" or "full" (no spots available)

  const dayClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  });

  // formatSpots displays dynamic and contextualized text in the sidebar depending on the number of spots available

  const formatSpots = function() {
    if (props.spots === 1) {
      return "1 spot remaining";
    } else if (props.spots === 0) {
      return "no spots remaining";
    } else {
      return `${props.spots} spots remaining`;
    }
  };

  return (
    <li className={dayClass} onClick={props.setDay } data-testid="day">
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots()}</h3>
    </li>
  );
}