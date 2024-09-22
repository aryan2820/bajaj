import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { fileTypeFromBuffer } from "file-type";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const getHighestLowercaseAlphabet = (arr) => {
  const lowerCaseAlphabets = arr.filter((char) => /^[a-z]$/.test(char));
  return lowerCaseAlphabets.length ? [lowerCaseAlphabets.sort().pop()] : [];
};

const decodeAndCheckBase64File = async (base64) => {
  try {
    const buffer = Buffer.from(base64, "base64");
    if (buffer.length === 0) {
      console.log("Buffer is empty. Invalid base64 data.");
      return {
        fileValid: false,
        mimeType: null,
        fileSizeKb: null,
      };
    }

    const fileType = await fileTypeFromBuffer(buffer);
    const fileSizeKb = (buffer.length / 1024).toFixed(2);

    return {
      fileValid: !!fileType,
      mimeType: fileType ? fileType.mime : null,
      fileSizeKb: fileSizeKb,
    };
  } catch (error) {
    console.error("Error decoding and checking file:", error);
    return {
      fileValid: false,
      mimeType: null,
      fileSizeKb: null,
    };
  }
};

app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

app.post("/bfhl", async (req, res) => {
  const { data, file_b64 } = req.body;

  if (!data || !Array.isArray(data)) {
    return res
      .status(400)
      .json({ is_success: false, message: "Invalid input" });
  }

  const numbers = data.filter((item) => !isNaN(item));
  const alphabets = data.filter((item) => isNaN(item));
  const highestLowercaseAlphabet = getHighestLowercaseAlphabet(data);

  const fileDetails = file_b64
    ? await decodeAndCheckBase64File(file_b64)
    : {
        fileValid: false,
        mimeType: null,
        fileSizeKb: null,
      };

  const response = {
    is_success: true,
    user_id: "Aryan_gupta_28092003",
    email: "aryangupta282003@gmail.com",
    roll_number: "RA2111027010199",
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercaseAlphabet,
    file_valid: fileDetails.fileValid,
    file_mime_type: fileDetails.mimeType,
    file_size_kb: fileDetails.fileSizeKb,
  };

  res.status(200).json(response);
});

app.listen(port, () => {
  console.log(`API Running on ${port}`);
});
