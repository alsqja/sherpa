// 브라우저 환경에서는 require 불가
// require("dotenv").config(); -> node 환경 테스트

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

const form = document.getElementById("searchForm");
const queryInput = document.getElementById("queryInput");
const resultSection = document.getElementById("resultSection");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = queryInput.value.trim();
  if (!query) return;

  resultSection.innerHTML = `<p class="loading">검색 중입니다. 잠시만 기다려 주세요.</p>`;

  try {
    const searchResult = await searchTavily(query);
    if (searchResult) {
      const summarized = await summarizeWithGpt4o(searchResult);
      resultSection.innerHTML = `<p>${summarized}</p>`;
    } else {
      resultSection.innerHTML = `<p>검색 결과가 없습니다.</p>`;
    }
  } catch (error) {
    resultSection.innerHTML = `<p>오류가 발생했습니다: ${error.message}</p>`;
  }
});

// 타빌리로 웹 검색
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
  const limitedResult = content.length > 1000 ? content.slice(0, 1000) : content;
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
            content:
              "You are a helpful assistant specialized in providing company information. Please always answer in Korean."
          },
          {
            role: "user",
            content: `Summarize the following information about the company:\n\n${limitedResult}`
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
