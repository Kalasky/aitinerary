const OpenAI = require("openai");
const fs = require("fs");
const openai = new OpenAI();

async function createFile() {
  const file = await openai.files.create({
    file: fs.createReadStream("chatCompletion.jsonl"),
    purpose: "fine-tune",
  });

  console.log(file);
}

// createFile();

async function main() {
  const fineTune = await openai.fineTuning.jobs.create({
    training_file: "file-fKLsb133UXI3tTmEpiw594EZ",
    model: "gpt-3.5-turbo-0613",
  });

  console.log(fineTune);
}

// main();

async function retrieveFile() {
  const fineTune = await openai.fineTuning.jobs.retrieve(
    "ftjob-MIbtSIzmH6XSAlo5xnKG9csy"
  );

  console.log(fineTune);
}

retrieveFile();

async function listEvents() {
  const list = await openai.fineTuning.list_events(
    (id = "ftjob-MIbtSIzmH6XSAlo5xnKG9csy"),
    (limit = 2)
  );

  for await (const fineTune of list) {
    console.log(fineTune);
  }
}

// listEvents();

const convertToChatFormat = () => {
  fs.readFile("first_itinerary_finetune.json", "utf8", (err, data) => {
    if (err) {
      console.log(`Error reading the file: ${err}`);
      return;
    }

    const promptCompletionArray = JSON.parse(data);
    const chatCompletionArray = [];

    promptCompletionArray.forEach((obj) => {
      const chatCompletionObj = {
        messages: [
          {
            role: "system",
            content:
              "You are a travel agent who provides personalized activities for travelers based off of their trip preferences",
          },
          {
            role: "user",
            content: obj.prompt,
          },
          {
            role: "assistant",
            content: obj.completion,
          },
        ],
      };

      chatCompletionArray.push(chatCompletionObj);
    });

    fs.writeFile(
      "chatCompletion.json",
      JSON.stringify(chatCompletionArray, null, 2),
      (err) => {
        if (err) {
          console.log(`Error writing to file: ${err}`);
        } else {
          console.log("Conversion complete, written to chatCompletion.json");
        }
      }
    );
  });
};

// convertToChatFormat();
