/*
agent.js가 보내는 데이터를 받아서 OpenAI Vector Store에 저장
*/
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI 클라이언트
const openai = new OpenAI({
  apiKey: "YOUR_OPENAI_API_KEY", // OpenAI API 키
});

app.post("/collect", async (req, res) => {
  try {
    const { title, description, keywords } = req.body;

    const combinedText = `${title} ${description} ${keywords}`;

    // Vector Store에 데이터 추가 (Vectorize + 저장)
    const vectorStore = await openai.vectorStores.create({
      name: "peak-company-store",
      description: "기업 정보 저장용",
    });

    await openai.vectorStores.files.upload(vectorStore.id, {
      file: {
        content: combinedText,
      },
    });

    res.status(200).json({ message: "벡터 저장 완료!" });
  } catch (error) {
    console.error("Vector Store 저장 실패:", error);
    res.status(500).json({ message: "Vector Store 저장 실패" });
  }
});

app.listen(3000, () => {
  console.log("서버 실행 중: http://localhost:3000");
});
