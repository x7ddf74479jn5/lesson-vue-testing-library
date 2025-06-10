# 実践@testing-library/vue

## 前回のおさらい

前回はTesting Trophyの概念について説明しました。

- フロントエンドのテストではインテグレーションテスト（複合コンポーネントのテスト）がコスパが高いです
- ユーザー視点でテストを書けるようになりましょう

## 今回のゴール

`@testing-library/vue`の雰囲気を掴む

## やること

- Counterコンポーネントのテスト見本を見て`@vue/test-utils`と`@testing-library/vue`の比較
- Counterコンポーネントのテストの練習問題で実践
  - StackBlitz: [https://stackblitz.com/~/github.com/x7ddf74479jn5/lesson-vue-testing-library](https://stackblitz.com/~/github.com/x7ddf74479jn5/lesson-vue-testing-library)
  - GitHub: [https://github.com/x7ddf74479jn5/lesson-vue-testing-library](https://github.com/x7ddf74479jn5/lesson-vue-testing-library)

## 資料など

|            | ファイル                                                              |
| ---------- | --------------------------------------------------------------------- |
| テスト対象 | [Counter.vue](../../components/Counter.vue)                           |
| 見本       | [Counter.example.spec.ts](../../components/Counter.example.spec.ts)   |
| 練習問題   | [Counter.exercise.spec.ts](../../components/Counter.exercise.spec.ts) |
| 解答       | [Counter.answer.spec.ts](./Counter.answer.spec.ts)                    |

### チートシート

- [Jest DOM チートシート](../cheatsheet/jest-dom-cheatsheet.md)
- [User Event チートシート](../cheatsheet//user-event-cheatsheet.md)
- [Vue Testing Library チートシート](../cheatsheet//vue-testing-library-cheatsheet.md)
