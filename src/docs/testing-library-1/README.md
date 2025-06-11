# 実践@testing-library/vue

## 前回のおさらい

前回はTesting Trophyの概念について説明しました。

- フロントエンドのテストではインテグレーションテスト（複合コンポーネントのテスト）がコスパが高いです
- ユーザー視点でテストを書けるようになりましょう

## 今回のゴール

`@testing-library/vue`の雰囲気を掴み、実践的なテストを書く準備をする。
単一コンポーネントの基本的なテストをするために書き方に慣れる。

## やること

1. Counterコンポーネントのテスト見本を見て`@vue/test-utils`と`@testing-library/vue`の比較
2. Counterコンポーネントのテストの練習問題で実践
   1. 練習問題1をやります。練習問題2は次回か宿題。
   2. 環境はどちらか選択
      1. [GitHub](https://github.com/x7ddf74479jn5/lesson-vue-testing-library)をクローン
      2. [StackBlitz](https://stackblitz.com/~/github.com/x7ddf74479jn5/lesson-vue-testing-library)

## 資料など

|            | ファイル                                                                |
| ---------- | ----------------------------------------------------------------------- |
| テスト対象 | [Counter.vue](../../components/Counter.vue)                             |
| 見本       | [Counter.example.spec.ts](../../components/Counter.example.spec.ts)     |
| 練習問題1  | [Counter.exercise.spec.ts](../../components/Counter.exercise.spec.ts)   |
| 解答1      | [Counter.answer.spec.ts](./Counter.answer.spec.ts)                      |
| 練習問題2  | [Counter.exercise2.spec.ts](../../components/Counter.exercise2.spec.ts) |
| 解答2      | [Counter.answer2.spec.ts](./Counter.answer2.spec.ts)                    |

### チートシート

- [Jest DOM チートシート](../cheatsheet/jest-dom-cheatsheet.md)
- [User Event チートシート](../cheatsheet//user-event-cheatsheet.md)
- [Vue Testing Library チートシート](../cheatsheet//vue-testing-library-cheatsheet.md)

## リンク

- StackBlitz: [https://stackblitz.com/~/github.com/x7ddf74479jn5/lesson-vue-testing-library](https://stackblitz.com/~/github.com/x7ddf74479jn5/lesson-vue-testing-library)
- GitHub: [https://github.com/x7ddf74479jn5/lesson-vue-testing-library](https://github.com/x7ddf74479jn5/lesson-vue-testing-library)
