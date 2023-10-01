async function transcribeLocalVideo(filePath) {
    ffmpeg(`-hide_banner -y -i ${filePath} ${filePath}.wav`)
  
    const audioFile = {
      buffer: fs.readFileSync(`${filePath}.wav`),
      mimetype: 'audio/wav',
    }
    const response = await deepgram.transcription.preRecorded(audioFile, {
      punctuation: true,
    })
    return response.results
}
