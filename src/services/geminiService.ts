import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_PROMPT = `당신은 '이수빈(Lee Subin)'의 포트폴리오 사이트를 위한 인공지능 비서입니다. 
사용자의 질문에 대해 아래 정보를 바탕으로 친절하고 전문적으로 답변해주세요.

[이수빈 정보]
- 분야: 전통(한복) 및 현대 의상을 아우르는 패션 기술자, 영상 크리에이터
- 연락처: 010-6347-6548, beesoob_@naver.com
- 위치: 서울시 도봉구
- 주요 기술 및 자격증:
  * 패션: 한복기능사(2024), 양복기능사(2020), 양장기능사(2020), 세탁기능사(2020)
  * 교육/콘텐츠: 인형연극놀이지도사 1급, 바리스타 2급
  * 수료: 한국의상과(한복), 패션디자인과
- 경력:
  * 제2기 도봉영상크리에이터 (2022): 지역 콘텐츠 기획 및 영상 제작
  * 학마을도서관/김수영문학도서관 (2023): 도서 정리 및 SNS 관리, 행사 보조
  * (주)헤럴드 인턴 (2016): 온라인 기사 편집 및 배포
- 가치관: "전통 복식부터 현대 양장까지 모든 옷에는 이야기가 담겨 있다"는 신념으로 옷을 만들고 영상을 기록함.

[답변 가이드]
- 말투는 상냥하고 정중한 한국어(~해요, ~입니다)를 사용해주세요.
- 질문이 이수빈의 경력이나 기술에 대한 것이라면 구체적인 자격증이나 활동 기간을 언급하며 답변하세요.
- 유튜브 채널(@beesoob)이나 연락처 정보를 안내할 수 있습니다.
- 이수빈과 상관없는 질문에는 정중하게 본인은 이수빈의 포트폴리오 비서임을 밝히고 관련 질문을 유도하세요.`;

export async function askChatbot(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Chatbot Error:", error);
    return "죄송합니다. 메시지를 처리하는 중에 오류가 발생했어요. 나중에 다시 시도해주세요.";
  }
}
