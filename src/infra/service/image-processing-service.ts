import fs from "fs";
import path from "path";
import { promisify } from "util";
import { randomUUID } from "node:crypto";
import { fileManager, model } from "./generative-ai";

type ProcessImageResponse = {
  uri: string;
  measureValue: number;
};

const writeFileAsync = promisify(fs.writeFile);
const unlinkFileAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);

export class ImageProcessingService {
  async processImage(base64Image: string): Promise<ProcessImageResponse> {
    const tempFileName = `${randomUUID()}.jpg`;
    const tempDirPath = path.join(__dirname, "../../../temp");
    const tempFilePath = path.join(tempDirPath, tempFileName);

    await mkdirAsync(tempDirPath, { recursive: true });

    const base64Data = base64Image.replace(/^data:image\/[a-z]+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    await writeFileAsync(tempFilePath, buffer);

    try {
      const uploadResponse = await fileManager.uploadFile(tempFilePath, {
        mimeType: "image/jpeg",
        displayName: "tempImage",
      });

      const resultModel = await model.generateContent([
        {
          fileData: {
            mimeType: uploadResponse.file.mimeType,
            fileUri: uploadResponse.file.uri,
          },
        },
        {
          text: "Analyze the image of the water or gas meter and return only the consumption reading. The response should contain only the consumption value, without any additional information.",
        },
      ]);

      const consumption = resultModel.response.text();

      const measureValue = parseInt(consumption.replace(/[^0-9]/g, ""), 10);

      return {
        uri: uploadResponse.file.uri,
        measureValue,
      };
    } finally {
      await unlinkFileAsync(tempFilePath);
    }
  }
}
