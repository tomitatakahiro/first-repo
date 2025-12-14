"use client";

import { useState } from "react";

// 1件分の記録の形
type LogEntry = {
  id: number;
  message: string; // コメント
  createdAt: string; // 日時
  intensity: number; // 今回のムカつき度（連打回数）
  comfort: string; // AIからのひと言
};

// ランダムに1つ選ぶヘルパー
const pickOne = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

// 「今日」を表すキー（例：2025-12-04）
const getTodayKey = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// コメント内容に応じた寄り添いメッセージを作る
const generateComfortMessage = (intensity: number, rawMessage: string): string => {
  const message = rawMessage.trim();

  // 連打回数を使った共感パート
  const intensityPart =
    intensity > 0
      ? `今回だけで ${intensity} 回も「ムカついた」と感じるくらい、かなり心がすり減りましたよね。`
      : `ちゃんと言葉にしてくれてありがとう。その気持ちを無視せずに見つめているだけでも十分すごいです。`;

  // キーワード群
  const sockPatterns = ["靴下", "洗濯", "服", "片付け"];
  const ignorePatterns = ["無視", "既読", "既読スルー", "返事", "LINE"];
  const timePatterns = ["遅刻", "時間", "約束", "待たされた"];
  const moneyPatterns = ["お金", "浪費", "借金", "ギャンブル"];
  const wordPatterns = ["一言", "言い方", "暴言", "ひどい", "傷つく"];

  // 専用メッセージたち
  const sockMessages = [
    "靴下や服のこと、毎回あなたがフォローしてあげてるんですね。本来なら『ありがとう』って言われていいレベルの気遣いですよ。",
    "片付けや洗濯って、やって当たり前みたいに扱われがちだけど、本当はすごくエネルギーを使うことですよね。",
  ];

  const ignoreMessages = [
    "無視されたり、返事がない時間って、本当に心細くてしんどいですよね。あなたの感じた寂しさは、ごく自然なものです。",
    "連絡が返ってこない時間って、ただの『待ち時間』じゃなくて、心が削られる時間でもありますよね。",
  ];

  const timeMessages = [
    "時間を大事にしてもらえない感じって、『自分を軽く扱われている』みたいで本当に嫌ですよね。",
    "約束の時間って、その人への信頼とセットですもんね。その期待を裏切られたら、ムカつくのは当然です。",
  ];

  const moneyMessages = [
    "お金の価値観が合わないストレスって、表に出しづらいのに、実はすごく重たいですよね。",
    "将来のことを考えているからこそ、お金の使い方には敏感になりますよね。あなたの感覚はとてもまっとうです。",
  ];

  const wordMessages = [
    "たった一言で深く傷つくことってありますよね。その痛みを『気のせい』にしなかったあなたは、とても誠実です。",
    "言い方ひとつで、受け取り方はまったく変わりますよね。そのモヤモヤをちゃんと感じ取れている自分を、少しだけ褒めてあげてください。",
  ];

  const heavyMessages = [
    "ここまでよく耐えてきましたね。本当に頑張っていますよ。",
    "これだけしんどい中でも、冷静に記録している自分がいる。それだけで、あなたには前に進む力がちゃんとあります。",
    "『もう限界かも』って思う前に、こうして吐き出せているのは、とても大事なことです。",
  ];

  const midMessages = [
    "ちゃんと『嫌だった』と自分の気持ちを認められているのが、本当に素敵です。",
    "モヤモヤをなかったことにせず、こうして残しておけるあなたは、とても優しくて強い人です。",
    "しんどかったですね。その気持ちを一人で抱え込まなくて大丈夫ですよ。",
  ];

  const lightMessages = [
    "ちょっとしたイラっとも、積み重なると大きなストレスになりますよね。こうして小出しにするのはとても良い習慣です。",
    "小さな違和感に気づけるのは、感受性が豊かだからこそです。その感覚は、これからの自分を守ってくれる力にもなります。",
  ];

  const tinyMessages = [
    "今日も自分の心の動きをちゃんとキャッチできていますね。それだけでも立派なセルフケアです。",
    "少しモヤっとした自分を責めなくて大丈夫です。その感情に気づけた自分を、そっとねぎらってあげてください。",
  ];

  // 内容（キーワード）で寄り添う
  if (message && sockPatterns.some((kw) => message.includes(kw))) {
    return `${pickOne(sockMessages)} ${intensityPart}`;
  }
  if (message && ignorePatterns.some((kw) => message.includes(kw))) {
    return `${pickOne(ignoreMessages)} ${intensityPart}`;
  }
  if (message && timePatterns.some((kw) => message.includes(kw))) {
    return `${pickOne(timeMessages)} ${intensityPart}`;
  }
  if (message && moneyPatterns.some((kw) => message.includes(kw))) {
    return `${pickOne(moneyMessages)} ${intensityPart}`;
  }
  if (message && wordPatterns.some((kw) => message.includes(kw))) {
    return `${pickOne(wordMessages)} ${intensityPart}`;
  }

  // 内容が特にヒットしない場合は、しんどさ（連打回数）で寄り添う
  if (intensity >= 15) {
    return `${pickOne(heavyMessages)} ${intensityPart}`;
  }
  if (intensity >= 8) {
    return `${pickOne(midMessages)} ${intensityPart}`;
  }
  if (intensity >= 3) {
    return `${pickOne(lightMessages)} ${intensityPart}`;
  }
  return `${pickOne(tinyMessages)} ${intensityPart}`;
};

export default function Home() {
  // 総合連打回数（これまでの全部）
  const [totalCount, setTotalCount] = useState(0);
  // 満足度のカウント
  const [manzokuCount, setManzokuCount] = useState(0);
  // 今日のムカつき度（本日の合計）
  const [todayCount, setTodayCount] = useState(0);
  const [todayKey, setTodayKey] = useState(getTodayKey());
  // 今回のムカつき度（このエピソード分）
  const [episodeCount, setEpisodeCount] = useState(0);
  // 入力中のコメント
  const [comment, setComment] = useState("");
  // ログ一覧
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // ムカつきボタン（+1）
  const handleTap = () => {
    const currentKey = getTodayKey();

    // 日付が変わっていたら今日のカウントをリセット
    if (currentKey !== todayKey) {
      setTodayKey(currentKey);
      setTodayCount(0);
    }

    setEpisodeCount((v) => v + 1); // 今回のムカつき度
    setTodayCount((v) => v + 1); // 今日の合計
    setTotalCount((v) => v + 1); // 総合
  };

  // 「いいね！」ボタン（ムカつき度を -1 するイメージ）
  const handleTap2 = () => {
    const currentKey = getTodayKey();

    if (currentKey !== todayKey) {
      setTodayKey(currentKey);
      setTodayCount(0);
    }

    setEpisodeCount((v) => Math.max(0, v - 1));
    setTodayCount((v) => Math.max(0, v - 1));
    setTotalCount((v) => Math.max(0, v - 1));
  };

  // 満足度 +1
  const handleManzoku = () => {
    setManzokuCount((v) => v + 1);
  };

  // 満足度 -1
  const handleManzokuMinus = () => {
    setManzokuCount((v) => Math.max(0, v - 1));
  };

  // 記録ボタン
  const handleAddLog = () => {
    if (episodeCount === 0 && !comment.trim()) return;

    const now = new Date();
    const comfort = generateComfortMessage(episodeCount, comment);

    const newEntry: LogEntry = {
      id: logs.length + 1,
      message: comment.trim() || "（コメントなし）",
      createdAt: now.toLocaleString("ja-JP"),
      intensity: episodeCount,
      comfort,
    };

    // 新しいログを先頭に追加
    setLogs([newEntry, ...logs]);
    // 今回のムカつき度とコメントはリセット（今日の合計は残す）
    setEpisodeCount(0);
    setComment("");
  };

  // 今日の分だけリセット（ムカつき）
  const handleResetToday = () => {
    setTodayCount(0);
    setEpisodeCount(0);
  };

  // 全部リセット
  const handleResetAll = () => {
    setTotalCount(0);
    setTodayCount(0);
    setEpisodeCount(0);
    setComment("");
    setLogs([]);
    setTodayKey(getTodayKey());
    setManzokuCount(0);
  };

  // 報告書（PDF）出力
  const handlePrintReport = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center gap-6 rounded-3xl bg-white px-10 py-12 text-black shadow-xl ring-1 ring-zinc-100 dark:bg-zinc-900 dark:text-white dark:ring-zinc-800">
        <h1 className="text-3xl font-semibold">旦那ムカつきカウンター</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          ムカッとした回数を連打でカウントして、そのときの気持ちとAIからのなぐさめを残しておきましょう。
        </p>

        {/* カウンター＆入力エリア */}
        <div className="flex w-full flex-col gap-4 rounded-2xl bg-zinc-100 px-8 py-6 text-center dark:bg-zinc-800">
          {/* 上段：総合＋今日 */}
          <div className="flex flex-wrap justify-around gap-6">
            <div>
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-300">
                総合連打回数（これまでの合計）
              </div>
              <div className="text-5xl font-bold tabular-nums">{totalCount}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-300">
                今日のムカつき度（本日の合計）
              </div>
              <div className="text-4xl font-bold tabular-nums">{todayCount} 回</div>
            </div>
          </div>

          {/* 今回のエピソード分 */}
          <div>
            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-300">
              今回のムカつき度（このエピソードの連打回数）
            </div>
            <div className="text-3xl font-bold tabular-nums">{episodeCount} 回</div>
          </div>

          {/* 満足度 */}
          <div>
            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-300">
              満足度
            </div>
            <div className="text-3xl font-bold tabular-nums">{manzokuCount} 回</div>
          </div>

          {/* ボタン群 */}
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <button
              className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              onClick={handleTap}
            >
              ムカついた！（連打してね）
            </button>
            <button
              className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              onClick={handleTap2}
            >
              いいね！（連打してね）
            </button>
            <button
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-700"
              onClick={handleResetToday}
            >
              今日の分だけリセット
            </button>
            <button
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-700"
              onClick={handleManzoku}
            >
              満足度 +
            </button>
            <button
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-700"
              onClick={handleManzokuMinus}
            >
              満足度 −
            </button>
            <button
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-700"
              onClick={handleResetAll}
            >
              すべてリセット
            </button>
          </div>

          {/* コメント入力 */}
          <div className="mt-4 flex w-full flex-col gap-2 text-left">
            <label className="text-sm font-medium text-zinc-600 dark:text-zinc-200">
              今回のムカつきコメント
            </label>
            <textarea
              className="min-h-[80px] w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-400 dark:focus:ring-zinc-700"
              placeholder="例）『今それ言う？』って一言が刺さった…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>※ムカつき度 {episodeCount} 回 とコメントをまとめて記録します</span>
              <span>コメントなしでも連打だけで記録できます</span>
            </div>

            <div className="flex justify-end">
              <button
                className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                onClick={handleAddLog}
                disabled={episodeCount === 0 && !comment.trim()}
              >
                この内容で記録する
              </button>
            </div>
          </div>
        </div>

        {/* ログ ＋ 報告書ボタン */}
        <section className="w-full">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-left text-lg font-semibold">ムカつきログ</h2>
            <button
              className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-700 disabled:opacity-40"
              onClick={handlePrintReport}
              disabled={logs.length === 0}
            >
              夫への報告書をPDF保存（印刷）
            </button>
          </div>

          {logs.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              まだ記録はありません。ムカッときたら上で連打＆コメントしてみてください。
            </p>
          ) : (
            <ul className="flex flex-col gap-2 text-sm">
              {logs.map((log) => (
                <li
                  key={log.id}
                  className="rounded-2xl bg-zinc-100 px-4 py-3 text-left dark:bg-zinc-800"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {log.createdAt}
                    </div>
                    <div className="text-xs font-medium text-zinc-700 dark:text-zinc-200">
                      ムカつき度：{log.intensity} 回
                    </div>
                  </div>
                  <div className="mt-1 whitespace-pre-wrap">・{log.message}</div>
                  <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-300">
                    AIからのひと言：{log.comfort}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
