(function () {
  // 기업 정보 수집 -> 서버에 POST 전송
  window.PEAK = window.PEAK || {};

  function collectSiteInfo() {
    const siteInfo = {
      url: window.location.href,
      title: document.title,
      description:
        document.querySelector('meta[name="description"]')?.content || "",
      keywords: document.querySelector('meta[name="keywords"]')?.content || "",
      h1: document.querySelector("h1")?.innerText || "",
      scraped_at: new Date().toISOString(),
    };

    console.log("수집된 정보", siteInfo);

    // 서버로 데이터 전송
    fetch("http://52.79.142.12:8080/api/v1/company-data/1", {
      // (백엔드 API 주소)
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(siteInfo),
    })
      .then((response) => response.json())
      .then((data) => console.log("서버 응답", data))
      .catch((error) => console.error("서버 전송 실패", error));
  }

  if (document.readyState === "complete") {
    collectSiteInfo();
  } else {
    window.addEventListener("load", collectSiteInfo);
  }

  // PEAK ASNS Footer 삽입
  function init() {
    const logo = document.createElement("img");
    logo.src = "./logo.png";
    logo.alt = "PEAK";
    logo.style.position = "fixed";
    logo.style.bottom = "10px";
    logo.style.right = "10px";
    logo.style.width = "50px";
    logo.style.cursor = "pointer";
    logo.style.zIndex = "100";
    document.body.appendChild(logo);
  }

  if (document.readyState === "complete") {
    collectSiteInfo();
    init();
  } else {
    window.addEventListener("load", () => {
      collectSiteInfo();
      init();
    });
  }
})();
