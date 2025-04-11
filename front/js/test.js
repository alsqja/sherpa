// import "dotenv/config";

async function askAssistant(question) {
  try {
    // 1. Thread 생성
    const threadRes = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2"
      },
      body: JSON.stringify({})
    });
    const threadData = await threadRes.json();
    // console.log("threadData:", threadData);
    const threadId = threadData.id;

    // 2. 질문 보내기
    await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2"
      },
      body: JSON.stringify({
        role: "user",
        content: question
      })
    });

    // 3. Assistant에게 답변 생성 요청
    const runRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2"
      },
      body: JSON.stringify({
        assistant_id: ASSISTANT_ID
      })
    });
    const runData = await runRes.json();
    console.log("runData:", runData);
    const runId = runData.id;

    // 4. 답변이 완료될 때까지 대기
    let status = "queued";
    let answer = "";

    while (status !== "completed") {
      const runStatusRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2"
        }
      });
      const runStatusData = await runStatusRes.json();
      status = runStatusData.status;
      console.log("현재 상태:", status);

      if (status === "completed") {
        const messagesRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
            "OpenAI-Beta": "assistants=v2"
          }
        });
        const messagesData = await messagesRes.json();
        const assistantMessage = messagesData.data.find((msg) => msg.role === "assistant");

        answer = assistantMessage?.content[0]?.text?.value || "답변을 찾을 수 없습니다.";
      }

      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 대기
    }

    console.log("Assistant 답변:", answer);
    return answer;
  } catch (error) {
    console.error(error);
  }
}

// 사용 예시
askAssistant("구글은 어떤 회사야?");

/* 
async function askAssistant(question) {
  // (1) Thread 만들고
  // (2) 질문 보내고
  // (3) 답변 받을 때까지 기다리고
  // (4) 답변 출력
}*/
