(function () {
  window.PEAK = window.PEAK || {};

  async function fetchCompanyData() {
    try {
      const response = await fetch(
        "http://52.79.142.12:8080/api/v1/company-data/1"
      );
      if (!response.ok) {
        throw new Error("서버 응답 실패");
      }

      const companyData = await response.json();
      console.log("수신된 회사 데이터:", companyData);

      const companyDiv = document.createElement("div");
      companyDiv.style.position = "fixed";
      companyDiv.style.top = "10px";
      companyDiv.style.left = "10px";
      companyDiv.style.background = "white";
      companyDiv.style.border = "1px solid #ccc";
      companyDiv.style.padding = "10px";
      companyDiv.style.fontSize = "14px";
      companyDiv.style.zIndex = "99";
      companyDiv.innerText = `📄 회사명: ${companyData.company || "정보 없음"}`;
      document.body.appendChild(companyDiv);
    } catch (error) {
      console.error("회사 데이터 수신 실패:", error);
    }
  }

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
    fetchCompanyData();
    init();
  } else {
    window.addEventListener("load", () => {
      fetchCompanyData();
      init();
    });
  }
})();
