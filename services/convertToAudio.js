async function ffmpeg(command) {
    return new Promise((resolve, reject) => {
        exec(`ffmpeg ${command}`, (err, stderr, stdout) => {
        if (err) reject(err)
        resolve(stdout)
        })
    })
}
