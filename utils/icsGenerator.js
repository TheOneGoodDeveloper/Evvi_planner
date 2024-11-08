const { createEvent } = require("ics");
const fs = require("fs");
const path = require("path");

const parseSlot = (slot) => {
  const [timeRange, period] = slot.trim().split(/\s*-\s*/); // Split start and end time
  const [time, period1] = timeRange.split(/[:\.\s]+/); // Separate time from AM/PM
  const hour = parseInt(time); // Get the hour
  const minute = slot.includes(".") ? parseInt(slot.split(".")[1].split(" ")[0]) : 0; // Get the minute
  
  let adjustedHour = hour;
  let adjustedMinute = minute;

  // Adjust hour for AM/PM
  if (period1.toLowerCase() === "pm" && adjustedHour !== 12) {
    adjustedHour += 12; // Convert PM times to 24-hour format
  } else if (period1.toLowerCase() === "am" && adjustedHour === 12) {
    adjustedHour = 0; // Adjust 12 AM to 0 hours
  }

  // Adjust for IST (Indian Standard Time) - UTC +5:30
  const IST_OFFSET_HOURS = 5;
  const IST_OFFSET_MINUTES = 30;

  // Convert to UTC by subtracting 5 hours and 30 minutes
  let startHour = adjustedHour - IST_OFFSET_HOURS;
  let startMinute = adjustedMinute - IST_OFFSET_MINUTES;

  // Handle negative minutes (borrow an hour if necessary)
  if (startMinute < 0) {
    startMinute += 60;
    startHour -= 1; // Borrow 1 hour from the hour
  }

  // Handle negative hour (wrap around the day if necessary)
  if (startHour < 0) {
    startHour += 24; // Ensure hour stays within a 24-hour range
  }

  return { startHour, startMinute };
};

const createAppointmentICS = async (appointmentData) => {
  const { selectDate, slots, name, location, selectedAssessment, email, duration } = appointmentData;
  const [year, month, day] = selectDate.split("-").map(Number);
  const { startHour, startMinute } = parseSlot(slots.split("-")[0]);

  console.log("Parsed Date:", { year, month, day });
  console.log("Parsed Time:", { startHour, startMinute });

  // Validate parsed date and time values
  if (
    !year ||
    !month ||
    !day ||
    startHour === undefined ||
    startMinute === undefined
  ) {
    throw new Error("Invalid date or time format in selectDate or slots.");
  }

  // If no duration is provided, set it to 1 hour by default
  const eventDuration = duration || 1;

  const event = {
    start: [year, month, day, startHour, startMinute],
    duration: { hours: eventDuration },
    title: `Appointment with ${name}`,
    description: selectedAssessment,
    location: location,
    url: "https://enrichminds.co.in",
    status: "CONFIRMED",
    organizer: { name: "Enrich Minds", email: "feedback@enrichminds.co.in" },
    attendees: [{ name, email }],
  };

  console.log("Event object:", event); // Log the event object for debugging

  const icsFolderPath = path.join(__dirname, "../Assets/ics");
  const icsFilePath = path.join(icsFolderPath, `appointment.ics`);

  // Ensure the directory exists
  if (!fs.existsSync(icsFolderPath)) {
    fs.mkdirSync(icsFolderPath, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    createEvent(event, (error, value) => {
      if (error) {
        console.error("ICS Creation Error:", error); // Log the error in detail
        reject(new Error(`Error creating ICS file: ${JSON.stringify(error)}`));
      } else {
        fs.writeFileSync(icsFilePath, value);
        resolve(icsFilePath);
      }
    });
  });
};

module.exports = { createAppointmentICS };
