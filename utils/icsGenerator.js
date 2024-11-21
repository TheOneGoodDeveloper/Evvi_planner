const { createEvent } = require("ics");
const fs = require("fs");
const path = require("path");

const parseSlot = (slot) => {
  const [timeRange] = slot.trim().split(/\s*-\s*/); // Extract start time from slot
  const [hourStr, minuteStr] = timeRange.split(/[:.]/); // Split hour and minute
  const period = timeRange.slice(-2).toLowerCase(); // Extract AM/PM
  let hour = parseInt(hourStr, 10);
  let minute = parseInt(minuteStr || "0", 10); // Default to 0 if no minute specified

  // Adjust hour for AM/PM
  if (period === "pm" && hour !== 12) {
    hour += 12; // Convert PM times to 24-hour format
  } else if (period === "am" && hour === 12) {
    hour = 0; // Adjust 12 AM to 0 hours
  }

  return { hour, minute };
};

const convertToUTC = (year, month, day, hour, minute) => {
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return [
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
  ];
};

const createAppointmentICS = async (appointmentData) => {
  const { selectDate, slots, name, location, selectedAssessment, email, duration } = appointmentData;

  const [year, month, day] = selectDate.split("-").map(Number);
  const { hour: startHour, minute: startMinute } = parseSlot(slots);

  console.log("Parsed Date:", { year, month, day });
  console.log("Parsed Time (IST):", { startHour, startMinute });

  // Validate parsed date and time values
  if (!year || !month || !day || startHour === undefined || startMinute === undefined) {
    throw new Error("Invalid date or time format in selectDate or slots.");
  }

  const utcStart = convertToUTC(year, month, day, startHour, startMinute);
  const eventDuration = duration || 1; // Default to 1 hour if no duration provided

  const event = {
    start: utcStart,
    duration: { hours: eventDuration },
    title: `Appointment with ${name}`,
    description: selectedAssessment,
    location: "online",
    url: "https://enrichminds.co.in",
    status: "CONFIRMED",
    organizer: { name: "Enrich Minds", email: "feedback@enrichminds.co.in" },
    attendees: [{ name, email }],
    productId: "ics.js",
  };

  console.log("Event object:", event);

  const icsFolderPath = path.join(__dirname, "../Assets/ics");
  const icsFilePath = path.join(icsFolderPath, `appointment.ics`);

  // Ensure the directory exists
  if (!fs.existsSync(icsFolderPath)) {
    fs.mkdirSync(icsFolderPath, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    createEvent(event, (error, value) => {
      if (error) {
        console.error("ICS Creation Error:", error);
        reject(new Error(`Error creating ICS file: ${JSON.stringify(error)}`));
      } else {
        fs.writeFileSync(icsFilePath, value);
        resolve(icsFilePath);
      }
    });
  });
};

module.exports = { createAppointmentICS };
