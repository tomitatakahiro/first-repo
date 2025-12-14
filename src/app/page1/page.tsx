"use client";

import { useState, useRef } from "react";

// 出せる手の一覧（ラベルと画像パス）
const hands = [
  { id: "グー" as const, label: "✊ グー", image: "/hand_gu-1.png" },
  { id: "チョキ" as const, label: "✌ チョキ", image: "/hand_tyoki1.png" },
  { id: "パー" as const, label: "🖐 パー", image: "/hand_pa-1.png" },
];

type HandId = (typeof hands)[number]["id"];
type ResultType = "win" | "lose" | "draw" | null;

// 履歴1件分の型
type HistoryItem = {
  id: number;
  user: HandId;
  cpu: HandId;
  result: Exclude<ResultType, null>; // null 以外
};

const Page1 = () => {
  const [userHand, setUserHand] = useState<HandId | null>(null);
  const [cpuHand, setCpuHand] = useState<HandId | null>(null);
  const [resultType, setResultType] = useState<ResultType>(null);
  const [resultMessage, setResultMessage] = useState<string>("");

  // 勝敗履歴
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // ★ 音声用の ref
  const jankenAudioRef = useRef<HTMLAudioElement | null>(null);
  const ponAudioRef = useRef<HTMLAudioElement | null>(null);

  // 手の画像パスを取ってくる
  const findHandImage = (id: HandId | null) => {
    if (!id) return null;
    return hands.find((h) => h.id === id)?.image ?? null;
  };

  // 勝敗に応じた画像パス
  const getResultImage = (type: ResultType): string | null => {
    if (type === "win") return "/kati.jpg"; // 勝ち
    if (type === "lose") return "/make.jpg"; // 負け
    if (type === "draw") return "/aiko.jpg"; // あいこ
    return null;
  };

  // 共通：HTMLAudioElement から音を鳴らす
  const playFromRef = (audio: HTMLAudioElement | null) => {
    if (!audio) return;
    audio.currentTime = 0; // 毎回頭から再生
    audio.play().catch(() => {});
  };

  // スタートボタン押下：じゃんけん！の音
  const handleStart = () => {
    playFromRef(jankenAudioRef.current);
  };

  // 手のボタンを押したとき
  const onClickHand = (handId: HandId) => {
    // 「ポン！」の音
    playFromRef(ponAudioRef.current);

    // CPUの手をランダムに選ぶ
    const randomIndex = Math.floor(Math.random() * hands.length);
    const cpu = hands[randomIndex].id;

    setUserHand(handId);
    setCpuHand(cpu);

    let currentResult: ResultType;

    // 勝敗判定
    if (handId === cpu) {
      currentResult = "draw";
      setResultMessage("あいこです！");
    } else {
      const isWin =
        (handId === "グー" && cpu === "チョキ") ||
        (handId === "チョキ" && cpu === "パー") ||
        (handId === "パー" && cpu === "グー");

      if (isWin) {
        currentResult = "win";
        setResultMessage("あなたの勝ち！🎉");
      } else {
        currentResult = "lose";
        setResultMessage("あなたの負け…😢");
      }
    }

    setResultType(currentResult);

    // 履歴を追加
    if (currentResult !== null) {
      setHistory((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          user: handId,
          cpu,
          result: currentResult,
        },
      ]);
    }
  };

  // 戦績を計算
  const winCount = history.filter((h) => h.result === "win").length;
  const loseCount = history.filter((h) => h.result === "lose").length;
  const drawCount = history.filter((h) => h.result === "draw").length;

  const resultImage = getResultImage(resultType);

  // リセットボタン
  const handleReset = () => {
    setUserHand(null);
    setCpuHand(null);
    setResultType(null);
    setResultMessage("");
    setHistory([]);
  };

  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "sans-serif",
        textAlign: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fafafa",
      }}
    >
      <h1>じゃんけんアプリ（イラスト＋音付き）</h1>
      <p>まずスタートを押して、「じゃんけん！」を聞いてから手を選んでね！</p>

      {/* 音声タグ（画面には見えない） */}
      {/* ★ ファイル名 jyanken.m4a に合わせています */}
      <audio ref={jankenAudioRef} src="/jyanken.m4a" />
      <audio ref={ponAudioRef} src="/pon.m4a" />

      {/* スタートボタン */}
      <div style={{ marginTop: "24px", marginBottom: "16px" }}>
        <button
          onClick={handleStart}
          style={{
            padding: "12px 36px",
            fontSize: "20px",
            cursor: "pointer",
            borderRadius: "999px",
            border: "none",
            backgroundColor: "#ff9800",
            color: "#fff",
            fontWeight: "bold",
            boxShadow: "0 4px 0 #c77600",
          }}
        >
          ▶ スタート
        </button>
      </div>

      {/* 手のボタン */}
      <div
        style={{
          marginTop: "8px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        {hands.map((hand) => (
          <button
            key={hand.id}
            onClick={() => onClickHand(hand.id)}
            style={{
              padding: "10px 24px",
              fontSize: "18px",
              cursor: "pointer",
              borderRadius: "999px",
              border: "2px solid #333",
              backgroundColor: "#ffffff",
              fontWeight: "bold",
            }}
          >
            {hand.label}
          </button>
        ))}
      </div>

      {/* 戦績とリセットボタン */}
      <div style={{ marginBottom: "20px" }}>
        <h2>戦績</h2>
        <p style={{ fontSize: "18px" }}>
          {winCount}勝 {loseCount}敗 {drawCount}分
        </p>
        <button
          onClick={handleReset}
          style={{
            marginTop: "8px",
            padding: "6px 20px",
            fontSize: "14px",
            cursor: "pointer",
            borderRadius: "999px",
            border: "1px solid #666",
            backgroundColor: "#fff",
          }}
        >
          すべてリセット
        </button>
      </div>

      {/* 手のイラスト表示エリア */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          marginTop: "10px",
        }}
      >
        {/* 自分の手 */}
        <div>
          <h2>あなたの手</h2>
          {userHand ? (
            <>
              <img
                src={findHandImage(userHand) ?? ""}
                alt={userHand}
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "contain",
                }}
              />
              <p style={{ marginTop: "10px", fontSize: "18px" }}>{userHand}</p>
            </>
          ) : (
            <p>まだ出していません</p>
          )}
        </div>

        {/* 相手の手 */}
        <div>
          <h2>コンピュータの手</h2>
          {cpuHand ? (
            <>
              <img
                src={findHandImage(cpuHand) ?? ""}
                alt={cpuHand}
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "contain",
                }}
              />
              <p style={{ marginTop: "10px", fontSize: "18px" }}>{cpuHand}</p>
            </>
          ) : (
            <p>まだ出していません</p>
          )}
        </div>
      </div>

      {/* 勝敗画像（ページ下寄り） */}
      <div
        style={{
          marginTop: "40px",
          flexGrow: 1,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        {resultType && resultImage && (
          <div style={{ textAlign: "center" }}>
            <h2 style={{ marginBottom: "16px", fontSize: "24px" }}>
              {resultMessage}
            </h2>
            <img
              src={resultImage}
              alt={resultType}
              style={{
                width: "250px",
                height: "250px",
                objectFit: "contain",
              }}
            />
          </div>
        )}
      </div>

      {/* 勝敗履歴 */}
      <div style={{ marginTop: "20px" }}>
        <h2>勝敗の履歴</h2>
        {history.length === 0 ? (
          <p>まだ対戦していません</p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              maxWidth: "400px",
              margin: "0 auto",
              textAlign: "left",
              fontSize: "14px",
            }}
          >
            {history
              .slice()
              .reverse()
              .map((item) => (
                <li
                  key={item.id}
                  style={{
                    borderBottom: "1px solid #ccc",
                    padding: "4px 0",
                  }}
                >
                  No.{item.id} ： あなた「{item.user}」 / コンピュータ「
                  {item.cpu}」 →{" "}
                  {item.result === "win"
                    ? "勝ち"
                    : item.result === "lose"
                    ? "負け"
                    : "あいこ"}
                </li>
              ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default Page1;
