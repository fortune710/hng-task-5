const router = require("express").Router();
const fs = require("fs")
const multer = require('multer');
const path = require('path');
const { execSync: exec } = require("child_process");
const { Deepgram } = require('@deepgram/sdk')

const apiKey = "591911a4ac96a78bd721c5db54f8834cbe63a8bd";

const deepgram = new Deepgram(apiKey)

// Set up multer to handle multipart/form-data
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('video/')){
        cb(null, true)
    }else{
        cb(new Error('File type not supported'), false);
    }
}


const upload = multer({ storage, fileFilter });

async function ffmpeg(command) {
    return new Promise((resolve, reject) => {
        exec(`ffmpeg ${command}`, (err, stderr, stdout) => {
        if (err) reject(err)
        resolve(stdout)
        })
    })
}

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
  


router.post('/upload', upload.single('file'), async (req, res) => {
    //const completeFile = await constructChunks(req);
    
    try {
        // If there is a file in the request, it's a standard upload
        const videoPath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        const savedPath = path.join(process.cwd(), `/uploads/${req.file.filename}`);

        const transcript = await transcribeLocalVideo(savedPath)

        const transcriptions = transcript.channels[0].alternatives[0].words.map((word) => {
            return `${word.start.toFixed(2)}  ${word.word}`
        })
    
       return res.status(200).json({ url: videoPath, transcription: transcriptions });
    }
    catch (e){
        return res.status(500).json({ message: "An error occured", error: e })
    } finally {

    }
    
})

router.post('/chunk/:id', (req, res) => {
    const videoId = req.params.id;
    const savedPath = path.join(process.cwd(), `/uploads/${videoId}`);


    const { data: chunk } = req.body;
    try {
        const BufferData = Buffer.from(chunk, 'base64');
        const videoStream = fs.createWriteStream(savedPath, { flags: "a" });
        videoStream.write(BufferData);
        videoStream.end();
        return res.json({ uploaded: true });
    } catch (error) {
        return res.json({ uploaded: false });
    }

})

router.post('/initialize-stream', (req, res) => {
    function generateRandomId(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const videoId = generateRandomId(10);
    return res.json({ videoId, message: "Keep video ID in storage to use on subsequent requests" })
})

module.exports = router