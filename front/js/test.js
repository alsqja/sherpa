require("dotenv").config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

// 1. 타빌리로 웹 검색
async function searchTavily(query) {
  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TAVILY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: query,
        search_depth: "basic",
        max_results: 5 // 검색 결과 최대 5개
      })
    });
    const data = await response.json();
    return data.results.map((result) => result.content).join("\n\n");
  } catch (error) {
    console.error("Tavily 검색 시 오류 발생", error.message || error);
    return null;
  }
}

// 2. gpt 요약 요청하기
async function summarizeWithGpt4o(content) {
  // Tavily content 매개변수로 받아서 요약
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
            content: `Summarize the following information about the company:\n\n${content}`
          }
        ]
      })
    });

    const data = await response.json();
    console.log("요약 답변:", data.choices[0].message.content);
    return data.choices[0].message.content;
  } catch (error) {
    console.error("gpt 요약 에러 발생:", error);
  }
}

// 사용 예시
async function run() {
  const query = "구글 회사에 대해 알려줘";

  const searchResult = await searchTavily(query);
  if (searchResult) {
    await summarizeWithGpt4o(searchResult);
  } else {
    console.error("검색 결과가 없습니다.");
  }
}

run();
