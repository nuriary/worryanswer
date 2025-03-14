import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai/index.mjs";
import env from "dotenv";

const app = express();
const port = 3000;

env.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs", { worryText: "" } )
});

app.post("/", async (req, res) => {

        const openai = new OpenAI({
           apiKey: process.env.API_KEY
        })
       
        const response = await openai.chat.completions.create({
           model: "gpt-4o",
           messages: [
               {"role": "system", "content": "I need JS Objects of 3 character. each JS object's keys are name, date, nationality, concern."},
               {"role": "user", "content": `고민의 카테고리는 ${req.body.category}이고 고민의 내용은 ${req.body.worryText}입니다.`},
               {"role": "user", "content": "당신은 주어진 고민을 읽고 100년 전 시대상을 살려 현대인과 비슷한 고민을 하는 캐릭터 3명을 JSON 객체 배열 형식으로 만들어냅니다. 고민은 1~2줄이면 됩니다. 한국어로 답해주세요. 그 시대에 있었던 물건이나 역사적 사실을 살려주세요. 끝문장은 ~로 이 문제를 해결할 생각이다. 등으로 구체적인 해결방안을 제시해주세요. 실제 유명인이라면 더 좋습니다."},
               {"role": "assistant", "content": `{ name : "한국 서울", date : "1925. 03", nationality: "조선", concern: "일제강점기 속에서 민족정체성을 지키기 위한 비밀 문화 활동에 참여하다 발각될까 두려워하고 있었다. 그는 교사로 일하면서 아이들에게 한글을 몰래 가르쳤고, 이것이 발각되면 직업을 잃거나 체포될 수도 있었다. 가족의 생계와 민족의 미래 사이에서 그는 매일 밤 잠을 이루지 못했다." }, { name : "존슨", date : "1941. 11", nationality: "프랑스", concern: "매번 터지는 포탄소리에 두려움이 일었다." }, { name : "흑인 간호사 Sarah Johnson", date : "1925. 09", nationality: "아프리카", concern: "인종 차별적인 의료 시스템 속에서 환자들에게 적절한 치료를 제공하기 위해 고군분투하고 있었다. 그녀는 백인 간호사보다 낮은 임금을 받았고, 종종 더 많은 환자를 담당해야 했다. 그녀는 할렘에서 의료 서비스를 확장하고 싶었지만, 자금과 제도적 지원이 부족했다. 그녀는 직장에서의 인종 차별에 맞서 발언할지, 아니면 조용히 일자리를 지킬지 갈등하고 있었다." }` }
           ]
       });
       
        const worryanswer = JSON.stringify(response.choices[0].message.content)
       const strWorry0 = worryanswer.replace("```json", "");
       const strWorry1 = strWorry0.replace(/```/g, "");
       const strWorry2 = strWorry1.replace(/\\n/g, "");
       const strWorry3 = strWorry2.replace(/\\/g, "");
       const strWorry4 = strWorry3.replace("[", "");
       const strWorry5 = strWorry4.replace("]", "");
       const strWorry6 = strWorry5.replace(/: /g, "");
       const strWorry7 = strWorry6.replace(/{ /g, "");
       const strWorry8 = strWorry7.replace(/ }/g, "");
       const strWorry9 = strWorry8.replace(/,/g, "");
       const strWorry10 = strWorry9.replace(/  /g, "");
       
       const splitWords = strWorry10.split('"');
       
       splitWords.shift();
       splitWords.pop();
       
       const groupObject = []
       
       for (let i = 3; i < splitWords.length; i += 16) {
           groupObject.push({
               name: splitWords[i],
               date: splitWords[i + 4],
               location: splitWords[i + 8],
               concern: splitWords[i + 12]
           });
       }
       
       const char1 = {
           name: groupObject[0].name,
           date: groupObject[0].date,
           location: groupObject[0].location,
           concern: groupObject[0].concern
       }
       
       const char2 = {
           name: groupObject[1].name,
           date: groupObject[1].date,
           location: groupObject[1].location,
           concern: groupObject[1].concern
       }
       
       const char3 = {
           name: groupObject[2].name,
           date: groupObject[2].date,
           location: groupObject[2].location,
           concern: groupObject[2].concern
       }
       
           res.render("submit.ejs", { worryText : req.body.worryText, category : req.body.category, char1: char1, char2: char2, char3: char3 } )
       
       });


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });


