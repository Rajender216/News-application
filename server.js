import express from 'express';
import bodyParser from 'body-parser';
import {MongoClient,ServerApiVersion} from "mongodb";
const app = express();
const port = process.env.PORT || 3000;
const client=new MongoClient("mongodb+srv://rajender216:PJCMdyR2JXTIth78@news-app.gb0vo.mongodb.net/?retryWrites=true&w=majority&appName=News-app&ssl=true",{
    serverApi:{
        version:ServerApiVersion.v1,
        strict:true,
        deprecationErrors:true
    }
});
//  mongodb+srv://rajender216:PJCMdyR2JXTIth78@news-app.gb0vo.mongodb.net/?retryWrites=true&w=majority&appName=News-app

const connectDb=async(noteContent)=>{
    try {
        await client.connect();
        console.log("MongoDb connected successfully");
        const database = client.db("News-app");
        const notesCollection = database.collection("Notes-Collection");

        // Define the note to be saved
        const note = {
            content: noteContent,
            createdAt: new Date()  // Optional: You can store the timestamp when the note is created
        };

        // Insert the note into the collection
        const result = await notesCollection.insertOne(note);
        
        // Log the result
        // console.log("Note inserted with ID:", result.insertedId);
        return result.insertedId;


        
    } catch (error) {
        console.log(error);
    }
}


app.use(bodyParser.json()); // Parse incoming requests with JSON payloads
app.use(express.static('public')) // Serve static files (HTML, CSS, JS)



// Route to save a new note
app.post('/notes', async (req, res) => {
    const noteContent = req.body.content;

    if (!noteContent) {
        return res.status(400).send('Note content is required');
    }

    try {
        const noteId = await connectDb(noteContent); // Save the note to the database
        res.status(201).send(`Note saved successfully with ID: ${noteId}`);
    } catch (error) {
        res.status(500).send('Failed to save note');
    }
});

// Start the server
connectDb();
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



// Route to get all saved notes from the database
app.get('/notes', async (req, res) => {
    try {
        // await client.connect();
        const database = client.db("News-app");
        const notesCollection = database.collection("Notes-Collection");

        // Fetch all notes from the database
        const notes = await notesCollection.find().toArray();

        res.json(notes);
    } catch (error) {
        res.status(500).send('Failed to fetch notes');
    }
});
