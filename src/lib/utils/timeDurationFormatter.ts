function timeDurationFormatter(date: number) {
  // Example dates
  const currentDate: Date = new Date();
  const pastDate: Date = new Date(date);

  // Calculate the difference in milliseconds
  const timeDifference: number = currentDate.getTime() - pastDate.getTime();

  // Convert milliseconds to minutes, hours, and days
  const minutesDifference: number = Math.floor(timeDifference / (1000 * 60));
  const hoursDifference: number = Math.floor(timeDifference / (1000 * 60 * 60));
  const daysDifference: number = Math.floor(
    timeDifference / (1000 * 60 * 60 * 24)
  );

  // Display text based on the difference
  let displayText: string;

  if (minutesDifference < 1) {
    displayText = "just now";
  } else if (minutesDifference < 60 && minutesDifference >= 1) {
    displayText = `${minutesDifference} min`;
  } else if (hoursDifference < 24 && hoursDifference >= 1) {
    displayText = `${hoursDifference} hr`;
  } else {
    displayText = `${daysDifference} days`;
  }

  return `${displayText}`;
}

export default timeDurationFormatter;
