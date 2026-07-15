import { SlashCommandBuilder } from "discord.js";
import Task from "../models/Task.js";
// 【修正】インポートの名前を GoogleGenerativeAI に修正
import { GoogleGenerativeAI } from "@google/generative-ai";

// 【修正】クラス名を GoogleGenerativeAI に修正（APIキーは環境変数から読み込み）
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const add = {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("新しい課題を登録します（AIアドバイス付き）")
    .addStringOption(option =>
      option.setName("subject").setDescription("科目名（例：プログラミング）").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("title").setDescription("課題内容（例：最終レポート）").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("deadline").setDescription("締切（例：2026-07-19）").setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const subject = interaction.options.getString("subject");
    const title = interaction.options.getString("title");
    const deadline = interaction.options.getString("deadline");
    const userId = interaction.user.id;

    try {
      // 1. PostgreSQLに保存
      const task = await Task.create({
        subject,
        title,
        deadline,
        userId,
        completed: false
      });

      // 2. Geminiによる課題アドバイス生成
      let aiAdvice = "（AIアドバイスを取得できませんでした）";
      try {
        // 【修正】正しいモデル取得の書き方に変更
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `あなたは優秀な学習支援アシスタントです。大学生が「${subject}」の講義で「${title}」という課題（締切：${deadline}）を登録しました。この課題を効率的に終わらせるための具体的な手順やアドバイスを、3文以内でフレンドリーに教えてください。`;
        const result = await model.generateContent(prompt);
        aiAdvice = result.response.text();
      } catch (aiError) {
        console.error("AI生成エラー:", aiError);
      }

      // 3. 結果を送信
      await interaction.editReply({
        content: `✅ **課題を登録しました！** (ID: ${task.id})\n📚 **科目**: ${subject}\n📌 **課題**: ${title}\n📅 **締切**: ${deadline}\n\n🤖 **Geminiからのアドバイス:**\n${aiAdvice}`
      });

    } catch (error) {
      console.error(error);
      await interaction.editReply("❌ 課題の登録中にエラーが発生しました。入力形式を確認してください。");
    }
  }
};