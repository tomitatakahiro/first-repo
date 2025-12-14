"use client";

import { useState, KeyboardEvent } from "react";

type BadgeType = "neutral" | "ok" | "wait";

const Page = () => {
  const [topic, setTopic] = useState("");
  const [yano, setYano] = useState("");
  const [resultVisible, setResultVisible] = useState(false);
  const [verdict, setVerdict] = useState("");
  const [reason, setReason] = useState("");
  const [badgeText, setBadgeText] = useState("-");
  const [badgeType, setBadgeType] = useState<BadgeType>("neutral");

  const handleJudge = () => {
    const trimmedTopic = topic.trim();
    const trimmedYano = yano.trim();

    if (!trimmedTopic || !trimmedYano) {
      setResultVisible(true);
      setVerdict("まずは両方の欄をちゃんと入力しましょう。");
      setReason(
        "・「相手が何を話しているか」と\n" +
          "・「矢野さんが何を話したいか」\n" +
          "この2つを書いてから判定ボタンを押してください。"
      );
      setBadgeText("入力不足");
      setBadgeType("neutral");
      return;
    }

    const topicLen = trimmedTopic.length;
    const yanoLen = trimmedYano.length;
    const lenRatio = yanoLen / (topicLen + 1); // 0除算防止

    const selfishKeywords = [
      "自慢",
      "俺",
      "オレ",
      "私が",
      "昔は",
      "若い頃",
      "すごい",
      "偉い",
      "武勇伝",
    ];

    const questionKeywords = [
      "？",
      "か？",
      "どう思う",
      "大丈夫",
      "平気",
      "手伝おうか",
      "聞いてもいい",
      "教えて",
    ];

    let selfishScore = 0;
    let questionScore = 0;

    selfishKeywords.forEach((k) => {
      if (trimmedYano.includes(k)) selfishScore++;
    });
    questionKeywords.forEach((k) => {
      if (trimmedYano.includes(k)) questionScore++;
    });

    let v = "";
    let r = "";
    let bText: string;
    let bType: BadgeType;

    if (lenRatio > 2 && selfishScore >= 1) {
      v = "【今日はやめておきましょう】";
      r =
        "・相手の話よりも、矢野さんの話の方がかなり長くなりそうです。\n" +
        "・しかも自己アピール・武勇伝っぽい要素が混じっています。\n" +
        "今はグッとこらえて、「最後まで聞く力」を鍛えるチャンスかもしれません。";
      bText = "待った！";
      bType = "wait";
    } else if (lenRatio > 1.5 && selfishScore === 0 && questionScore === 0) {
      v = "【一度、相手が話し終わるまで待つのが吉】";
      r =
        "・矢野さんの話が少し長くなりそうです。\n" +
        "・ただし、自慢や武勇伝ではなさそうなので、タイミングの問題です。\n" +
        "いったん「最後まで聞く→ワンテンポ置いてから」話し始めると、印象がぐっと良くなります。";
      bText = "様子見";
      bType = "neutral";
    } else if (questionScore >= 1 && lenRatio <= 2) {
      v = "【そっと質問してみても良さそう】";
      r =
        "・矢野さんの発言は「問いかけ」や「確認」が含まれており、相手に寄り添う内容です。\n" +
        "・話の腰を折らないように、相手の区切りを待ってから、短く質問してみましょう。";
      bText = "OK";
      bType = "ok";
    } else if (selfishScore >= 2) {
      v = "【今日は心の中だけにとどめておきましょう】";
      r =
        "・発言内容に自己アピールや武勇伝要素がかなり強く含まれています。\n" +
        "・今それを言うと、「また割り込んできた」と思われる可能性大です。\n" +
        "メモアプリに書き出して満足する、という使い方もアリです。";
      bText = "危険";
      bType = "wait";
    } else {
      v = "【短く一言なら入ってもよさそう】";
      r =
        "・長さも極端ではなく、自己自慢にも偏っていないようです。\n" +
        "・「まず相手の話を要約してから、一言だけ添える」を意識すると、割り込み感がかなり減ります。\n" +
        "例）「つまり◯◯ってことだよね。そのうえで、ひとつだけ言ってもいい？」";
      bText = "まあOK";
      bType = "ok";
    }

    setVerdict(v);
    setReason(r);
    setBadgeText(bText);
    setBadgeType(bType);
    setResultVisible(true);
  };

  const handleClear = () => {
    setTopic("");
    setYano("");
    setResultVisible(false);
    setVerdict("");
    setReason("");
    setBadgeText("-");
    setBadgeType("neutral");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleJudge();
    }
  };

  const badgeStyleBase: React.CSSProperties = {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: "0.75rem",
    marginLeft: 4,
  };

  const badgeStyle: React.CSSProperties =
    badgeType === "ok"
      ? {
          ...badgeStyleBase,
          background: "#dcfce7",
          color: "#166534",
        }
      : badgeType === "wait"
      ? {
          ...badgeStyleBase,
          background: "#fee2e2",
          color: "#991b1b",
        }
      : {
          ...badgeStyleBase,
          background: "#e5e7eb",
          color: "#374151",
        };

  return (
    <div
      style={{
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        background: "#f5f5f7",
        minHeight: "100vh",
        margin: 0,
        padding: 24,
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: 800,
          width: "100%",
          background: "#ffffff",
          borderRadius: 16,
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
          padding: "24px 20px 28px",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            marginTop: 0,
            fontSize: "1.6rem",
            textAlign: "center",
          }}
        >
          エマフィルター
        </h1>
        <p
          style={{
            textAlign: "center",
            fontSize: "0.9rem",
            color: "#666",
            marginBottom: 16,
          }}
        >
          「ちょっと待てよ、その一言。本当に今、言うべき？」をチェックするAI
        </p>

        <div style={{ marginTop: 16 }}>
          <label
            htmlFor="topic"
            style={{ display: "block", fontWeight: 600, fontSize: "0.95rem" }}
          >
            相手はなにを話していますか？
          </label>
          <textarea
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="例）仕事のミスについて真剣に反省しているところです。"
            style={{
              width: "100%",
              minHeight: 80,
              marginTop: 6,
              borderRadius: 10,
              border: "1px solid #ddd",
              padding: 10,
              fontSize: "0.95rem",
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <label
            htmlFor="yano"
            style={{ display: "block", fontWeight: 600, fontSize: "0.95rem" }}
          >
            エマさんはなにを話たいですか？
          </label>
          <textarea
            id="yano"
            value={yano}
            onChange={(e) => setYano(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="例）昔の自分の武勇伝を話したい／アドバイスしてあげたい など"
            style={{
              width: "100%",
              minHeight: 80,
              marginTop: 6,
              borderRadius: 10,
              border: "1px solid #ddd",
              padding: 10,
              fontSize: "0.95rem",
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />
        </div>

        <div
          style={{
            marginTop: 18,
            display: "flex",
            gap: 8,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={handleJudge}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "10px 22px",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: "pointer",
              background: "#4f46e5",
              color: "#fff",
              boxShadow: "0 4px 10px rgba(79, 70, 229, 0.3)",
            }}
          >
            AIに判定してもらう
          </button>
          <button
            type="button"
            onClick={handleClear}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "10px 22px",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: "pointer",
              background: "#e5e7eb",
              color: "#111827",
            }}
          >
            入力をクリア
          </button>
        </div>

        {resultVisible && (
          <div
            style={{
              marginTop: 22,
              borderRadius: 12,
              padding: "14px 14px 16px",
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                marginBottom: 6,
                fontSize: "0.95rem",
              }}
            >
              判定結果
              <span style={badgeStyle}>{badgeText}</span>
            </div>
            <div
              style={{
                fontSize: "1rem",
                marginBottom: 6,
              }}
            >
              {verdict}
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                color: "#4b5563",
                whiteSpace: "pre-line",
              }}
            >
              {reason}
            </div>
          </div>
        )}

        <div
          style={{
            marginTop: 10,
            fontSize: "0.8rem",
            color: "#9ca3af",
            textAlign: "right",
          }}
        >
          ※中身のAIロジックは簡易版です。本気で人間関係を守りたいときは、深呼吸もセットでどうぞ。
        </div>
      </div>
    </div>
  );
};

export default Page;
