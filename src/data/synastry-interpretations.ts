// 繁體中文雙人合盤（比較盤）與關係中點組合盤專業解讀庫
import { AspectType, PlanetKey } from '../engine/types';

/**
 * 取得雙人交叉相位 (Synastry Inter-Aspects) 深度解析
 */
export function getCrossAspectInterpretation(
  planetAName: string,
  planetBName: string,
  keyA: PlanetKey,
  keyB: PlanetKey,
  aspectType: AspectType
): string {
  const pair1 = `${keyA}-${keyB}-${aspectType}`;
  const pair2 = `${keyB}-${keyA}-${aspectType}`;

  const database: Record<string, string> = {
    // 太陽與月亮（陰陽調和核心）
    'sun-moon-conjunction': `${planetAName} 與 ${planetBName} 緊密合相：這是占星學中最具代表性的「靈魂伴侶」印記！一方的自我追求（太陽）能深度契合另一方的情感安全感（月亮），彼此相處極為自然，宛如天生一對。`,
    'sun-moon-trine': `${planetAName} 與 ${planetBName} 形成和諧三分相：彼此的情感與理智相互支持。太陽方欣賞月亮方的細膩溫柔，月亮方信賴太陽方的決策與力量，相處輕鬆愉快且充滿信任。`,
    'sun-moon-sextile': `${planetAName} 與 ${planetBName} 形成六分相：兩人互動融洽互補，容易在日常交流與生活步調中找到高度共鳴，是一同面對生活挑戰的絕佳拍檔。`,
    'sun-moon-square': `${planetAName} 與 ${planetBName} 形成四分相：吸引力很強，但在生活習慣與情緒表達上容易產生步調落差。一方渴望前進冒險，另一方可能感到不安，需要耐心傾聽彼此內心深處的顧慮。`,
    'sun-moon-opposition': `${planetAName} 與 ${planetBName} 形成對分相：如同滿月般強烈吸引又相互照映。你們能看清彼此性格中缺失的一面，雖有觀點差異，但若能學會包容，將成為最完美的互補型伴侶。`,

    // 金星與火星（浪漫與激情火花）
    'venus-mars-conjunction': `${planetAName} 與 ${planetBName} 產生金火合相：經典的「致命化學反應」！雙方在肢體吸引力與浪漫氛圍上一觸即發，充滿熱烈的激情與相互迷戀的魅力。`,
    'venus-mars-trine': `${planetAName} 與 ${planetBName} 形成金火三分相：極為甜美自然的愛情互動！一方的柔情審美（金星）與另一方的果敢熱情（火星）完美共舞，戀愛相處充滿樂趣且少有摩擦。`,
    'venus-mars-sextile': `${planetAName} 與 ${planetBName} 形成金火六分相：彼此欣賞對方的魅力風格，容易在約會與相處中製造浪漫情調，感情互動活潑而甜蜜。`,
    'venus-mars-square': `${planetAName} 與 ${planetBName} 形成金火四分相：強烈的性吸引力與激情火花，但也伴隨著感情節奏上的拉扯。有時一方太熱情而另一方感到被逼迫，需要多協調相處步調。`,
    'venus-mars-opposition': `${planetAName} 與 ${planetBName} 形成金火對分相：極端的吸引力！彼此身上有著自己沒有的強烈異性魅力，既容易被對方深深吸引，也容易在期望落空時產生小任性與摩擦。`,

    // 水星與水星（思維溝通頻率）
    'mercury-mercury-conjunction': `${planetAName} 與 ${planetBName} 水星合相：思維節奏完全同步！你們常有「心有靈犀」的默契，往往話說一半對方就能心領神會，溝通順暢無阻。`,
    'mercury-mercury-trine': `${planetAName} 與 ${planetBName} 水星三分相：極佳的談話知己！彼此思考邏輯相近，能夠深入探討各類話題，彼此激發創意靈感，是最懂對方的精神摯友。`,
    'mercury-mercury-square': `${planetAName} 與 ${planetBName} 水星四分相：思維方式與邏輯重點不同，溝通時容易各說各話或產生誤解。建議在重要決策時放慢節奏，多確認彼此的真實意圖。`,

    // 月亮與金星（溫柔滋養與安全感）
    'moon-venus-conjunction': `${planetAName} 與 ${planetBName} 月金合相：充滿溫情與包容的甜蜜互動。雙方都懂得如何讓彼此感到被疼愛與被呵護，營造出溫暖舒心的家庭歸屬感。`,
    'moon-venus-trine': `${planetAName} 與 ${planetBName} 月金三分相：情感表達如細水長流般柔和。彼此尊重對方的審美與喜好，相處氣氛和諧優雅，極少出現情緒上的針鋒相對。`,

    // 土星與個人星（責任感與長久承諾）
    'saturn-sun-trine': `${planetAName} 與 ${planetBName} 土日三分相：這是一段能夠經得起時間考驗的穩固關係。土星方為這段關係帶來強烈的責任感與承諾，太陽方則給予方向，非常利於長期發展與步入婚姻。`,
    'saturn-moon-conjunction': `${planetAName} 與 ${planetBName} 土月合相：深厚的情感羈絆！土星方常常扮演保護者或指導者的角色，但有時可能給月亮方帶來些許嚴肅或壓抑感，需要多給予情感上的肯定與溫暖。`,
    'saturn-venus-trine': `${planetAName} 與 ${planetBName} 土金三分相：忠誠、踏實且專一的愛。你們對感情抱持認真負責的態度，不追求浮誇承諾，更重視在平凡歲月中互相扶持的踏實感。`,
  };

  if (database[pair1]) return database[pair1];
  if (database[pair2]) return database[pair2];

  // 泛用動態回退模板
  switch (aspectType) {
    case 'conjunction':
      return `${planetAName} 與對方的 ${planetBName} 緊密合相：兩顆行星能量在彼此生命中深度疊合、互相放大，是兩人互動中不可忽視的核心焦點。`;
    case 'trine':
      return `${planetAName} 與對方的 ${planetBName} 呈 120° 三分相：彼此在這兩個面向天生共振，相處順遂和諧，能夠給予對方自然流暢的情感支持。`;
    case 'sextile':
      return `${planetAName} 與對方的 ${planetBName} 呈 60° 六分相：能量良性互補，透過主動互動與交流，能為兩人的關係帶來絕佳的默契與成長機會。`;
    case 'square':
      return `${planetAName} 與對方的 ${planetBName} 呈 90° 四分相：雙方在該領域存在理念衝突或習慣落差，但也正是推動兩人深度磨合、學會換位思考的催化劑。`;
    case 'opposition':
      return `${planetAName} 與對方的 ${planetBName} 呈 180° 對分相：極端的互補與張力，彼此像是對方的鏡子，在相愛與拉扯中共同尋找最舒適的平衡點。`;
    default:
      return `${planetAName} 與對方的 ${planetBName} 產生相位關聯。`;
  }
}

/**
 * 取得行星落入對方後天宮位之解析
 */
export function getPlanetInPartnerHouseInterpretation(
  planetKey: PlanetKey,
  planetName: string,
  house: number,
  partnerName: string
): string {
  const customNotes: Record<string, string> = {
    // 太陽落入對方宮位
    'sun-1': `你的太陽落入 ${partnerName} 的第一宮：你的一舉一動對 ${partnerName} 具有強大的吸引力與啟發性，對方容易將你視為生命中的重要典範。`,
    'sun-4': `你的太陽落入 ${partnerName} 的第四宮：你給予 ${partnerName} 深刻的情感歸屬感與「家」的安心感，能深入對方的私密內心世界。`,
    'sun-5': `你的太陽落入 ${partnerName} 的第五宮：天生的戀愛與歡樂催化劑！你總能激發 ${partnerName} 的愛意、創造力與玩心，相處充滿歡聲笑語。`,
    'sun-7': `你的太陽落入 ${partnerName} 的第七宮：強烈的伴侶與婚姻指向！${partnerName} 很容易將你視為理想中的一對一終身伴侶或重要合夥人。`,
    'sun-10': `你的太陽落入 ${partnerName} 的第十宮：你在事業、目標與社會形象上能給予 ${partnerName} 極大的幫助與鼓舞，能成為對方人生邁向成功的貴人。`,

    // 月亮落入對方宮位
    'moon-1': `你的月亮落入 ${partnerName} 的第一宮：你在情緒上高度敏銳地感知 ${partnerName} 的狀態，兩人在無形中建立起強烈的情感共鳴與依戀。`,
    'moon-4': `你的月亮落入 ${partnerName} 的第四宮：極度溫馨與深情！你們在一起有種天然的親近感與歸屬感，非常適合共同建立溫暖的家庭生活。`,
    'moon-7': `你的月亮落入 ${partnerName} 的第七宮：在親密關係中你渴望給予對方溫柔照料，對方也深深依賴你的情感陪伴與心靈支持。`,
    'moon-8': `你的月亮落入 ${partnerName} 的第八宮：直達靈魂深處的情感連結！雙方容易觸碰到彼此最深層的脆弱與秘密，情感熱烈且具有深刻轉化力。`,

    // 金星落入對方宮位
    'venus-1': `你的金星落入 ${partnerName} 的第一宮：你在 ${partnerName} 眼中極具個人魅力與吸引力，對方常常不自覺被你的美貌與優雅所傾倒。`,
    'venus-5': `你的金星落入 ${partnerName} 的第五宮：甜蜜浪漫的極致！你為 ${partnerName} 的生活帶來滿滿的戀愛滋味、浪漫驚喜與快樂時光。`,
    'venus-7': `你的金星落入 ${partnerName} 的第七宮：經典的良緣配置！${partnerName} 覺得和你相處舒服和諧，容易產生渴望與你攜手共度一生的愛意。`,
  };

  const key = `${planetKey}-${house}`;
  if (customNotes[key]) return customNotes[key];

  return `你的${planetName}落入 ${partnerName} 的第 ${house} 宮：這意味著你將個人特質與精力深植於 ${partnerName} 的第 ${house} 宮生活領域，對其產生顯著影響。`;
}

/**
 * 取得中點組合盤 (Composite Chart) 太陽落宮核心解析
 */
export function getCompositeSunInterpretation(house: number): string {
  const interpretations: Record<number, string> = {
    1: '組合太陽第一宮：這段關係給人極為強烈的「命運共同體」印象。你們在一起時自我意識鮮明，能夠共同建立獨特的形象並向外展現強大的合力。',
    2: '組合太陽第二宮：兩人的關係焦點緊扣物質資產、生活品質與安全感。你們擅長共同規劃財務、打造富足穩健的生活基礎。',
    3: '組合太陽第三宮：溝通與心靈交流是這段關係的生命線。你們熱愛聊天、分享日常、吸收新知，彼此是最好的交談知己。',
    4: '組合太陽第四宮：打造一個溫暖、穩固且私密的「家」是你們關係的核心追求。兩人在私下相處時最為放鬆，情感連結深沉且深植於心。',
    5: '組合太陽第五宮：這是一段充滿歡樂、戀愛熱情與創造才華的活力關係！你們享受約會、玩樂與浪漫氛圍，在一起時宛如熱戀中的孩童。',
    6: '組合太陽第六宮：關係的核心體現在日常生活中的互相扶持與分工。你們在實務瑣事上配合默契，透過細水長流的照料體現真摯深情。',
    7: '組合太陽第七宮：典型的終身伴侶與神仙眷侶配置！這段關係的本質就是「一對一的深度承諾」，你們渴望平等協商、攜手面對世界。',
    8: '組合太陽第八宮：深層的靈魂轉化與強烈羈絆。這段關係不流於表面，伴隨著深刻的情感考驗與身心蛻變，彼此在磨礪中獲得新生。',
    9: '組合太陽第九宮：這段關係帶領彼此探索更寬廣的世界。你們喜愛旅行、探討人生哲學與追尋精神成長，共同開拓視野。',
    10: '組合太陽第十宮：這是一段充滿社會野心與榮譽感的關係。你們往往是眾人眼中的模範夫妻或事業黃金搭檔，能共同創造引人矚目的成就。',
    11: '組合太陽第十一宮：像好友般的靈魂伴侶！你們擁有共同的理想、朋友群與未來願景，在彼此身上找到自由、平等與最真誠的尊重。',
    12: '組合太陽第十二宮：神秘且富含靈性因果的相遇。你們之間常有無法言說的心靈感應與宿命感，適合在靜謐中守護這份深刻的情緣。',
  };

  return interpretations[house] || `組合太陽落入第 ${house} 宮：這段關係的核心舞台將在此宮位所掌管的人生領域深刻展開。`;
}
