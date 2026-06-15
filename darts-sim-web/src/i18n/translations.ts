export type LangCode = 'ja' | 'en' | 'zh' | 'zh-TW' | 'ko' | 'th';

export interface Translation {
  langName: string; flag: string;
  appTitle: string; cameraHeight: string; cameraLR: string;
  rule: string; ruleSOFT: string; ruleHARD: string;
  settingSection: string; throwSection: string;
  flightShapeLabel: string;
  flightNameSTANDARD: string; flightNameSHAPE: string;
  flightNameTEARDROP: string; flightNameKITE: string; flightNameSLIM: string;
  shaftLength: string; barrelLength: string; totalWeight: string; cgRatio: string;
  initialSpeed: string; launchAngle: string; releaseHeight: string;
  releaseDistance: string; gripRatio: string; initialPitch: string;
  throwBtn: string; calculating: string;
  historyTitle: string; showAll: string; hideAll: string;
  deleteAll: string; prev: string; next: string;
  colColor: string; colVisible: string; colFlight: string; colShaft: string;
  colBarrel: string; colWeight: string; colCg: string; colSpeed: string;
  colAngle: string; colHeight: string; colDistance: string; colGrip: string;
  colPitch: string; colDatetime: string; colOperation: string; deleteBtn: string;
  speed: string; close: string;
  deleteConfirmMsg: string; cancel: string; deleting: string;
  settingInfoTitle: string;
  settingInfoFlight: string; settingInfoFlightDesc: string;
  settingInfoShaft: string; settingInfoShaftDesc: string;
  settingInfoBarrel: string; settingInfoBarrelDesc: string;
  settingInfoWeight: string; settingInfoWeightDesc: string;
  settingInfoCg: string; settingInfoCgDesc: string;
  settingInfoNoteTitle: string; settingInfoNoteDesc: string;
  throwInfoTitle: string;
  throwInfoSpeed: string; throwInfoSpeedDesc: string;
  throwInfoAngle: string; throwInfoAngleDesc: string;
  throwInfoHeight: string; throwInfoHeightDesc: string;
  throwInfoDistance: string; throwInfoDistanceDesc: string;
  throwInfoGrip: string; throwInfoGripDesc: string;
  throwInfoPitch: string; throwInfoPitchDesc: string;
  throwInfoNoteTitle: string; throwInfoNoteDesc: string;
  gripInfoMsg1: string; gripInfoMsg2: string;
  historyInfoMsg: string;
  labelFontSize: string;
}

export type TFunc = (key: keyof Translation) => string;

const ja: Translation = {
  langName: "日本語", flag: "🇯🇵",
  appTitle: "ダーツ軌道シミュレーター", cameraHeight: "視点高さ", cameraLR: "視点左右",
  rule: "ルール", ruleSOFT: "ソフト (244cm)", ruleHARD: "ハード (237cm)",
  settingSection: "セッティング", throwSection: "スロー条件",
  flightShapeLabel: "フライト形状",
  flightNameSTANDARD: "スタンダード", flightNameSHAPE: "シェイプ",
  flightNameTEARDROP: "ティアドロップ", flightNameKITE: "カイト", flightNameSLIM: "スリム",
  shaftLength: "シャフト長 (mm)", barrelLength: "バレル長 (mm)",
  totalWeight: "総重量 (g)", cgRatio: "重心位置 (mm)",
  initialSpeed: "初速 (km/h)", launchAngle: "射出角度 (度)",
  releaseHeight: "リリース高さ (cm)", releaseDistance: "リリース距離 (cm)",
  gripRatio: "グリップ位置 (mm)", initialPitch: "初期姿勢角度 (度)",
  throwBtn: "投げる", calculating: "計算中...",
  historyTitle: "履歴", showAll: "全て表示", hideAll: "全て非表示",
  deleteAll: "全削除", prev: "前へ", next: "次へ",
  colColor: "色", colVisible: "表示", colFlight: "フライト",
  colShaft: "シャフト(mm)", colBarrel: "バレル(mm)", colWeight: "重量(g)",
  colCg: "重心(mm)", colSpeed: "初速(km/h)", colAngle: "角度(度)",
  colHeight: "高さ(cm)", colDistance: "距離(cm)", colGrip: "グリップ(mm)",
  colPitch: "姿勢角(度)", colDatetime: "実行日時", colOperation: "操作", deleteBtn: "削除",
  speed: "速度", close: "閉じる",
  deleteConfirmMsg: "履歴を全て削除しますか？", cancel: "キャンセル", deleting: "削除中...",
  settingInfoTitle: "セッティングについて",
  settingInfoFlight: "フライト形状", settingInfoFlightDesc: "形状によって空気抵抗面積が変わります。スタンダードは安定性が高く、スリムは抵抗が少なく直進性が増します。",
  settingInfoShaft: "シャフト長", settingInfoShaftDesc: "長いほど重心がテール側に移動し、フライトによる姿勢安定効果が高まります。",
  settingInfoBarrel: "バレル長", settingInfoBarrelDesc: "バレルの全長です。重心位置の設計に影響します。",
  settingInfoWeight: "総重量", settingInfoWeightDesc: "ダーツ全体の重量です。重いほど空気抵抗の影響を受けにくく直進性が増しますが、それに見合った初速が必要になります。",
  settingInfoCg: "重心位置", settingInfoCgDesc: "バレル内の重心の位置です。先端が 0mm、後端がバレル長(mm)。前重心ほどノーズが下がりにくくなります。3D描画ではオレンジのリングで示されます。",
  settingInfoNoteTitle: "※ 省略している項目について", settingInfoNoteDesc: "バレルの太さ・表面加工、シャフトの素材・形状、チップの形状などは飛行軌道への影響が極めて微小なため、このシミュレーターでは設定項目から省いています。",
  throwInfoTitle: "スロー条件について",
  throwInfoSpeed: "初速", throwInfoSpeedDesc: "リリース時の速度です。ボード到達時は一般的に約 2〜3 km/h 減速します。",
  throwInfoAngle: "射出角度", throwInfoAngleDesc: "水平を 0° として、射出方向の上下角度を設定します。",
  throwInfoHeight: "リリース高さ", throwInfoHeightDesc: "ダーツをリリースする瞬間の、床からの高さです。身長ではありません。",
  throwInfoDistance: "リリース距離", throwInfoDistanceDesc: "スローラインを 0cm として、ボード方向へ踏み込んだ距離を設定します。",
  throwInfoGrip: "グリップ位置", throwInfoGripDesc: "バレルを握る位置です。先端が 0mm、後端がバレル長(mm)。3D描画では青いリングで示されます。",
  throwInfoPitch: "初期姿勢角度", throwInfoPitchDesc: "リリース時のダーツ軸の傾きです。水平を 0° とします。",
  throwInfoNoteTitle: "※ 左右のブレ・回転について", throwInfoNoteDesc: "実際のスローでは左右方向のブレや回転（スピン）も生じますが、これらはフォームや指先のクセに起因する個人差が大きく、物理的に一意に定まるパラメータではありません。また、ダーツの対称形状と短い飛行距離を考えると、左右空気抵抗や回転による軌道への影響は上下方向と比べて極めて微小です。このシミュレーターでは「重力・空気抵抗・姿勢変化」という再現性の高い鉛直面の物理に絞ることで、セッティングの違いを明確に比較できるよう設計しています。",
  gripInfoMsg1: "バレルの先端が 0mm、後端がバレル長 mm です。", gripInfoMsg2: "3D描画では青いリングで表示されます。",
  historyInfoMsg: "履歴はアプリの操作が一定時間無ければ自動で一括削除されます。",
  labelFontSize: "14px",
};

const en: Translation = {
  langName: "English", flag: "🇺🇸",
  appTitle: "Darts Trajectory Simulator", cameraHeight: "Cam Height", cameraLR: "Cam L/R",
  rule: "Rule", ruleSOFT: "Soft (244cm)", ruleHARD: "Hard (237cm)",
  settingSection: "Settings", throwSection: "Throw Conditions",
  flightShapeLabel: "Flight Shape",
  flightNameSTANDARD: "Standard", flightNameSHAPE: "Shape",
  flightNameTEARDROP: "Teardrop", flightNameKITE: "Kite", flightNameSLIM: "Slim",
  shaftLength: "Shaft Length (mm)", barrelLength: "Barrel Length (mm)",
  totalWeight: "Weight (g)", cgRatio: "CG Position (mm)",
  initialSpeed: "Speed (km/h)", launchAngle: "Launch Angle (°)",
  releaseHeight: "Release Height (cm)", releaseDistance: "Release Distance (cm)",
  gripRatio: "Grip Position (mm)", initialPitch: "Initial Pitch (°)",
  throwBtn: "Throw", calculating: "Calculating...",
  historyTitle: "History", showAll: "Show All", hideAll: "Hide All",
  deleteAll: "Delete All", prev: "Prev", next: "Next",
  colColor: "Color", colVisible: "Show", colFlight: "Flight",
  colShaft: "Shaft(mm)", colBarrel: "Barrel(mm)", colWeight: "Weight(g)",
  colCg: "CG(mm)", colSpeed: "Speed(km/h)", colAngle: "Angle(°)",
  colHeight: "Height(cm)", colDistance: "Dist(cm)", colGrip: "Grip(mm)",
  colPitch: "Pitch(°)", colDatetime: "Date/Time", colOperation: "Action", deleteBtn: "Delete",
  speed: "Speed", close: "Close",
  deleteConfirmMsg: "Delete all history?", cancel: "Cancel", deleting: "Deleting...",
  settingInfoTitle: "About Settings",
  settingInfoFlight: "Flight Shape", settingInfoFlightDesc: "Shape affects drag area. Standard provides high stability; Slim reduces drag for straighter flight.",
  settingInfoShaft: "Shaft Length", settingInfoShaftDesc: "Longer shafts shift the CG toward the tail, improving attitude stability.",
  settingInfoBarrel: "Barrel Length", settingInfoBarrelDesc: "Total barrel length, affecting the CG position design.",
  settingInfoWeight: "Total Weight", settingInfoWeightDesc: "Total weight of the dart. Heavier darts resist air drag better but require more throwing power.",
  settingInfoCg: "CG Position", settingInfoCgDesc: "Center of gravity within the barrel. 0mm = tip, max = barrel length. Front CG prevents nose drop. Shown as an orange ring in 3D view.",
  settingInfoNoteTitle: "※ Omitted parameters", settingInfoNoteDesc: "Barrel diameter, surface finish, shaft material/shape, and tip shape have negligible trajectory effects and are excluded from this simulator.",
  throwInfoTitle: "About Throw Conditions",
  throwInfoSpeed: "Speed", throwInfoSpeedDesc: "Velocity at release. Typically ~2–3 km/h slower at board impact.",
  throwInfoAngle: "Launch Angle", throwInfoAngleDesc: "Vertical angle of throw direction. 0° = horizontal.",
  throwInfoHeight: "Release Height", throwInfoHeightDesc: "Height from floor at the moment of release. Not your body height.",
  throwInfoDistance: "Release Distance", throwInfoDistanceDesc: "Distance stepped past the throw line toward the board (0cm = throw line).",
  throwInfoGrip: "Grip Position", throwInfoGripDesc: "Where you hold the barrel. 0mm = tip, max = barrel length. Shown as a blue ring in 3D view.",
  throwInfoPitch: "Initial Pitch", throwInfoPitchDesc: "Tilt angle of the dart axis at release. 0° = horizontal.",
  throwInfoNoteTitle: "※ About lateral deviation and spin", throwInfoNoteDesc: "Real throws involve lateral deviation and spin, but these depend on individual form and are non-deterministic. Given dart's symmetry and short flight distance, lateral aerodynamic effects are minimal. This simulator focuses on reproducible vertical-plane physics — gravity, drag, and attitude change — for clear comparison of setups.",
  gripInfoMsg1: "Barrel tip = 0mm, rear = barrel length.", gripInfoMsg2: "Shown as a blue ring in the 3D view.",
  historyInfoMsg: "History is automatically deleted after a period of inactivity.",
  labelFontSize: "12px",
};

const zh: Translation = {
  langName: "中文（简体）", flag: "🇨🇳",
  appTitle: "飞镖轨迹模拟器", cameraHeight: "视角高度", cameraLR: "视角左右",
  rule: "规则", ruleSOFT: "软镖 (244cm)", ruleHARD: "硬镖 (237cm)",
  settingSection: "设置", throwSection: "投掷条件",
  flightShapeLabel: "镖翼形状",
  flightNameSTANDARD: "标准型", flightNameSHAPE: "形状型",
  flightNameTEARDROP: "泪滴型", flightNameKITE: "风筝型", flightNameSLIM: "细长型",
  shaftLength: "杆长 (mm)", barrelLength: "桶长 (mm)",
  totalWeight: "总重量 (g)", cgRatio: "重心位置 (mm)",
  initialSpeed: "初速 (km/h)", launchAngle: "发射角度 (°)",
  releaseHeight: "释放高度 (cm)", releaseDistance: "释放距离 (cm)",
  gripRatio: "握持位置 (mm)", initialPitch: "初始仰角 (°)",
  throwBtn: "投掷", calculating: "计算中...",
  historyTitle: "历史记录", showAll: "全部显示", hideAll: "全部隐藏",
  deleteAll: "全部删除", prev: "上一页", next: "下一页",
  colColor: "颜色", colVisible: "显示", colFlight: "镖翼",
  colShaft: "杆长(mm)", colBarrel: "桶长(mm)", colWeight: "重量(g)",
  colCg: "重心(mm)", colSpeed: "初速(km/h)", colAngle: "角度(°)",
  colHeight: "高度(cm)", colDistance: "距离(cm)", colGrip: "握持(mm)",
  colPitch: "仰角(°)", colDatetime: "执行时间", colOperation: "操作", deleteBtn: "删除",
  speed: "速度", close: "关闭",
  deleteConfirmMsg: "确定删除所有历史记录？", cancel: "取消", deleting: "删除中...",
  settingInfoTitle: "关于设置",
  settingInfoFlight: "镖翼形状", settingInfoFlightDesc: "形状影响空气阻力面积。标准型稳定性高，细长型阻力小、直线性强。",
  settingInfoShaft: "杆长", settingInfoShaftDesc: "越长重心越靠近尾部，镖翼的姿态稳定效果越好。",
  settingInfoBarrel: "桶长", settingInfoBarrelDesc: "飞镖桶的全长，影响重心位置的设计。",
  settingInfoWeight: "总重量", settingInfoWeightDesc: "飞镖整体重量。越重受空气阻力影响越小，直线性越强，但需要相应更大的初速。",
  settingInfoCg: "重心位置", settingInfoCgDesc: "桶内重心的位置。0mm为前端，最大值为桶长mm。前重心不易低头。3D视图中以橙色圆环显示。",
  settingInfoNoteTitle: "※ 省略的参数", settingInfoNoteDesc: "桶的直径、表面处理、杆的材质/形状、镖尖形状等对飞行轨迹影响极小，因此本模拟器中已省略。",
  throwInfoTitle: "关于投掷条件",
  throwInfoSpeed: "初速", throwInfoSpeedDesc: "释放时的速度。到达靶盘时通常减速约2〜3 km/h。",
  throwInfoAngle: "发射角度", throwInfoAngleDesc: "以水平为0°，设置发射方向的上下角度。",
  throwInfoHeight: "释放高度", throwInfoHeightDesc: "释放飞镖瞬间距地面的高度，不是身高。",
  throwInfoDistance: "释放距离", throwInfoDistanceDesc: "以投掷线为0cm，向靶盘方向踏入的距离。",
  throwInfoGrip: "握持位置", throwInfoGripDesc: "握持桶的位置。0mm为前端，最大值为桶长mm。3D视图中以蓝色圆环显示。",
  throwInfoPitch: "初始仰角", throwInfoPitchDesc: "释放时飞镖轴的倾斜角度，以水平为0°。",
  throwInfoNoteTitle: "※ 关于左右偏差和旋转", throwInfoNoteDesc: "实际投掷中也会产生左右偏差和旋转，但这些受个人手法影响较大，不是可唯一确定的物理参数。本模拟器专注于可重现的垂直面物理——重力、空气阻力和姿态变化，以便清晰比较不同设置的差异。",
  gripInfoMsg1: "桶的前端为 0mm，后端为桶长 mm。", gripInfoMsg2: "3D视图中以蓝色圆环显示。",
  historyInfoMsg: "若应用程序一段时间无操作，历史记录将自动全部删除。",
  labelFontSize: "14px",
};

const zhTW: Translation = {
  langName: "中文（繁體）", flag: "🇹🇼",
  appTitle: "飛鏢軌跡模擬器", cameraHeight: "視角高度", cameraLR: "視角左右",
  rule: "規則", ruleSOFT: "軟鏢 (244cm)", ruleHARD: "硬鏢 (237cm)",
  settingSection: "設定", throwSection: "投擲條件",
  flightShapeLabel: "鏢翼形狀",
  flightNameSTANDARD: "標準型", flightNameSHAPE: "形狀型",
  flightNameTEARDROP: "淚滴型", flightNameKITE: "風箏型", flightNameSLIM: "細長型",
  shaftLength: "桿長 (mm)", barrelLength: "桶長 (mm)",
  totalWeight: "總重量 (g)", cgRatio: "重心位置 (mm)",
  initialSpeed: "初速 (km/h)", launchAngle: "發射角度 (°)",
  releaseHeight: "釋放高度 (cm)", releaseDistance: "釋放距離 (cm)",
  gripRatio: "握持位置 (mm)", initialPitch: "初始仰角 (°)",
  throwBtn: "投擲", calculating: "計算中...",
  historyTitle: "歷史記錄", showAll: "全部顯示", hideAll: "全部隱藏",
  deleteAll: "全部刪除", prev: "上一頁", next: "下一頁",
  colColor: "顏色", colVisible: "顯示", colFlight: "鏢翼",
  colShaft: "桿長(mm)", colBarrel: "桶長(mm)", colWeight: "重量(g)",
  colCg: "重心(mm)", colSpeed: "初速(km/h)", colAngle: "角度(°)",
  colHeight: "高度(cm)", colDistance: "距離(cm)", colGrip: "握持(mm)",
  colPitch: "仰角(°)", colDatetime: "執行時間", colOperation: "操作", deleteBtn: "刪除",
  speed: "速度", close: "關閉",
  deleteConfirmMsg: "確定刪除所有歷史記錄？", cancel: "取消", deleting: "刪除中...",
  settingInfoTitle: "關於設定",
  settingInfoFlight: "鏢翼形狀", settingInfoFlightDesc: "形狀影響空氣阻力面積。標準型穩定性高，細長型阻力小、直線性強。",
  settingInfoShaft: "桿長", settingInfoShaftDesc: "越長重心越靠近尾部，鏢翼的姿態穩定效果越好。",
  settingInfoBarrel: "桶長", settingInfoBarrelDesc: "飛鏢桶的全長，影響重心位置的設計。",
  settingInfoWeight: "總重量", settingInfoWeightDesc: "飛鏢整體重量。越重受空氣阻力影響越小，直線性越強，但需要相應更大的初速。",
  settingInfoCg: "重心位置", settingInfoCgDesc: "桶內重心的位置。0mm為前端，最大值為桶長mm。前重心不易低頭。3D視圖中以橙色圓環顯示。",
  settingInfoNoteTitle: "※ 省略的參數", settingInfoNoteDesc: "桶的直徑、表面處理、桿的材質/形狀、鏢尖形狀等對飛行軌跡影響極小，因此本模擬器中已省略。",
  throwInfoTitle: "關於投擲條件",
  throwInfoSpeed: "初速", throwInfoSpeedDesc: "釋放時的速度。到達靶盤時通常減速約2〜3 km/h。",
  throwInfoAngle: "發射角度", throwInfoAngleDesc: "以水平為0°，設置發射方向的上下角度。",
  throwInfoHeight: "釋放高度", throwInfoHeightDesc: "釋放飛鏢瞬間距地面的高度，不是身高。",
  throwInfoDistance: "釋放距離", throwInfoDistanceDesc: "以投擲線為0cm，向靶盤方向踏入的距離。",
  throwInfoGrip: "握持位置", throwInfoGripDesc: "握持桶的位置。0mm為前端，最大值為桶長mm。3D視圖中以藍色圓環顯示。",
  throwInfoPitch: "初始仰角", throwInfoPitchDesc: "釋放時飛鏢軸的傾斜角度，以水平為0°。",
  throwInfoNoteTitle: "※ 關於左右偏差和旋轉", throwInfoNoteDesc: "實際投擲中也會產生左右偏差和旋轉，但這些受個人手法影響較大，不是可唯一確定的物理參數。本模擬器專注於可重現的垂直面物理——重力、空氣阻力和姿態變化，以便清晰比較不同設定的差異。",
  gripInfoMsg1: "桶的前端為 0mm，後端為桶長 mm。", gripInfoMsg2: "3D視圖中以藍色圓環顯示。",
  historyInfoMsg: "若應用程式一段時間無操作，歷史記錄將自動全部刪除。",
  labelFontSize: "14px",
};

const ko: Translation = {
  langName: "한국어", flag: "🇰🇷",
  appTitle: "다트 궤도 시뮬레이터", cameraHeight: "카메라 높이", cameraLR: "카메라 좌우",
  rule: "규칙", ruleSOFT: "소프트 (244cm)", ruleHARD: "하드 (237cm)",
  settingSection: "설정", throwSection: "투척 조건",
  flightShapeLabel: "플라이트 형태",
  flightNameSTANDARD: "스탠다드", flightNameSHAPE: "쉐이프",
  flightNameTEARDROP: "티어드롭", flightNameKITE: "카이트", flightNameSLIM: "슬림",
  shaftLength: "샤프트 길이 (mm)", barrelLength: "배럴 길이 (mm)",
  totalWeight: "총 중량 (g)", cgRatio: "무게중심 위치 (mm)",
  initialSpeed: "초속 (km/h)", launchAngle: "발사 각도 (°)",
  releaseHeight: "릴리즈 높이 (cm)", releaseDistance: "릴리즈 거리 (cm)",
  gripRatio: "그립 위치 (mm)", initialPitch: "초기 자세 각도 (°)",
  throwBtn: "던지기", calculating: "계산 중...",
  historyTitle: "기록", showAll: "모두 표시", hideAll: "모두 숨기기",
  deleteAll: "전체 삭제", prev: "이전", next: "다음",
  colColor: "색상", colVisible: "표시", colFlight: "플라이트",
  colShaft: "샤프트(mm)", colBarrel: "배럴(mm)", colWeight: "중량(g)",
  colCg: "무게중심(mm)", colSpeed: "초속(km/h)", colAngle: "각도(°)",
  colHeight: "높이(cm)", colDistance: "거리(cm)", colGrip: "그립(mm)",
  colPitch: "자세각(°)", colDatetime: "실행 일시", colOperation: "작업", deleteBtn: "삭제",
  speed: "속도", close: "닫기",
  deleteConfirmMsg: "모든 기록을 삭제하시겠습니까?", cancel: "취소", deleting: "삭제 중...",
  settingInfoTitle: "설정에 대해",
  settingInfoFlight: "플라이트 형태", settingInfoFlightDesc: "형태에 따라 공기저항 면적이 달라집니다. 스탠다드는 안정성이 높고, 슬림은 저항이 적어 직진성이 높아집니다.",
  settingInfoShaft: "샤프트 길이", settingInfoShaftDesc: "길수록 무게중심이 테일 쪽으로 이동하여 플라이트에 의한 자세 안정 효과가 높아집니다.",
  settingInfoBarrel: "배럴 길이", settingInfoBarrelDesc: "배럴의 전체 길이입니다. 무게중심 위치 설계에 영향을 줍니다.",
  settingInfoWeight: "총 중량", settingInfoWeightDesc: "다트 전체의 중량입니다. 무거울수록 공기저항의 영향을 받기 어렵고 직진성이 높아지지만, 그에 맞는 초속이 필요합니다.",
  settingInfoCg: "무게중심 위치", settingInfoCgDesc: "배럴 내 무게중심의 위치입니다. 앞끝이 0mm, 최대값은 배럴 길이(mm). 앞 무게중심일수록 노즈가 내려가기 어렵습니다. 3D 화면에서 주황색 링으로 표시됩니다.",
  settingInfoNoteTitle: "※ 생략된 항목에 대해", settingInfoNoteDesc: "배럴의 두께·표면 가공, 샤프트의 소재·형태, 팁의 형태 등은 비행 궤도에 미치는 영향이 매우 미미하여 이 시뮬레이터에서는 설정 항목에서 제외했습니다.",
  throwInfoTitle: "투척 조건에 대해",
  throwInfoSpeed: "초속", throwInfoSpeedDesc: "릴리즈 시의 속도입니다. 보드 도달 시 일반적으로 약 2~3 km/h 감속합니다.",
  throwInfoAngle: "발사 각도", throwInfoAngleDesc: "수평을 0°로 하여 발사 방향의 상하 각도를 설정합니다.",
  throwInfoHeight: "릴리즈 높이", throwInfoHeightDesc: "다트를 릴리즈하는 순간의 바닥으로부터의 높이입니다. 신장이 아닙니다.",
  throwInfoDistance: "릴리즈 거리", throwInfoDistanceDesc: "스로 라인을 0cm로 하여 보드 방향으로 내딛은 거리를 설정합니다.",
  throwInfoGrip: "그립 위치", throwInfoGripDesc: "배럴을 쥐는 위치입니다. 앞끝이 0mm, 최대값은 배럴 길이(mm). 3D 화면에서 파란색 링으로 표시됩니다.",
  throwInfoPitch: "초기 자세 각도", throwInfoPitchDesc: "릴리즈 시 다트 축의 기울기입니다. 수평을 0°로 합니다.",
  throwInfoNoteTitle: "※ 좌우 흔들림·회전에 대해", throwInfoNoteDesc: "실제 스로에서는 좌우 방향의 흔들림이나 회전도 발생하지만, 이는 폼이나 손끝의 습관에 따른 개인차가 크며 물리적으로 일의적으로 결정되는 파라미터가 아닙니다. 이 시뮬레이터는 재현성이 높은 수직면의 물리에 집중함으로써 세팅의 차이를 명확하게 비교할 수 있도록 설계되었습니다.",
  gripInfoMsg1: "배럴의 앞끝이 0mm, 뒤끝이 배럴 길이(mm)입니다.", gripInfoMsg2: "3D 화면에서 파란색 링으로 표시됩니다.",
  historyInfoMsg: "앱 조작이 일정 시간 없으면 기록이 자동으로 전체 삭제됩니다.",
  labelFontSize: "14px",
};


const th: Translation = {
  langName: "ภาษาไทย", flag: "🇹🇭",
  appTitle: "โปรแกรมจำลองวิถีดาร์ท", cameraHeight: "ความสูงกล้อง", cameraLR: "กล้องซ้าย/ขวา",
  rule: "กฎ", ruleSOFT: "ซอฟต์ (244cm)", ruleHARD: "ฮาร์ด (237cm)",
  settingSection: "การตั้งค่า", throwSection: "เงื่อนไขการขว้าง",
  flightShapeLabel: "รูปทรงปีก",
  flightNameSTANDARD: "มาตรฐาน", flightNameSHAPE: "เชพ",
  flightNameTEARDROP: "หยดน้ำตา", flightNameKITE: "ว่าว", flightNameSLIM: "สลิม",
  shaftLength: "ความยาวก้าน (mm)", barrelLength: "ความยาวลำ (mm)",
  totalWeight: "น้ำหนักรวม (g)", cgRatio: "ตำแหน่ง CG (mm)",
  initialSpeed: "ความเร็วต้น (km/h)", launchAngle: "มุมยิง (°)",
  releaseHeight: "ความสูงปล่อย (cm)", releaseDistance: "ระยะปล่อย (cm)",
  gripRatio: "ตำแหน่งจับ (mm)", initialPitch: "มุมเริ่มต้น (°)",
  throwBtn: "ขว้าง", calculating: "กำลังคำนวณ...",
  historyTitle: "ประวัติ", showAll: "แสดงทั้งหมด", hideAll: "ซ่อนทั้งหมด",
  deleteAll: "ลบทั้งหมด", prev: "ก่อนหน้า", next: "ถัดไป",
  colColor: "สี", colVisible: "แสดง", colFlight: "ปีก",
  colShaft: "ก้าน(mm)", colBarrel: "ลำ(mm)", colWeight: "น้ำหนัก(g)",
  colCg: "CG(mm)", colSpeed: "ความเร็ว(km/h)", colAngle: "มุม(°)",
  colHeight: "ความสูง(cm)", colDistance: "ระยะ(cm)", colGrip: "จับ(mm)",
  colPitch: "มุมเอียง(°)", colDatetime: "วันที่/เวลา", colOperation: "การดำเนินการ", deleteBtn: "ลบ",
  speed: "ความเร็ว", close: "ปิด",
  deleteConfirmMsg: "ต้องการลบประวัติทั้งหมดใช่ไหม?", cancel: "ยกเลิก", deleting: "กำลังลบ...",
  settingInfoTitle: "เกี่ยวกับการตั้งค่า",
  settingInfoFlight: "รูปทรงปีก", settingInfoFlightDesc: "รูปทรงส่งผลต่อพื้นที่ต้านอากาศ มาตรฐานมีความเสถียรสูง สลิมมีความต้านทานน้อยและตรงกว่า",
  settingInfoShaft: "ความยาวก้าน", settingInfoShaftDesc: "ยิ่งยาว จุดศูนย์กลางมวลยิ่งเลื่อนไปทางหาง ปีกช่วยรักษาท่าทางได้ดีขึ้น",
  settingInfoBarrel: "ความยาวลำ", settingInfoBarrelDesc: "ความยาวรวมของลำดาร์ท ส่งผลต่อการออกแบบตำแหน่ง CG",
  settingInfoWeight: "น้ำหนักรวม", settingInfoWeightDesc: "น้ำหนักรวมของดาร์ท หนักกว่าได้รับผลกระทบจากแรงต้านอากาศน้อยกว่า แต่ต้องการความเร็วต้นที่มากกว่า",
  settingInfoCg: "ตำแหน่ง CG", settingInfoCgDesc: "จุดศูนย์กลางมวลในลำ 0mm = ปลาย, สูงสุด = ความยาวลำ CG ด้านหน้าช่วยไม่ให้ส่วนหัวตก แสดงเป็นวงแหวนสีส้มใน 3D",
  settingInfoNoteTitle: "※ พารามิเตอร์ที่ละไว้", settingInfoNoteDesc: "เส้นผ่านศูนย์กลางลำ การตกแต่งผิว วัสดุ/รูปทรงก้าน และรูปทรงหัวดาร์ทมีผลต่อวิถีน้อยมาก จึงไม่รวมในโปรแกรมนี้",
  throwInfoTitle: "เกี่ยวกับเงื่อนไขการขว้าง",
  throwInfoSpeed: "ความเร็วต้น", throwInfoSpeedDesc: "ความเร็วขณะปล่อย โดยทั่วไปจะช้าลงประมาณ 2–3 km/h เมื่อถึงกระดาน",
  throwInfoAngle: "มุมยิง", throwInfoAngleDesc: "มุมบน-ล่างของทิศทางยิง โดยมี 0° = แนวนอน",
  throwInfoHeight: "ความสูงปล่อย", throwInfoHeightDesc: "ความสูงจากพื้นขณะปล่อยดาร์ท ไม่ใช่ส่วนสูง",
  throwInfoDistance: "ระยะปล่อย", throwInfoDistanceDesc: "ระยะที่ก้าวเข้าไปจากเส้นขว้างไปทางกระดาน (0cm = เส้นขว้าง)",
  throwInfoGrip: "ตำแหน่งจับ", throwInfoGripDesc: "ตำแหน่งที่จับลำดาร์ท 0mm = ปลาย, สูงสุด = ความยาวลำ แสดงเป็นวงแหวนสีน้ำเงินใน 3D",
  throwInfoPitch: "มุมเอียงเริ่มต้น", throwInfoPitchDesc: "มุมเอียงของแกนดาร์ทขณะปล่อย 0° = แนวนอน",
  throwInfoNoteTitle: "※ เกี่ยวกับการเบี่ยงซ้าย-ขวาและการหมุน", throwInfoNoteDesc: "การขว้างจริงอาจมีการเบี่ยงซ้าย-ขวาและการหมุน แต่สิ่งเหล่านี้ขึ้นอยู่กับความนิสัยส่วนตัว โปรแกรมนี้เน้นฟิสิกส์แนวดิ่งที่ทำซ้ำได้เพื่อเปรียบเทียบการตั้งค่าต่างๆ อย่างชัดเจน",
  gripInfoMsg1: "ปลายลำ = 0mm, ท้ายลำ = ความยาวลำ", gripInfoMsg2: "แสดงเป็นวงแหวนสีน้ำเงินใน 3D",
  historyInfoMsg: "ประวัติจะถูกลบโดยอัตโนมัติหากไม่มีการใช้งานในช่วงเวลาหนึ่ง",
  labelFontSize: "12px",
};


export const translations: Record<LangCode, Translation> = {
  ja, en, zh, 'zh-TW': zhTW, ko, th,
};
