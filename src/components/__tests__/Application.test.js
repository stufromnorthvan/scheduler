import axios from "axios";
import React from "react";
import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, queryByAltText, getByDisplayValue } from "@testing-library/react";
import Application from "components/Application";

afterEach(cleanup);


describe("Application", () => {

  // *-------------------------------------------------------------------------*

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  // *-------------------------------------------------------------------------*

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();

  });

  // *-------------------------------------------------------------------------*

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.

    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.

    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the first assigned appointment ([1] in array).

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.

    expect(getByText(appointment, "Are you sure you want to delete this appointment?")).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.

    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting..." is displayed.

    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.

    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });
  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {

    // 1. Render the Application.

    const { container, debug } = render(<Application />);

    // 2. Wait for Archie Cohen to display

    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Edit" button on the first assigned appointment in the array

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Edit"));

    // 4. Check to see booker's name is displayed

    expect(getByDisplayValue(appointment, "Archie Cohen")).toBeInTheDocument();

    // 5. Check to see if interviewer is displayed

    expect(getByText(appointment, "Tori Malcolm")).toBeInTheDocument();

    // 4. Change student name

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Rachel Crustacean" }
    });

    // 4.5 Change interviewer

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 5. Click Save

    fireEvent.click(getByText(appointment, "Save"));

    // 6. Check to see "Saving..." status message

    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    // 7. Check to see if "Rachel Crustacean" has been saved as new user

    await waitForElement(() => getByText(appointment, "Rachel Crustacean"));

    // 8. Check to see if "Sylvia Palmer" has been saved as new interviewer

    await waitForElement(() => getByText(appointment, "Sylvia Palmer"));

    // 9. Check to see if Monday still has 1 spot remaining

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });
  
  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Are you sure you want to delete this appointment?")).toBeInTheDocument();
    fireEvent.click(getByText(appointment, "Confirm"));

  });
});
