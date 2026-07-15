import Task from "../models/Task.js";

export async function add(interaction) {
  try {
    // Discordの入力フォームから値を取得する
    const subject = interaction.options.getString("subject");
    const title = interaction.options.getString("title");
    const deadlineStr = interaction.options.getString("deadline");

    // Task.create() を使って PostgreSQL に保存する
    await Task.create({
      userId: interaction.user.id, // コマンドを実行したユーザーのDiscord ID
      subject: subject,            // 科目名
      title: title,                // 課題名
      deadline: deadlineStr,       // 締切（YYYY-MM-DD）
      completed: false             // 完了フラグ（最初は未完了）
    });

    // Discordに完了の返信する
    await interaction.reply(
      `✅ 課題を登録しました！\n` +
      `**科目**: ${subject}\n` +
      `**課題**: ${title}\n` +
      `**締切**: ${deadlineStr}`
    );

  } catch (error) {
    console.error("課題の登録中にエラーが発生しました:", error);
    await interaction.reply({
      content: "❌ 課題の登録中にエラーが発生しました。",
      ephemeral: true
    });
  }
}