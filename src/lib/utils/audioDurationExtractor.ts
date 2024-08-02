export async function audioDurationExtractor(url: string) {
  const res = await fetch(url, { method: "GET" });
  const audio = await res.arrayBuffer();
  const c = new AudioContext();
  let finalDuration = "";
  await c.decodeAudioData(audio, function (buffer) {
    // Obtain the duration in seconds of the audio file (with milliseconds as well, a float value)
    var duration = buffer.duration;
    if (duration >= 60)
      finalDuration =
        Math.round(duration / 60) +
        "." +
        Math.round(Math.round(duration % 60) / 10) +
        "m";
    else finalDuration = Math.round(duration) + "s";
    // example 12.3234 seconds

    console.log("The duration of the song is of: " + duration + " seconds");
    // Alternatively, just display the integer value with
    // parseInt(duration)
    // 12 seconds
  });
  console.log(finalDuration);
  return finalDuration;
}
