require("dotenv").config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function askGpt4o(question) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant specialized in providing company information."
          },
          {
            role: "user",
            content: question
          }
        ]
      })
    });

    const data = await response.json();
    console.log("Assistant 답변:", data.choices[0].message.content);
    return data.choices[0].message.content;
  } catch (error) {
    console.error("에러 발생:", error);
  }
}

// 사용 예시
askGpt4o("구글은 어떤 회사야?");
