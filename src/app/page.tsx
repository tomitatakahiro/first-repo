"use client";

import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center gap-6 rounded-3xl bg-white px-10 py-12 text-black shadow-xl ring-1 ring-zinc-100 dark:bg-zinc-900 dark:text-white dark:ring-zinc-800">
        <h1 className="text-3xl font-semibold">カウントアップ</h1>
        <p className="text-zinc-600 dark:text-zinc-400">ボタンを押して数を増やしてください。</p>
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-zinc-100 px-8 py-6 text-center dark:bg-zinc-800">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-300">現在のカウント</span>
          <span className="text-6xl font-bold tabular-nums">{count}</span>
          <div className="flex gap-3">
            <button className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover-bg-zinc-200" onClick={() => setCount((v) => v + 1)}>
              カウントアップ
            </button>
            <button className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-700" onClick={() => setCount(0)}>
              リセット
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
